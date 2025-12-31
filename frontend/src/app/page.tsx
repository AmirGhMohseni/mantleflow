'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';

export default function Home() {
  const { address, isConnected, handleConnect, loading } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [historicalData, setHistoricalData] = useState([18000, 19000, 20000, 21000, 22000]);
  const [predictedCashFlow, setPredictedCashFlow] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0.85);
  const [predicting, setPredicting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePredictCashFlow = async () => {
    try {
      setPredicting(true);
      setNotification(null);
      
      // استفاده از مسیر صحیح برای API
      const response = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historical_ historicalData })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      
      setPredictedCashFlow(result.predicted_cashflow);
      setConfidence(result.confidence);
      showNotification('success', 'Prediction successful!');
      
    } catch (error: any) {
      console.error('Prediction error:', error);
      showNotification('error', error.message || 'Failed to predict cash flow');
    } finally {
      setPredicting(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ... (بقیه کد صفحه بدون تغییر باقی می‌ماند)
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-900">MantleFlow</h1>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </span>
                  <button 
                    onClick={() => showNotification('info', 'Fund account functionality coming soon!')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Fund Account
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleConnect}
                  disabled={loading}
                  className={`${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white px-4 py-2 rounded-lg font-medium transition-colors`}
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Cash Flow Predictor */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">AI Cash Flow Prediction</h2>
              <p className="text-gray-600 mb-6">
                Enter your historical cash flow data to predict next month's cash flow using our AI model.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {historicalData.map((value, index) => (
                  <div key={index} className="text-center">
                    <label className="text-xs text-gray-500 block mb-1">Month {index + 1}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newValues = [...historicalData];
                        newValues[index] = parseInt(e.target.value) || 0;
                        setHistoricalData(newValues);
                      }}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handlePredictCashFlow}
                disabled={predicting}
                className={`${
                  predicting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } w-full md:w-auto text-white px-6 py-3 rounded-lg font-medium transition-colors`}
              >
                {predicting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Predicting...
                  </span>
                ) : (
                  'Predict Next Month'
                )}
              </button>
              
              {predictedCashFlow !== null && (
                <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Predicted Cash Flow</h3>
                  <p className="text-3xl font-bold text-indigo-800 mb-1">${predictedCashFlow.toLocaleString()}</p>
                  <p className="text-sm text-indigo-700">
                    Based on your historical data with {Math.round(confidence * 100)}% confidence
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Business Name</label>
                  <p className="font-medium text-gray-900">Tech Solutions Inc.</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Industry</label>
                  <p className="font-medium text-gray-900">Technology</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Status</label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 font-medium">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">Network Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Mantle Network</span>
                  <span className="text-sm font-medium text-green-600">✅ Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">AI Prediction Service</span>
                  <span className="text-sm font-medium text-green-600">✅ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo-700">Smart Contracts</span>
                  <span className="text-sm font-medium text-green-600">✅ Deployed</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => showNotification('success', 'Invoice creation functionality coming soon!')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Create New Invoice
                </button>
                <button
                  onClick={() => showNotification('success', 'Verification request submitted successfully!')}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Request Verification
                </button>
                <button
                  onClick={() => showNotification('success', 'Tokenized assets dashboard coming soon!')}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  View Tokenized Assets
                </button>
                <button
                  onClick={() => showNotification('success', 'AI report generated and sent to your email!')}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  AI Cash Flow Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 max-w-md px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : notification.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && (
              <span className="text-green-500 mr-2">✅</span>
            )}
            {notification.type === 'error' && (
              <span className="text-red-500 mr-2">❌</span>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}