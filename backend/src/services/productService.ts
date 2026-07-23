import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const productService = {
  async getProducts(outletId: string, filters?: any) {
    try {
      const where: any = { isActive: true };

      if (filters?.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { barcode: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          stocks: {
            where: { outletId },
          },
        },
        orderBy: { name: 'asc' },
        take: filters?.limit || 100,
        skip: ((filters?.page || 1) - 1) * (filters?.limit || 100),
      });

      const total = await prisma.product.count({ where });

      return { products, total };
    } catch (error) {
      throw error;
    }
  },

  async getProductByBarcode(barcode: string, outletId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { barcode },
        include: {
          category: true,
          stocks: {
            where: { outletId },
          },
        },
      });

      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      return product;
    } catch (error) {
      throw error;
    }
  },

  async createProduct(data: any) {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingProduct) {
        throw new AppError(400, 'Product with this barcode already exists');
      }

      const product = await prisma.product.create({
        data: {
          barcode: data.barcode,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          cost: data.cost,
          price: data.price,
          unit: data.unit || 'pcs',
        },
        include: { category: true },
      });

      logger.info(`Product created: ${data.barcode} - ${data.name}`);

      return product;
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(id: string, data: any) {
    try {
      const product = await prisma.product.update({
        where: { id },
        data,
        include: { category: true },
      });

      logger.info(`Product updated: ${id}`);

      return product;
    } catch (error) {
      throw error;
    }
  },
};
