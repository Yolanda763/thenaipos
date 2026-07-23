import { Request, Response } from 'express';
import { reportService } from '../services/reportService';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth';

export const reportController = {
  getDailySalesReport: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const report = await reportService.getDailySalesReport(outletId, date as string);
    res.json(report);
  }),

  getMonthlyReport: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const report = await reportService.getMonthlyReport(
      outletId,
      parseInt(month as string),
      parseInt(year as string)
    );
    res.json(report);
  }),

  getTopProducts: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const { limit } = req.query;

    const products = await reportService.getTopProducts(outletId, parseInt(limit as string) || 10);
    res.json(products);
  }),

  getInventoryReport: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const report = await reportService.getInventoryReport(outletId);

    res.json(report);
  }),
};
