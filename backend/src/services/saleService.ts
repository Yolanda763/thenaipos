import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const saleService = {
  async createSale(data: any, userId: string, outletId: string) {
    try {
      const saleNumber = `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const sale = await prisma.sale.create({
        data: {
          saleNumber,
          userId,
          outletId,
          customerId: data.customerId || null,
          subtotal: data.subtotal,
          discountAmount: data.discountAmount || 0,
          discountType: data.discountType,
          discountValue: data.discountValue || 0,
          tax: data.tax || 0,
          grandTotal: data.grandTotal,
          status: 'COMPLETED',
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discountAmount: item.discountAmount || 0,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true, payments: true },
      });

      // Update stock
      for (const item of data.items) {
        await prisma.productStock.updateMany({
          where: {
            productId: item.productId,
            outletId,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        // Create inventory log
        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            outletId,
            logType: 'SALE',
            quantity: item.quantity,
            notes: `Sale ${saleNumber}`,
          },
        });
      }

      // Create payment
      if (data.paymentMethod) {
        await prisma.payment.create({
          data: {
            saleId: sale.id,
            method: data.paymentMethod,
            amount: data.grandTotal,
            referenceNumber: data.referenceNumber,
            status: 'COMPLETED',
          },
        });
      }

      // Update customer if exists
      if (data.customerId) {
        await prisma.customer.update({
          where: { id: data.customerId },
          data: {
            totalSpent: {
              increment: data.grandTotal,
            },
            totalTransactions: {
              increment: 1,
            },
          },
        });
      }

      logger.info(`Sale created: ${saleNumber}`);

      // Emit real-time event
      (global as any).io?.emit('sale:completed', {
        id: sale.id,
        saleNumber: sale.saleNumber,
        grandTotal: sale.grandTotal,
        timestamp: new Date(),
      });

      return sale;
    } catch (error) {
      throw error;
    }
  },

  async getSales(outletId: string, filters?: any) {
    try {
      const where: any = { outletId };

      if (filters?.startDate && filters?.endDate) {
        where.createdAt = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const sales = await prisma.sale.findMany({
        where,
        include: {
          items: { include: { product: true } },
          payments: true,
          user: true,
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: ((filters?.page || 1) - 1) * (filters?.limit || 50),
      });

      const total = await prisma.sale.count({ where });

      return { sales, total };
    } catch (error) {
      throw error;
    }
  },

  async getSaleById(id: string) {
    try {
      const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          payments: true,
          user: true,
          customer: true,
        },
      });

      if (!sale) {
        throw new AppError(404, 'Sale not found');
      }

      return sale;
    } catch (error) {
      throw error;
    }
  },
};
