import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';
import type {
  OnboardingAnswers,
  SeparationReason,
  TimeSinceSeparation,
  RelationshipDuration,
  OnboardingEmotion,
} from '@/types';

interface OnboardingState {
  answers: OnboardingAnswers;
  toggleReason: (reason: SeparationReason) => void;
  setTimeSince: (value: TimeSinceSeparation) => void;
  setDuration: (value: RelationshipDuration) => void;
  setLoveLevel: (value: number) => void;
  setEmotion: (value: OnboardingEmotion) => void;
  setBreakupDate: (value: string | null) => void;
  reset: () => void;
}

const initialAnswers: OnboardingAnswers = {
  reasons: [],
  timeSince: null,
  duration: null,
  loveLevel: 5,
  emotion: null,
  breakupDate: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: initialAnswers,
      toggleReason: (reason) =>
        set((state) => {
          const reasons = state.answers.reasons.includes(reason)
            ? state.answers.reasons.filter((r) => r !== reason)
            : [...state.answers.reasons, reason];
          return { answers: { ...state.answers, reasons } };
        }),
      setTimeSince: (value) =>
        set((state) => ({ answers: { ...state.answers, timeSince: value } })),
      setDuration: (value) =>
        set((state) => ({ answers: { ...state.answers, duration: value } })),
      setLoveLevel: (value) =>
        set((state) => ({ answers: { ...state.answers, loveLevel: value } })),
      setEmotion: (value) =>
        set((state) => ({ answers: { ...state.answers, emotion: value } })),
      setBreakupDate: (value) =>
        set((state) => ({ answers: { ...state.answers, breakupDate: value } })),
      reset: () => set({ answers: initialAnswers }),
    }),
    {
      name: 'breakup-onboarding-store',
      storage: zustandStorage,
    }
  )
);
