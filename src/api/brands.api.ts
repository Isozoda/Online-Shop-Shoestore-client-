import api from './axios';
import type { Brand } from '../types';

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await api.get('/brands');
    return data.data || data;
  },
};
