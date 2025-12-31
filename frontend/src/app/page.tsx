'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';

export default function Home() {
  const { address, isConnected, connect, connectors } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [historicalData, setHistoricalData] = useState([18000, 19000, 20000, 21000, 22000]);
  const [predictedCashFlow, setPredictedCashFlow] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0.85);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePredictCashFlow = async () => {
    try {
      setLoading(true);
      setNotification(null);
      
      const response = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historicalData })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPredictedCashFlow(result.predicted_cashflow);
        setConfidence(result.confidence);
        showNotification('success', 'Prediction successful!');
      } else {
        throw new Error(result.error || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      showNotification('error', 'Failed to predict cash flow');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    showNotification('success', 'Invoice created successfully! Transaction pending...');
    // در عمل اینجا با قرارداد هوشمند ارتباط برقرار می‌شود
    setTimeout(() => {
      showNotification('success', '✅ Invoice created and tokenized on Mantle Network!');
    }, 2000);
  };

  const handleRequestVerification = () => {
    showNotification('success', 'Verification request submitted! Processing...');
    setTimeout(() => {
      showNotification('success', '✅ Business verification approved! Status updated.');
    }, 3000);
  };

  const handleViewAssets = () => {
    showNotification('success', 'Showing tokenized assets dashboard...');
    // در عمل اینجا دارایی‌های توکن‌شده نمایش داده می‌شوند
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Fund Account
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => connect({ connector: connectors[0] })}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Connect Wallet
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {historicalData.map((value, index) => (
                  <div key={index} className="text-center">
                    <label className="text-xs text-gray-500 block">Month {index + 1}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newValues = [...historicalData];
                        newValues[index] = parseInt(e.target.value) || 0;
                        setHistoricalData(newValues);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handlePredictCashFlow}
                  disabled={loading}
                  className={`${
                    loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Predicting...
                    </span>
                  ) : (
                    'Predict Next Month'
                  )}
                </button>
              </div>
              
              {predictedCashFlow !== null && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Predicted Cash Flow</h3>
                  <p className="text-2xl font-bold text-indigo-800 mb-1">${predictedCashFlow.toLocaleString()}</p>
                  <p className="text-sm text-indigo-700">
                    Based on your historical data with {Math.round(confidence * 100)}% confidence
                  </p>
                </div>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
                <button 
                  onClick={handleCreateInvoice}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + Create New Invoice
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">INV-001</td>
                      <td className="px-6 py-4 whitespace-nowrap">$1,500</td>
                      <td className="px-6 py-4 whitespace-nowrap">Jan 15, 2026</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">INV-002</td>
                      <td className="px-6 py-4 whitespace-nowrap">$2,300</td>
                      <td className="px-6 py-4 whitespace-nowrap">Jan 20, 2026</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Info</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Business Name</label>
                  <p className="font-medium">Tech Solutions Inc.</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Industry</label>
                  <p className="font-medium">Technology</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleCreateInvoice}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📄</span>
                  <span>Create New Invoice</span>
                </button>
                <button
                  onClick={handleRequestVerification}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>✅</span>
                  <span>Request Verification</span>
                </button>
                <button
                  onClick={handleViewAssets}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💰</span>
                  <span>View Tokenized Assets</span>
                </button>
                <button
                  onClick={() => showNotification('success', 'AI report generated and sent to your email!')}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📊</span>
                  <span>AI Cash Flow Report</span>
                </button>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">Network Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-700">Mantle Network</span>
                  <span className="text-sm font-medium text-indigo-800">✅ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-700">AI Prediction Service</span>
                  <span className="text-sm font-medium text-indigo-800">✅ Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-700">Smart Contracts</span>
                  <span className="text-sm font-medium text-indigo-800">✅ Deployed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}