import api from './axios';
import type { Category } from '../types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data.data || data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },
};
