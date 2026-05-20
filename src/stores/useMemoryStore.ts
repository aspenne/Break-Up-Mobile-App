import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/utils/storage';
import type { DeletionStage } from '@/types/memory';
import type { ScanStatus, ScannedPhoto, SwipeResult, MemoriesConfig } from '@/types/cleanup';

// Note: les compteurs (deleted / kept / sorted) sont désormais dérivés de la
// base de données via GET /api/memories/stats (hook `useMemoryStats`).
// Le store ne garde plus que l'état volatile de la session courante de
// cleanup et la config persistée des sources.

interface CleanupSession {
  status: ScanStatus;
  scannedCount: number;
  totalCount: number;
  photosWithFaces: ScannedPhoto[];
  swipeQueue: ScannedPhoto[];
  swipeResults: SwipeResult[];
  sessionError: string | null;
}

interface MemoryState {
  deletionProgress: Record<number, DeletionStage>;
  cleanup: CleanupSession;
  memoriesConfig: MemoriesConfig | null;

  updateDeletionStage: (memoryId: number, stage: DeletionStage) => void;
  resetProgress: () => void;

  setCleanupStatus: (status: ScanStatus) => void;
  setCleanupProgress: (scannedCount: number, totalCount: number) => void;
  addScannedPhotos: (photos: ScannedPhoto[]) => void;
  buildSwipeQueue: (selectedIds?: string[]) => void;
  setSwipeQueue: (photos: ScannedPhoto[]) => void;
  recordSwipe: (result: SwipeResult) => void;
  resetCleanupSession: () => void;
  setCleanupError: (error: string) => void;
  setMemoriesConfig: (config: MemoriesConfig) => void;
  clearMemoriesConfig: () => void;
}

const defaultCleanup: CleanupSession = {
  status: 'idle',
  scannedCount: 0,
  totalCount: 0,
  photosWithFaces: [],
  swipeQueue: [],
  swipeResults: [],
  sessionError: null,
};

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      deletionProgress: {},
      cleanup: defaultCleanup,
      memoriesConfig: null,

      updateDeletionStage: (memoryId, stage) =>
        set((state) => ({
          deletionProgress: { ...state.deletionProgress, [memoryId]: stage },
        })),

      resetProgress: () => set({ deletionProgress: {} }),

      setCleanupStatus: (status) =>
        set((state) => ({ cleanup: { ...state.cleanup, status } })),

      setCleanupProgress: (scannedCount, totalCount) =>
        set((state) => ({ cleanup: { ...state.cleanup, scannedCount, totalCount } })),

      addScannedPhotos: (photos) =>
        set((state) => ({
          cleanup: {
            ...state.cleanup,
            photosWithFaces: [...state.cleanup.photosWithFaces, ...photos],
          },
        })),

      buildSwipeQueue: (selectedIds) => {
        const { photosWithFaces } = get().cleanup;
        const queue = selectedIds
          ? photosWithFaces.filter((p) => selectedIds.includes(p.asset.id))
          : photosWithFaces;
        set((state) => ({ cleanup: { ...state.cleanup, swipeQueue: queue } }));
      },

      setSwipeQueue: (photos) =>
        set((state) => ({
          cleanup: { ...state.cleanup, swipeQueue: photos, status: 'complete' },
        })),

      recordSwipe: (result) =>
        set((state) => ({
          cleanup: {
            ...state.cleanup,
            swipeResults: [...state.cleanup.swipeResults, result],
          },
        })),

      resetCleanupSession: () => set({ cleanup: defaultCleanup }),

      setCleanupError: (error) =>
        set((state) => ({
          cleanup: { ...state.cleanup, status: 'error', sessionError: error },
        })),

      setMemoriesConfig: (config) => set({ memoriesConfig: config }),

      clearMemoriesConfig: () => set({ memoriesConfig: null }),
    }),
    {
      name: 'breakup-memory-store-v3',
      storage: zustandStorage,
      partialize: (state) => ({
        deletionProgress: state.deletionProgress,
        memoriesConfig: state.memoriesConfig,
      }),
    }
  )
);
