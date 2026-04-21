import type { EmotionalState } from '@/types';
import { JOURNAL_EMOTION_CONFIG } from '@/types/journal';

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatJournalTitle(date: Date, emotion: EmotionalState): string {
  const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const datePart = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
  const emotionLabel = JOURNAL_EMOTION_CONFIG[emotion].label.toLowerCase();
  return `${capitalized} ${datePart} — ${emotionLabel}`;
}

export function isSameDay(a: Date | string, b: Date | string): boolean {
  const da = typeof a === 'string' ? new Date(a) : a;
  const db = typeof b === 'string' ? new Date(b) : b;
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function daysSince(dateISO: string | null | undefined): number | null {
  if (!dateISO) return null;
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / DAY_MS));
}
