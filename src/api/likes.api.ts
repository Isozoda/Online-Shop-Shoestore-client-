import api from './axios';
import type { Product } from '../types';

export const likesApi = {
  getLiked: async (): Promise<Product[]> => {
    const { data } = await api.get('/likes');
    return data.data || data;
  },

  toggle: async (productId: string): Promise<{ liked: boolean }> => {
    const { data } = await api.post(`/likes/${productId}`);
    return data;
  },
};
