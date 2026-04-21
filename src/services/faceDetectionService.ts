import * as MediaLibrary from 'expo-media-library';
import type { PhotoAlbum, ScannedPhoto, MemoriesConfig } from '@/types/cleanup';

export async function requestMediaPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === MediaLibrary.PermissionStatus.GRANTED;
}

/**
 * Resolves a ph:// (iOS) or content:// (Android) URI to a file:// URI
 * that React Native Image can display reliably.
 */
async function toFileUri(assetId: string, fallback: string): Promise<string> {
  try {
    const info = await MediaLibrary.getAssetInfoAsync(assetId);
    return info.localUri ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Returns all albums that contain at least one photo, with a resolved
 * file:// thumbnail URI. On iOS includes the native "People" face albums.
 *
 * We don't rely on album.assetCount because iOS returns an unreliable
 * estimatedAssetCount for face/person albums. Instead we query the first
 * photo directly and use the real totalCount returned by that query.
 */
export async function getAlbumsWithThumbnails(): Promise<PhotoAlbum[]> {
  const raw = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });

  const results = await Promise.all(
    raw.map(async (album): Promise<PhotoAlbum | null> => {
      try {
        const page = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: MediaLibrary.MediaType.photo,
          first: 1,
        });

        if (page.assets.length === 0) return null;

        const thumbnailUri = await toFileUri(page.assets[0].id, page.assets[0].uri);

        return {
          id: album.id,
          title: album.title,
          // Use actual count from the query, not estimatedAssetCount
          assetCount: page.totalCount,
          thumbnailUri,
        };
      } catch {
        return null;
      }
    })
  );

  return results.filter((a): a is PhotoAlbum => a !== null);
}

interface LoadPhotosCallbacks {
  onProgress: (loaded: number, total: number) => void;
  onComplete: (photos: ScannedPhoto[]) => void;
  onError: (error: string) => void;
}

/**
 * Loads all photos from the given album IDs with resolved file:// URIs.
 * Returns a cancel() function.
 */
export function loadPhotosFromAlbums(
  albumIds: string[],
  callbacks: LoadPhotosCallbacks
): () => void {
  let cancelled = false;

  const run = async () => {
    try {
      const allPhotos: ScannedPhoto[] = [];

      for (const albumId of albumIds) {
        if (cancelled) return;

        let after: string | undefined = undefined;
        let albumTotal = 0;

        do {
          if (cancelled) return;

          const page = await MediaLibrary.getAssetsAsync({
            album: albumId,
            mediaType: MediaLibrary.MediaType.photo,
            first: 50,
            after,
            sortBy: MediaLibrary.SortBy.creationTime,
          });

          albumTotal = page.totalCount;

          for (const asset of page.assets) {
            if (cancelled) return;
            const resolvedUri = await toFileUri(asset.id, asset.uri);
            allPhotos.push({ asset, resolvedUri });
          }

          callbacks.onProgress(allPhotos.length, albumTotal);
          after = page.hasNextPage ? page.endCursor : undefined;
        } while (after && !cancelled);
      }

      if (!cancelled) {
        callbacks.onComplete(allPhotos);
      }
    } catch (err) {
      if (!cancelled) {
        callbacks.onError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    }
  };

  run();
  return () => { cancelled = true; };
}

/**
 * Loads all photos from a persisted MemoriesConfig (albums + individual photos).
 * Deduplicates by asset ID. Returns a cancel() function.
 */
export function loadPhotosFromConfig(
  config: MemoriesConfig,
  callbacks: LoadPhotosCallbacks
): () => void {
  let cancelled = false;

  const run = async () => {
    try {
      const seen = new Set<string>();
      const allPhotos: ScannedPhoto[] = [];

      // 1. Load photos from selected albums
      for (const albumId of config.albumIds) {
        if (cancelled) return;

        let after: string | undefined = undefined;

        do {
          if (cancelled) return;

          const page = await MediaLibrary.getAssetsAsync({
            album: albumId,
            mediaType: MediaLibrary.MediaType.photo,
            first: 50,
            after,
            sortBy: MediaLibrary.SortBy.creationTime,
          });

          for (const asset of page.assets) {
            if (cancelled) return;
            if (seen.has(asset.id)) continue;
            seen.add(asset.id);
            const resolvedUri = await toFileUri(asset.id, asset.uri);
            allPhotos.push({ asset, resolvedUri });
          }

          callbacks.onProgress(allPhotos.length, allPhotos.length + (page.hasNextPage ? 1 : 0));
          after = page.hasNextPage ? page.endCursor : undefined;
        } while (after && !cancelled);
      }

      // 2. Load individual photos
      for (const assetId of config.individualAssetIds) {
        if (cancelled) return;
        if (seen.has(assetId)) continue;

        try {
          const info = await MediaLibrary.getAssetInfoAsync(assetId);
          seen.add(assetId);
          allPhotos.push({
            asset: info as MediaLibrary.Asset,
            resolvedUri: info.localUri ?? info.uri,
          });
        } catch {
          // Photo was deleted from device — skip silently
        }
      }

      if (!cancelled) {
        callbacks.onComplete(allPhotos);
      }
    } catch (err) {
      if (!cancelled) {
        callbacks.onError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    }
  };

  run();
  return () => { cancelled = true; };
}

/**
 * Loads a page of all photos from the device gallery (no album filter).
 * Used by the individual photo picker.
 */
export async function loadAllPhotos(
  after?: string,
  pageSize = 80
): Promise<{ photos: ScannedPhoto[]; endCursor: string; hasNextPage: boolean }> {
  const page = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.photo,
    first: pageSize,
    after,
    sortBy: MediaLibrary.SortBy.creationTime,
  });

  const photos: ScannedPhoto[] = [];
  for (const asset of page.assets) {
    const resolvedUri = await toFileUri(asset.id, asset.uri);
    photos.push({ asset, resolvedUri });
  }

  return {
    photos,
    endCursor: page.endCursor,
    hasNextPage: page.hasNextPage,
  };
}
