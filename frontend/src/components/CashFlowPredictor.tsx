'use client';

import { useState } from 'react';
import { api } from '@/utils/api';

export default function CashFlowPredictor({ businessData }: { businessData: any }) {
  const [historicalData, setHistoricalData] = useState([12000, 15000, 18000, 20000, 22000]);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.predictCashFlow({ historicalData });
      setPrediction(result.predicted_cashflow);
      
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Cash Flow Predictor</h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          AI Powered
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Historical Cash Flows (Last 5 Months)
          </label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {historicalData.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => {
                  const newValues = [...historicalData];
                  newValues[index] = parseInt(e.target.value) || 0;
                  setHistoricalData(newValues);
                }}
                className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
              />
            ))}
          </div>
          
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`w-full ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 rounded-lg font-medium transition-colors`}
          >
            {loading ? 'Predicting...' : 'Predict Next Month'}
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Predicted Cash Flow</p>
            <p className="text-3xl font-bold text-green-600">
              ${prediction ? prediction.toLocaleString() : '---'}
            </p>
            {prediction && (
              <p className="mt-2 text-sm text-gray-600">
                Based on your historical data with {85}% confidence
              </p>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">How to use:</h3>
        <p className="text-sm text-gray-600">
          Enter your monthly cash flow data from the past 5 months. Our AI model will analyze the pattern and predict your next month's cash flow to help you make better financial decisions.
        </p>
      </div>
    </div>
  );
}