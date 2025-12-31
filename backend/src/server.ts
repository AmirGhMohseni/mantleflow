import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import Business from './models/Business';
import businessRoutes from './routes/businessRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Sync database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    
    // Create test business with ownerAddress
    const [business] = await Business.findOrCreate({
      where: { ownerAddress: '0x1234567890123456789012345678901234567890' },
      defaults: { 
        name: 'Test Business',
        ownerAddress: '0x1234567890123456789012345678901234567890' // اضافه کردن ownerAddress
      }
    });
    
    console.log('✅ Test business created/exists');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
}

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'MantleFlow Backend is running!',
    endpoints: {
      health: '/health',
      businesses: '/api/business',
      invoices: '/api/invoice',
      ai_predict: 'POST /api/ai/predict'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    ai_service: process.env.AI_SERVER_URL || 'http://localhost:5000'
  });
});

app.use('/api/business', businessRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/ai', aiRoutes);

// Start server
async function startServer() {
  await syncDatabase();
  
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🤖 AI Server: ${process.env.AI_SERVER_URL || 'http://localhost:5000'}`);
    console.log('🔧 Available endpoints:');
    console.log('   GET  /health');
    console.log('   GET  /api/business');
    console.log('   POST /api/business');
    console.log('   POST /api/ai/predict');
  });
}

startServer();