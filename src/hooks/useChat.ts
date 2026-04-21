import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { ChatRoom, Message } from '@/types';
import type { PaginatedResponse } from '@/api/types';

export function useChatRooms(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['chatRooms', { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<ChatRoom>>(
        '/api/chat/rooms',
        { params: { page, limit } }
      );
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      theme: string;
      isDirectMessage?: boolean;
    }) => {
      const { data } = await apiClient.post<ChatRoom>(
        '/api/chat/rooms',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: number) => {
      const { data } = await apiClient.post(
        `/api/chat/rooms/${roomId}/join`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: number) => {
      const { data } = await apiClient.post(
        `/api/chat/rooms/${roomId}/leave`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
}

export function useRoomMessages(roomId: number, page = 1, limit = 50) {
  return useQuery({
    queryKey: ['messages', roomId, { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Message>>(
        `/api/chat/rooms/${roomId}/messages`,
        { params: { page, limit } }
      );
      return data;
    },
    enabled: !!roomId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      content,
      senderName,
    }: {
      roomId: number;
      content: string;
      senderName?: string;
    }) => {
      const { data } = await apiClient.post<Message>(
        `/api/chat/rooms/${roomId}/messages`,
        { content, senderName }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.roomId],
      });
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
}
