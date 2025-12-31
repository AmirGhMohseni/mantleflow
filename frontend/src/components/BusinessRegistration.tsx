'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { api } from '@/utils/api';

export default function BusinessRegistration({ onComplete }: { onComplete: (data: any) => void }) {
  const { address, isConnected } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    historicalCashFlows: ['', '', '', '', ''],
    industry: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictedCashFlow, setPredictedCashFlow] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // تبدیل داده‌های تاریخی به اعداد
      const historicalData = formData.historicalCashFlows
        .filter(val => val && !isNaN(Number(val)))
        .map(val => Number(val));

      // پیش‌بینی جریان نقدی
      if (historicalData.length >= 2) {
        const prediction = await api.predictCashFlow({ historicalData });
        setPredictedCashFlow(prediction.predicted_cashflow);
      }

      // در محیط توسعه، داده‌های تست ذخیره می‌شن
      if (process.env.NODE_ENV === 'development') {
        const mockBusiness = {
          id: 1,
          name: formData.name,
          description: formData.description,
          cashFlowPrediction: predictedCashFlow || 10000,
          ownerAddress: address || '0x1234567890abcdef1234567890abcdef12345678',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onComplete(mockBusiness);
        return;
      }

      // ثبت کسب‌وکار در محیط واقعی
      const businessData = await api.registerBusiness({
        name: formData.name,
        description: formData.description,
        cashFlowPrediction: predictedCashFlow || 10000,
        ownerAddress: address
      });

      onComplete(businessData);

    } catch (err: any) {
      setError(err.message || 'Failed to register business. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Register Your Business</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              placeholder="e.g., Tech Startup Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="Brief description of your business..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historical Cash Flows (Last 5 Months)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {formData.historicalCashFlows.map((value, index) => (
                <input
                  key={index}
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...formData.historicalCashFlows];
                    newValues[index] = e.target.value;
                    setFormData({...formData, historicalCashFlows: newValues});
                  }}
                  placeholder={`Month ${index + 1}`}
                  className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                />
              ))}
            </div>
            {predictedCashFlow && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                Predicted next month cash flow: ${predictedCashFlow.toFixed(2)}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter your monthly cash flow data for better prediction accuracy
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Industry</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isConnected}
            className={`w-full ${isConnected ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 px-6 rounded-lg transition-colors font-medium disabled:opacity-50`}
          >
            {isLoading ? 'Registering...' : isConnected ? 'Register Business' : 'Connect Wallet First'}
          </button>
        </form>
      </div>
    </div>
  );
}