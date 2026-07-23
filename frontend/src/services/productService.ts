import api from './api';

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductByBarcode: async (barcode: string) => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
};
