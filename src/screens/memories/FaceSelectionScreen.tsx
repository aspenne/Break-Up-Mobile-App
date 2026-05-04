import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { Container, Button, Heading, Body, Caption } from '@/components';
import { useMemoryStore } from '@/stores/useMemoryStore';
import {
  requestMediaPermission,
  getAlbumsWithThumbnails,
  loadPhotosFromConfig,
  loadAllPhotos,
} from '@/services/faceDetectionService';
import type { MemoriesStackParamList } from '@/navigation/types';
import type { PhotoAlbum, ScannedPhoto } from '@/types/cleanup';

type Nav = StackNavigationProp<MemoriesStackParamList>;
type Props = StackScreenProps<MemoriesStackParamList, 'FaceSelection'>;

type Tab = 'albums' | 'photos';

export default function FaceSelectionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const editMode = route.params?.editMode ?? false;
  const store = useMemoryStore();
  const cancelRef = useRef<(() => void) | null>(null);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('albums');

  // Albums state
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<Set<string>>(() => {
    if (editMode && store.memoriesConfig) {
      return new Set(store.memoriesConfig.albumIds);
    }
    return new Set();
  });

  // Individual photos state
  const [galleryPhotos, setGalleryPhotos] = useState<ScannedPhoto[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryEndCursor, setGalleryEndCursor] = useState<string | undefined>();
  const [galleryHasMore, setGalleryHasMore] = useState(true);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(() => {
    if (editMode && store.memoriesConfig) {
      return new Set(store.memoriesConfig.individualAssetIds);
    }
    return new Set();
  });

  // Loading overlay
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });

  // Load albums on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const granted = await requestMediaPermission();
      if (!mounted) return;
      if (!granted) {
        setPermissionDenied(true);
        setIsLoadingAlbums(false);
        return;
      }
      try {
        const result = await getAlbumsWithThumbnails();
        if (mounted) setAlbums(result);
      } catch {
        // show empty list
      } finally {
        if (mounted) setIsLoadingAlbums(false);
      }
    };

    init();
    return () => { mounted = false; };
  }, []);

  // Load gallery photos when switching to photos tab
  const loadGalleryPage = useCallback(async () => {
    if (isLoadingGallery || !galleryHasMore) return;
    setIsLoadingGallery(true);

    try {
      const result = await loadAllPhotos(galleryEndCursor);
      setGalleryPhotos((prev) => [...prev, ...result.photos]);
      setGalleryEndCursor(result.endCursor);
      setGalleryHasMore(result.hasNextPage);
    } catch {
      // silently fail
    } finally {
      setIsLoadingGallery(false);
    }
  }, [isLoadingGallery, galleryHasMore, galleryEndCursor]);

  useEffect(() => {
    if (activeTab === 'photos' && galleryPhotos.length === 0) {
      loadGalleryPage();
    }
  }, [activeTab]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { cancelRef.current?.(); };
  }, []);

  const toggleAlbum = useCallback((id: string) => {
    setSelectedAlbumIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const togglePhoto = useCallback((id: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const totalSelected = selectedAlbumIds.size + selectedPhotoIds.size;

  const handleContinue = useCallback(() => {
    if (totalSelected === 0) return;

    const config = {
      albumIds: Array.from(selectedAlbumIds),
      individualAssetIds: Array.from(selectedPhotoIds),
      updatedAt: new Date().toISOString(),
    };

    store.setMemoriesConfig(config);

    if (editMode) {
      navigation.goBack();
      return;
    }

    // First time: load photos and navigate to swipe
    setIsLoadingPhotos(true);
    const cancel = loadPhotosFromConfig(config, {
      onProgress: (loaded, total) => setLoadProgress({ loaded, total }),
      onComplete: (photos) => {
        store.setTotalInSources(photos.length);
        store.setSwipeQueue(photos);
        navigation.navigate('PhotoSwipe');
      },
      onError: (error) => {
        store.setCleanupError(error);
        setIsLoadingPhotos(false);
      },
    });
    cancelRef.current = cancel;
  }, [totalSelected, selectedAlbumIds, selectedPhotoIds, store, navigation, editMode]);

  if (permissionDenied) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center px-4">
          <Heading className="text-center mb-4">Accès refusé</Heading>
          <Body className="text-center text-sky-600 mb-8">
            Break-Up a besoin d'accéder à vos photos pour identifier les souvenirs.
          </Body>
          <Button title="Ouvrir les réglages" onPress={() => Linking.openSettings()} />
        </View>
      </Container>
    );
  }

  return (
    <Container className="px-0">
      {/* Loading photos overlay */}
      {isLoadingPhotos && (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            backgroundColor: 'rgba(253,246,236,0.95)',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}>
          <ActivityIndicator size="large" color="#A78BFA" />
          <Body className="text-sky-600">
            {loadProgress.total > 0
              ? `Chargement… ${loadProgress.loaded} / ${loadProgress.total}`
              : 'Chargement des photos…'}
          </Body>
        </View>
      )}

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Pressable onPress={() => navigation.goBack()} className="mb-4">
          <Caption className="text-sky-500">← Retour</Caption>
        </Pressable>
        <Heading>{editMode ? 'Modifier mes sources' : 'Choisir mes sources'}</Heading>
        <Body className="text-sky-600 mt-1">
          Sélectionnez des albums ou des photos individuelles
        </Body>
      </View>

      {/* Segmented control */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 24,
          marginBottom: 12,
          borderRadius: 12,
          backgroundColor: '#F0F9FF',
          padding: 4,
        }}>
        {(['albums', 'photos'] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: active ? '#FFFFFF' : 'transparent',
                alignItems: 'center',
                ...(active
                  ? {
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  : {}),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: active ? '#0ea5e9' : '#6B7280',
                }}>
                {tab === 'albums' ? 'Albums' : 'Photos'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {activeTab === 'albums' ? (
        isLoadingAlbums ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0ea5e9" />
          </View>
        ) : (
          <FlatList<PhotoAlbum>
            key="albums-grid"
            data={albums}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 120 }}
            renderItem={({ item }) => {
              const selected = selectedAlbumIds.has(item.id);
              return (
                <Pressable
                  onPress={() => toggleAlbum(item.id)}
                  style={{ width: '50%', padding: 6 }}>
                  <View
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: selected ? 3 : 0,
                      borderColor: selected ? '#0ea5e9' : 'transparent',
                      backgroundColor: '#F0F9FF',
                    }}>
                    <View style={{ aspectRatio: 1 }}>
                      {item.thumbnailUri ? (
                        <Image
                          source={{ uri: item.thumbnailUri }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#EDE9FE',
                          }}>
                          <Text style={{ fontSize: 32 }}>🖼</Text>
                        </View>
                      )}
                      <View
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.55)',
                          borderRadius: 10,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                        }}>
                        <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>
                          {item.assetCount}
                        </Text>
                      </View>
                      {selected && (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#0ea5e9',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>
                            ✓
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: selected ? '#0ea5e9' : '#374151',
                        }}>
                        {item.title || 'Sans titre'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20 px-6">
                <Body className="text-center text-sky-500">
                  Aucun album trouvé dans votre galerie.
                </Body>
              </View>
            }
          />
        )
      ) : (
        /* Photos tab */
        <FlatList<ScannedPhoto>
          key="photos-grid"
          data={galleryPhotos}
          keyExtractor={(item) => item.asset.id}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 120 }}
          onEndReached={loadGalleryPage}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
            const selected = selectedPhotoIds.has(item.asset.id);
            return (
              <Pressable
                onPress={() => togglePhoto(item.asset.id)}
                style={{ width: '33.33%', padding: 2 }}>
                <View
                  style={{
                    aspectRatio: 1,
                    borderRadius: 8,
                    overflow: 'hidden',
                    borderWidth: selected ? 3 : 0,
                    borderColor: selected ? '#A78BFA' : 'transparent',
                  }}>
                  <Image
                    source={{ uri: item.resolvedUri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  {selected && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: '#7C3AED',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                        ✓
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
          ListFooterComponent={
            isLoadingGallery ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator color="#A78BFA" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoadingGallery ? (
              <View className="flex-1 items-center justify-center py-20 px-6">
                <Body className="text-center text-sky-500">
                  Aucune photo trouvée.
                </Body>
              </View>
            ) : null
          }
        />
      )}

      {/* Bottom CTA */}
      {!isLoadingAlbums && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 24,
            paddingBottom: 32,
            paddingTop: 16,
            backgroundColor: 'rgba(253,246,236,0.95)',
          }}>
          <Button
            title={
              totalSelected > 0
                ? editMode
                  ? `Enregistrer (${totalSelected} source${totalSelected > 1 ? 's' : ''})`
                  : `Continuer avec ${totalSelected} source${totalSelected > 1 ? 's' : ''}`
                : 'Sélectionnez des sources'
            }
            disabled={totalSelected === 0}
            onPress={handleContinue}
          />
        </View>
      )}
    </Container>
  );
}
