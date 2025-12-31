import { Request, Response } from 'express';
import Business from '../models/Business';
import Invoice from '../models/Invoice';

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const businesses = await Business.findAll({
      include: [Invoice]
    });
    res.json(businesses);
  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

export const registerBusiness = async (req: Request, res: Response) => {
  try {
    const { name, ownerAddress } = req.body;
    
    console.log('📝 Registering business with data:', { name, ownerAddress });
    
    if (!name || !ownerAddress) {
      console.error('❌ Validation failed: Missing name or ownerAddress');
      return res.status(400).json({ error: 'Name and ownerAddress are required' });
    }

    // بررسی تکراری بودن آدرس
    const existingBusiness = await Business.findOne({ where: { ownerAddress } });
    if (existingBusiness) {
      console.log('⚠️ Business already exists for address:', ownerAddress);
      return res.status(409).json({ error: 'Business already registered for this address' });
    }

    const business = await Business.create({ name, ownerAddress });
    console.log('✅ Business created successfully:', business.toJSON());
    
    res.status(201).json(business);
  } catch (error: any) {
    console.error('❌ Database error during business registration:', error.message);
    console.error('📊 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    res.status(500).json({ error: 'Failed to register business', details: error.message });
  }
};

export const getBusinessByAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const business = await Business.findOne({
      where: { ownerAddress: address },
      include: [Invoice]
    });
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json(business);
  } catch (error) {
    console.error('❌ Error fetching business by address:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
};