import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import Business from './models/Business';
import businessRoutes from './routes/businessRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sync database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    
    // Create test business with ownerAddress
    const [business, created] = await Business.findOrCreate({
      where: { ownerAddress: '0x1234567890123456789012345678901234567890' },
      defaults: { 
        name: 'Test Business',
        ownerAddress: '0x1234567890123456789012345678901234567890'
      }
    });
    
    if (created) {
      console.log('✅ Test business created');
    } else {
      console.log('✅ Test business already exists');
    }
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
}

// Routes with proper types
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'MantleFlow Backend is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/business', businessRoutes);
app.use('/api/invoice', invoiceRoutes);

// Start server
async function startServer() {
  await syncDatabase();
  
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

startServer();