import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type {
  JournalEntry,
  JournalPrompt,
  EmotionalState,
  TimelineEntry,
} from '@/types/journal';
import type { PaginatedResponse } from '@/api/types';

export function useJournalEntries(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['journalEntries', { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<JournalEntry>>(
        '/api/journal/entries',
        { params: { page, limit } }
      );
      return data;
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      emotion: EmotionalState;
      promptId?: number;
    }) => {
      const { data } = await apiClient.post<JournalEntry>(
        '/api/journal/entries',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalTimeline'] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      title?: string;
      content?: string;
      emotion?: EmotionalState;
    }) => {
      const { data } = await apiClient.patch<JournalEntry>(
        `/api/journal/entries/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalTimeline'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/journal/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalTimeline'] });
    },
  });
}

export function useJournalPrompts(daysSinceBreakup?: number) {
  return useQuery({
    queryKey: ['journalPrompts', { daysSinceBreakup }],
    queryFn: async () => {
      const { data } = await apiClient.get<JournalPrompt[]>(
        '/api/journal/prompts',
        {
          params: daysSinceBreakup !== undefined ? { daysSinceBreakup } : undefined,
        }
      );
      return data;
    },
  });
}

export function useJournalTimeline() {
  return useQuery({
    queryKey: ['journalTimeline'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ timeline: TimelineEntry[] }>(
        '/api/journal/timeline'
      );
      return data.timeline;
    },
  });
}
