import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { Memory, DeletionStage } from '@/types';
import type { PaginatedResponse } from '@/api/types';

export interface MemoryStats {
  deleted: number;
  kept: number;
  hidden: number;
  archived: number;
  sorted: number;
}

export function useMemoryStats() {
  return useQuery({
    queryKey: ['memories', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<MemoryStats>('/api/memories/stats');
      return data;
    },
  });
}

export function useMemories(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['memories', { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Memory>>(
        '/api/memories',
        { params: { page, limit } }
      );
      return data;
    },
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      assetId?: string;
      uri: string;
      thumbnailUri?: string;
      dateTaken?: string;
      stage?: DeletionStage;
    }) => {
      const { data } = await apiClient.post<Memory>('/api/memories', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['memories', 'stats'] });
    },
  });
}

export function useUpdateMemoryStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stage }: { id: number; stage: DeletionStage }) => {
      const { data } = await apiClient.patch<Memory>(`/api/memories/${id}`, {
        stage,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['memories', 'stats'] });
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/memories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['memories', 'stats'] });
    },
  });
}
