import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginPayload, RegisterPayload } from '../types';

export function useAuth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login, logout: storeLogout } = useAuthStore();

  const token = localStorage.getItem('accessToken');
  const isAuth = isAuthenticated && !!token;

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuth,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      storeLogout();
      queryClient.clear();
      toast.success(t('auth.logoutSuccess'));
      navigate('/');
    },
  });

  return {
    user: currentUser || (isAuth ? user : null),
    isAuthenticated: isAuth,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
