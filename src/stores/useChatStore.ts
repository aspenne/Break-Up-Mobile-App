import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

interface ChatState {
  activeRoomId: number | null;
  isNeedToTalkActive: boolean;
  isAnonymous: boolean;
  setActiveRoom: (roomId: number | null) => void;
  toggleNeedToTalk: () => void;
  toggleAnonymous: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeRoomId: null,
      isNeedToTalkActive: false,
      isAnonymous: true,
      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
      toggleNeedToTalk: () =>
        set((state) => ({ isNeedToTalkActive: !state.isNeedToTalkActive })),
      toggleAnonymous: () =>
        set((state) => ({ isAnonymous: !state.isAnonymous })),
    }),
    {
      name: 'breakup-chat-store',
      storage: zustandStorage,
    }
  )
);
