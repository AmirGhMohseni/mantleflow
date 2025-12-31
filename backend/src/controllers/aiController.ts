import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// تعریف نوع برای پاسخ AI
interface AIPredictionResponse {
  predicted_cashflow: number;
  confidence: number;
  input_data: number[];
  data_points: number;
  status: string;
  error?: string;
}

interface AIPredictionError {
  error: string;
  details?: any;
}

export const predictCashFlow = async (req: Request, res: Response) => {
  try {
    const { historical_data } = req.body;
    
    if (!historical_data || !Array.isArray(historical_data)) {
      return res.status(400).json({ 
        error: 'historical_data is required and must be an array' 
      });
    }

    console.log('🤖 AI Prediction request:', { historical_data });
    
    // اتصال به سرور AI
    const aiServerUrl = process.env.AI_SERVER_URL || 'http://localhost:5000';
    
    const response = await axios.post<AIPredictionResponse | AIPredictionError>(
      `${aiServerUrl}/predict`,
      { historical_data },
      { timeout: 30000 }
    );
    
    // بررسی خطای پاسخ
    if ('error' in response.data) {
      console.error('❌ AI prediction error:', response.data);
      return res.status(500).json({ 
        error: 'AI prediction failed',
        details: response.data.error 
      });
    }
    
    console.log('✅ AI Prediction result:', response.data);
    res.json(response.data);
    
  } catch (error: any) {
    console.error('❌ AI Controller error:', {
      message: error.message,
      response: error.response?.data,
      request: error.config?.data
    });
    
    // بررسی خطاهای خاص axios
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable',
        details: 'Could not connect to AI server at ' + (process.env.AI_SERVER_URL || 'http://localhost:5000')
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    });
  }
};