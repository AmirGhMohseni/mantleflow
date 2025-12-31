'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletConnection() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // در محیط توسعه، آدرس تست نمایش داده می‌شه
    if (process.env.NODE_ENV === 'development') {
      const mockAddress = '0x742d35Cc6634C0532925a3b851f7B7B0F4d54C40';
      setAddress(mockAddress);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // تست اتصال به MetaMask
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          throw new Error('No accounts found');
        }
      } else {
        // حالت تست بدون کیف پول
        const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
        setAddress(mockAddress);
        localStorage.setItem('mockWalletAddress', mockAddress);
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      
      // حالت تست بدون کیف پول
      if (process.env.NODE_ENV === 'development') {
        const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
        setAddress(mockAddress);
        localStorage.setItem('mockWalletAddress', mockAddress);
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    localStorage.removeItem('mockWalletAddress');
  };

  return (
    <div className="flex items-center space-x-4">
      {!address ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            loading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</span>
          <button
            onClick={disconnectWallet}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}