import api from './axios';
import type { User, AuthTokens, LoginPayload, RegisterPayload } from '../types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokens & { user: User }> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthTokens & { user: User }> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/users/me', payload);
    return data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/users/me/avatar', formData);
    return data;
  },
};
