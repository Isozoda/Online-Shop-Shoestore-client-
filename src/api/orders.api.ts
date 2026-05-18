import api from './axios';
import type { Order, OrderPayload } from '../types';

export const ordersApi = {
  create: async (payload: OrderPayload): Promise<Order> => {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders/my');
    return data.data || data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};
