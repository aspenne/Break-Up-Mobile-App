import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';

interface BlogState {
  readArticleIds: number[];
  markAsRead: (articleId: number) => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      readArticleIds: [],
      markAsRead: (articleId) =>
        set((state) => ({
          readArticleIds: state.readArticleIds.includes(articleId)
            ? state.readArticleIds
            : [...state.readArticleIds, articleId],
        })),
    }),
    {
      name: 'breakup-blog-store-v2',
      storage: zustandStorage,
    }
  )
);
