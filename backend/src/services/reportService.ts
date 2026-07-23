import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const reportService = {
  async getDailySalesReport(outletId: string, date: string) {
    try {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const sales = await prisma.sale.findMany({
        where: {
          outletId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
          status: 'COMPLETED',
        },
        include: { items: true },
      });

      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.grandTotal.toString()), 0);
      const totalDiscount = sales.reduce((sum, sale) => sum + parseFloat(sale.discountAmount.toString()), 0);

      return {
        date,
        totalSales,
        totalRevenue,
        totalDiscount,
        sales,
      };
    } catch (error) {
      throw error;
    }
  },

  async getMonthlyReport(outletId: string, month: number, year: number) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const sales = await prisma.sale.findMany({
        where: {
          outletId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
          status: 'COMPLETED',
        },
        include: { items: { include: { product: true } } },
      });

      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.grandTotal.toString()), 0);
      const totalCost = sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + (parseFloat(item.product.cost.toString()) * item.quantity), 0);
      }, 0);

      const profit = totalRevenue - totalCost;

      return {
        month,
        year,
        totalSales,
        totalRevenue,
        totalCost,
        profit,
      };
    } catch (error) {
      throw error;
    }
  },

  async getTopProducts(outletId: string, limit: number = 10) {
    try {
      const topProducts = await prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: limit,
      });

      const products = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          return {
            product,
            totalQuantity: item._sum.quantity,
            totalTransactions: item._count,
          };
        })
      );

      return products;
    } catch (error) {
      throw error;
    }
  },

  async getInventoryReport(outletId: string) {
    try {
      const stocks = await prisma.productStock.findMany({
        where: { outletId },
        include: { product: true },
        orderBy: { product: { name: 'asc' } },
      });

      const lowStockItems = stocks.filter((stock) => stock.quantity <= stock.minStock);

      return {
        totalItems: stocks.length,
        lowStockItems: lowStockItems.length,
        stocks,
        lowStockItems,
      };
    } catch (error) {
      throw error;
    }
  },
};
