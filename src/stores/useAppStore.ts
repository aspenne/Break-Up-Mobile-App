import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

interface AppState {
  hasCompletedOnboarding: boolean;
  lastOpenedTab: string;
  lastQuoteDate: string | null;
  lastMoodPromptDate: string | null;
  completeOnboarding: () => void;
  setLastOpenedTab: (tab: string) => void;
  markQuoteSeenToday: () => void;
  markMoodPromptSeenToday: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      lastOpenedTab: 'HomeTab',
      lastQuoteDate: null,
      lastMoodPromptDate: null,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setLastOpenedTab: (tab) => set({ lastOpenedTab: tab }),
      markQuoteSeenToday: () =>
        set({ lastQuoteDate: new Date().toISOString().slice(0, 10) }),
      markMoodPromptSeenToday: () =>
        set({ lastMoodPromptDate: new Date().toISOString().slice(0, 10) }),
      resetApp: () =>
        set({
          hasCompletedOnboarding: false,
          lastOpenedTab: 'HomeTab',
          lastQuoteDate: null,
          lastMoodPromptDate: null,
        }),
    }),
    {
      name: 'breakup-app-store',
      storage: zustandStorage,
    }
  )
);
