import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Business from '../models/Business';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { businessId, amount, dueDate } = req.body;
    const invoice = await Invoice.create({
      amount,
      dueDate: new Date(dueDate),
      businessId
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};
