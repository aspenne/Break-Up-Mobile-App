export type EmotionalState =
  | 'devastated'
  | 'sad'
  | 'confused'
  | 'neutral'
  | 'hopeful'
  | 'growing'
  | 'thriving';

export interface JournalPrompt {
  id: number;
  question: string;
  category: string;
  dayRangeMin: number;
  dayRangeMax: number;
  dayRange: [number, number];
}

export interface JournalEntry {
  id: number;
  userId: number;
  promptId: number | null;
  title: string;
  content: string;
  emotion: EmotionalState;
  createdAt: string;
  updatedAt: string;
  prompt?: JournalPrompt | null;
}

export interface TimelineEntry {
  date: string;
  emotion: EmotionalState;
}

export const JOURNAL_EMOTION_CONFIG: Record<
  EmotionalState,
  { label: string; emoji: string; bgClass: string; borderClass: string; textClass: string }
> = {
  devastated: {
    label: 'Dévasté(e)',
    emoji: '💔',
    bgClass: 'bg-rose-100',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-400',
  },
  sad: {
    label: 'Triste',
    emoji: '😢',
    bgClass: 'bg-sky-100',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-500',
  },
  confused: {
    label: 'Confus(e)',
    emoji: '😕',
    bgClass: 'bg-lavender-100',
    borderClass: 'border-lavender-200',
    textClass: 'text-lavender-700',
  },
  neutral: {
    label: 'Neutre',
    emoji: '😐',
    bgClass: 'bg-cream-100',
    borderClass: 'border-cream-300',
    textClass: 'text-text-secondary',
  },
  hopeful: {
    label: "Plein(e) d'espoir",
    emoji: '🌤️',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-500',
  },
  growing: {
    label: 'En progression',
    emoji: '🌱',
    bgClass: 'bg-sage-100',
    borderClass: 'border-sage-200',
    textClass: 'text-sage-700',
  },
  thriving: {
    label: 'Épanoui(e)',
    emoji: '✨',
    bgClass: 'bg-cream-200',
    borderClass: 'border-cream-400',
    textClass: 'text-cream-500',
  },
};

export const EMOTION_ORDER: EmotionalState[] = [
  'devastated',
  'sad',
  'confused',
  'neutral',
  'hopeful',
  'growing',
  'thriving',
];
