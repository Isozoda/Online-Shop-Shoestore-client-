import api from './axios';
import type { Review } from '../types';

export const reviewsApi = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.reviews)) return data.reviews;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  getLatest: async (): Promise<Review[]> => {
    try {
      const { data } = await api.get('/reviews/latest');
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.reviews)) return data.reviews;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },


  create: async (productId: string, rating: number, comment: string): Promise<Review> => {
    const { data } = await api.post('/reviews', { productId, rating, comment });
    return data;
  },
};
