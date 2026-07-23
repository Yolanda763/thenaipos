import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth';

export const productController = {
  getProducts: asyncHandler(async (req: AuthRequest, res: Response) => {
    const outletId = req.body.outletId || '';
    const products = await productService.getProducts(outletId, {
      limit: parseInt(req.query.limit as string) || 100,
      page: parseInt(req.query.page as string) || 1,
      categoryId: req.query.categoryId,
      search: req.query.search,
    });

    res.json(products);
  }),

  getProductByBarcode: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { barcode } = req.params;
    const outletId = req.body.outletId || '';
    const product = await productService.getProductByBarcode(barcode, outletId);

    res.json(product);
  }),

  createProduct: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { barcode, name, categoryId, cost, price, description, unit } = req.body;

    if (!barcode || !name || !categoryId || !cost || !price) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const product = await productService.createProduct({
      barcode,
      name,
      categoryId,
      cost,
      price,
      description,
      unit,
    });

    res.status(201).json(product);
  }),

  updateProduct: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);

    res.json(product);
  }),
};
