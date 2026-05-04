import { create } from 'zustand';
import type { EmotionalState } from '@/types';

interface JournalComposeState {
  emotion: EmotionalState | null;
  customEmotion: string | null;
  promptId: number | null;
  promptQuestion: string | null;
  content: string;
  setEmotion: (value: EmotionalState) => void;
  setCustomEmotion: (value: string | null) => void;
  setPrompt: (id: number | null, question: string | null) => void;
  setContent: (value: string) => void;
  reset: () => void;
}

const initialState = {
  emotion: null as EmotionalState | null,
  customEmotion: null as string | null,
  promptId: null as number | null,
  promptQuestion: null as string | null,
  content: '',
};

export const useJournalComposeStore = create<JournalComposeState>((set) => ({
  ...initialState,
  setEmotion: (value) =>
    set((state) => ({
      emotion: value,
      customEmotion: value === 'other' ? state.customEmotion : null,
    })),
  setCustomEmotion: (value) => set({ customEmotion: value }),
  setPrompt: (id, question) => set({ promptId: id, promptQuestion: question }),
  setContent: (value) => set({ content: value }),
  reset: () => set(initialState),
}));
