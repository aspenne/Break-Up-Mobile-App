export type SeparationReason =
  | 'infidelity'
  | 'distance'
  | 'incompatibility'
  | 'toxicity'
  | 'lost_feelings'
  | 'mutual'
  | 'other';

export type TimeSinceSeparation =
  | 'less_than_week'
  | '1_4_weeks'
  | '1_3_months'
  | '3_6_months'
  | 'more_than_6_months';

export type RelationshipDuration =
  | 'few_months'
  | '1_2_years'
  | '3_5_years'
  | 'more_than_5_years';

export type OnboardingEmotion =
  | 'devastated'
  | 'sad'
  | 'confused'
  | 'angry'
  | 'relieved'
  | 'neutral';

export interface OnboardingAnswers {
  reasons: SeparationReason[];
  timeSince: TimeSinceSeparation | null;
  duration: RelationshipDuration | null;
  loveLevel: number;
  emotion: OnboardingEmotion | null;
  breakupDate: string | null;
}

export const SEPARATION_REASON_LABELS: Record<SeparationReason, string> = {
  infidelity: 'Infidélité',
  distance: 'Distance',
  incompatibility: 'Incompatibilité',
  toxicity: 'Toxicité',
  lost_feelings: 'Perte de sentiments',
  mutual: 'Décision mutuelle',
  other: 'Autre',
};

export const TIME_SINCE_LABELS: Record<TimeSinceSeparation, string> = {
  less_than_week: "Moins d'une semaine",
  '1_4_weeks': '1-4 semaines',
  '1_3_months': '1-3 mois',
  '3_6_months': '3-6 mois',
  more_than_6_months: '+6 mois',
};

export const DURATION_LABELS: Record<RelationshipDuration, string> = {
  few_months: 'Quelques mois',
  '1_2_years': '1-2 ans',
  '3_5_years': '3-5 ans',
  more_than_5_years: '+5 ans',
};

export const EMOTION_CONFIG: Record<OnboardingEmotion, { label: string; emoji: string }> = {
  devastated: { label: 'Dévasté(e)', emoji: '😢' },
  sad: { label: 'Triste', emoji: '😔' },
  confused: { label: 'Confus(e)', emoji: '😵‍💫' },
  angry: { label: 'En colère', emoji: '😡' },
  relieved: { label: 'Soulagé(e)', emoji: '😮‍💨' },
  neutral: { label: 'Neutre', emoji: '😐' },
};
