import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { Article, ArticleCategory } from '@/types';
import type { PaginatedResponse } from '@/api/types';

export function useArticles(params?: {
  category?: ArticleCategory;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Article>>(
        '/api/blog/articles',
        { params }
      );
      return data;
    },
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: ['articles', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Article>(
        `/api/blog/articles/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: number) => {
      const { data } = await apiClient.post<{ isFavorite: boolean }>(
        `/api/blog/articles/${articleId}/favorite`
      );
      return { articleId, isFavorite: data.isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useFavorites(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['favorites', { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Article>>(
        '/api/blog/favorites',
        { params: { page, limit } }
      );
      return data;
    },
  });
}
