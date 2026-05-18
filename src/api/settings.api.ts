import api from './axios';
import type { StoreSettings } from '../types';

export const settingsApi = {
  get: async (): Promise<StoreSettings> => {
    const { data } = await api.get('/settings');
    return data;
  },
};
