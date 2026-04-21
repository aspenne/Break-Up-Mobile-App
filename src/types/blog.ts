export type ArticleCategory =
  | 'toxic-relationships'
  | 'grief'
  | 'trust'
  | 'rebuilding'
  | 'self-care';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  readTimeMinutes: number;
  imageUrl: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string | null;
}
