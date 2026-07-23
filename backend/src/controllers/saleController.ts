import { Request, Response } from 'express';
import { saleService } from '../services/saleService';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth';

export const saleController = {
  createSale: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { items, customerId, paymentMethod, discountAmount, tax } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const grandTotal = subtotal - (discountAmount || 0) + (tax || 0);

    const sale = await saleService.createSale(
      {
        items,
        customerId,
        paymentMethod,
        discountAmount: discountAmount || 0,
        tax: tax || 0,
        subtotal,
        grandTotal,
      },
      req.userId!,
      req.body.outletId || ''
    );

    res.status(201).json(sale);
  }),

  getSales: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const sales = await saleService.getSales(outletId, {
      limit: parseInt(req.query.limit as string) || 50,
      page: parseInt(req.query.page as string) || 1,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status,
    });

    res.json(sales);
  }),

  getSaleById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const sale = await saleService.getSaleById(req.params.id);
    res.json(sale);
  }),
};
