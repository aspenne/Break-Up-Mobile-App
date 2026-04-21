export interface ChatRoom {
  id: number;
  name: string;
  theme: string;
  participantCount: number;
  isDirectMessage: boolean;
  createdBy: number | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  isMember?: boolean;
}

export interface Message {
  id: number;
  chatRoomId: number;
  senderId: number | null;
  senderName: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string | null;
}
