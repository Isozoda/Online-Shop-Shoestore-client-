import api from './axios';
import type { Banner } from '../types';

export const bannersApi = {
  getAll: async (): Promise<Banner[]> => {
    const { data } = await api.get('/banners');
    return data.data || data;
  },
};
