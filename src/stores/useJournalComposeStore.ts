import { create } from 'zustand';
import type { EmotionalState } from '@/types';

interface JournalComposeState {
  emotion: EmotionalState | null;
  promptId: number | null;
  promptQuestion: string | null;
  content: string;
  setEmotion: (value: EmotionalState) => void;
  setPrompt: (id: number | null, question: string | null) => void;
  setContent: (value: string) => void;
  reset: () => void;
}

const initialState = {
  emotion: null,
  promptId: null,
  promptQuestion: null,
  content: '',
};

export const useJournalComposeStore = create<JournalComposeState>((set) => ({
  ...initialState,
  setEmotion: (value) => set({ emotion: value }),
  setPrompt: (id, question) => set({ promptId: id, promptQuestion: question }),
  setContent: (value) => set({ content: value }),
  reset: () => set(initialState),
}));
