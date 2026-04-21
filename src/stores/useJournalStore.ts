import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

interface JournalState {
  currentStreak: number;
  setStreak: (n: number) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      currentStreak: 0,
      setStreak: (n) => set({ currentStreak: n }),
    }),
    {
      name: 'breakup-journal-store-v2',
      storage: zustandStorage,
    }
  )
);
