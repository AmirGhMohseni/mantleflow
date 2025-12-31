// Base URL for backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  // Business endpoints
  async getBusinesses() {
    // حالت تست برای محیط توسعه
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          id: 1,
          name: 'Test Business',
          ownerAddress: '0x1234567890abcdef1234567890abcdef12345678',
          description: 'A demo business',
          cashFlowPrediction: 25000,
          isVerified: true,
          createdAt: new Date().toISOString(),
          Invoices: [
            { id: 1, amount: 5000, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isPaid: false },
            { id: 2, amount: 8000, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), isPaid: true }
          ]
        }
      ];
    }
    
    const response = await fetch(`${API_BASE_URL}/business`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return await response.json();
  },

  async registerBusiness(data: any) {
    // حالت تست برای محیط توسعه
    if (process.env.NODE_ENV === 'development') {
      return {
        ...data,
        id: Math.floor(Math.random() * 1000),
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/business`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to register business');
    return await response.json();
  },

  async getBusinessByAddress(address: string) {
    // حالت تست برای محیط توسعه
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 1,
        name: 'Demo Business',
        ownerAddress: address,
        description: 'Business created for demo purposes',
        cashFlowPrediction: 35000,
        isVerified: true,
        createdAt: new Date().toISOString(),
        Invoices: [
          { id: 1, amount: 10000, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isPaid: false },
          { id: 2, amount: 15000, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), isPaid: true }
        ]
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/business/${address}`);
    if (!response.ok) throw new Error('Failed to fetch business');
    return await response.json();
  },

  // Invoice endpoints
  async createInvoice(data: any) {
    // حالت تست برای محیط توسعه
    if (process.env.NODE_ENV === 'development') {
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        isPaid: false,
        createdAt: new Date().toISOString()
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return await response.json();
  },

  // AI endpoints
  async predictCashFlow(data: any) {
    // حالت تست برای محیط توسعه
    if (process.env.NODE_ENV === 'development') {
      // شبیه‌سازی پیش‌بینی بر اساس داده‌ها
      const avg = data.historicalData.reduce((sum: number, val: number) => sum + val, 0) / data.historicalData.length;
      const prediction = avg * 1.15; // 15% growth
      
      return {
        predicted_cashflow: prediction,
        confidence: Math.min(0.85, data.historicalData.length / 5),
        input_data: data.historicalData,
        data_points: data.historicalData.length,
        status: 'success'
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/ai/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to get prediction');
    return await response.json();
  }
};