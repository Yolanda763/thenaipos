import api from './api';

export const reportService = {
  getDailySalesReport: async (date: string) => {
    const response = await api.get('/reports/sales/daily', { params: { date } });
    return response.data;
  },

  getMonthlyReport: async (month: number, year: number) => {
    const response = await api.get('/reports/sales/monthly', { params: { month, year } });
    return response.data;
  },

  getTopProducts: async (limit?: number) => {
    const response = await api.get('/reports/products/top', { params: { limit } });
    return response.data;
  },

  getInventoryReport: async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
  },
};
