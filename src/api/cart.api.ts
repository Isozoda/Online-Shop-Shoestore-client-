import api from './axios';
import type { Cart } from '../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get('/cart');
    return data;
  },

  addItem: async (productId: string, variantId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post('/cart', { productId, variantId, quantity });
    return data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    return data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete(`/cart/${itemId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
