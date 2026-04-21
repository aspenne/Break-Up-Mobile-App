import type { Asset } from 'expo-media-library';

export type ScanStatus =
  | 'idle'
  | 'requesting_permission'
  | 'permission_denied'
  | 'loading_albums'
  | 'loading_photos'
  | 'complete'
  | 'error';

export type SwipeDecision = 'keep' | 'delete';

export interface PhotoAlbum {
  id: string;
  title: string;
  assetCount: number;
  thumbnailUri: string | null;
}

export interface ScannedPhoto {
  asset: Asset;
  /** ph:// on iOS, content:// on Android — both work with React Native Image */
  resolvedUri: string;
}

export interface SwipeResult {
  assetId: string;
  uri: string;
  decision: SwipeDecision;
  decidedAt: string;
}

export interface MemoriesConfig {
  /** Album IDs — photos are loaded dynamically (includes new ones) */
  albumIds: string[];
  /** Individual photo asset IDs hand-picked by the user */
  individualAssetIds: string[];
  /** ISO timestamp of last modification */
  updatedAt: string;
}
