import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { storage } from '@/utils/storage';
import { useUserStore } from '@/stores';
import type { User } from '@/types';
import type { AuthResponse } from '@/api/types';

export function useMe() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ user: User }>('/api/auth/me');
      return data.user;
    },
    enabled: isAuthenticated,
  });
}

export function useLogin() {
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        credentials
      );
      return data;
    },
    onSuccess: async (data) => {
      await storage.set('accessToken', data.accessToken);
      await storage.set('refreshToken', data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
}

export function useRegister() {
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      avatarEmoji?: string;
    }) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/api/auth/register',
        payload
      );
      return data;
    },
    onSuccess: async (data) => {
      await storage.set('accessToken', data.accessToken);
      await storage.set('refreshToken', data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { data } = await apiClient.post<{ message: string }>(
        '/api/auth/forgot-password',
        payload
      );
      return data;
    },
  });
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: async (payload: { email: string; code: string }) => {
      const { data } = await apiClient.post<{ valid: boolean }>(
        '/api/auth/verify-reset-code',
        payload
      );
      return data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; code: string; password: string }) => {
      const { data } = await apiClient.post<{ message: string }>(
        '/api/auth/reset-password',
        payload
      );
      return data;
    },
  });
}

export function useUpdateProfile() {
  const setUser = useUserStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      firstName?: string;
      lastName?: string;
      avatarEmoji?: string;
      breakupDate?: string;
    }) => {
      const { data } = await apiClient.patch<{ user: User }>('/api/users/me', payload);
      return data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useLogout() {
  const logout = useUserStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/api/auth/logout');
    },
    onSettled: async () => {
      await storage.remove('accessToken');
      await storage.remove('refreshToken');
      logout();
      queryClient.clear();
    },
  });
}
