import api from './api';

export const saleService = {
  createSale: async (data: any) => {
    const response = await api.post('/sales', data);
    return response.data;
  },

  getSales: async (params?: any) => {
    const response = await api.get('/sales', { params });
    return response.data;
  },

  getSaleById: async (id: string) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
};
