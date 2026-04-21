import {
  Body,
  Button,
  Caption,
  Card,
  Container,
  EmptyState,
  Heading,
  LoadingSpinner,
} from '@/components';
import { useMemories } from '@/hooks/useMemories';
import { colors } from '@/theme';
import type { MemoriesStackParamList } from '@/navigation/types';
import { loadPhotosFromConfig } from '@/services/faceDetectionService';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

type Nav = StackNavigationProp<MemoriesStackParamList>;

export default function MemoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isError } = useMemories();
  const store = useMemoryStore();
  const cancelRef = useRef<(() => void) | null>(null);

  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });

  const { totalInSources, totalSwiped, totalDeleted, memoriesConfig } = store;
  const progressPercent = totalInSources > 0 ? Math.round((totalSwiped / totalInSources) * 100) : 0;

  const handleStartCleanup = useCallback(() => {
    store.resetCleanupSession();

    if (memoriesConfig) {
      // Config exists: load directly from saved sources
      setIsLoadingPhotos(true);
      const cancel = loadPhotosFromConfig(memoriesConfig, {
        onProgress: (loaded, total) => setLoadProgress({ loaded, total }),
        onComplete: (photos) => {
          store.setTotalInSources(photos.length);
          store.setSwipeQueue(photos);
          setIsLoadingPhotos(false);
          navigation.navigate('PhotoSwipe');
        },
        onError: (error) => {
          store.setCleanupError(error);
          setIsLoadingPhotos(false);
        },
      });
      cancelRef.current = cancel;
    } else {
      // No config: go to selection screen
      navigation.navigate('FaceSelection');
    }
  }, [store, memoriesConfig, navigation]);

  const handleEditSources = useCallback(() => {
    navigation.navigate('FaceSelection', { editMode: true });
  }, [navigation]);

  const memories = data?.data ?? [];

  const configSummary = memoriesConfig
    ? [
        memoriesConfig.albumIds.length > 0 &&
          `${memoriesConfig.albumIds.length} album${memoriesConfig.albumIds.length > 1 ? 's' : ''}`,
        memoriesConfig.individualAssetIds.length > 0 &&
          `${memoriesConfig.individualAssetIds.length} photo${memoriesConfig.individualAssetIds.length > 1 ? 's' : ''}`,
      ]
        .filter(Boolean)
        .join(', ')
    : null;

  const listHeader = (
    <View className="px-6">
      <Heading className="mb-6" style={{ color: colors.rose[400] }}>Souvenirs 🗑️</Heading>

      {/* Progress card */}
      <Card className="mb-4 border border-rose-100 bg-rose-50">
        <View className="mb-3 flex-row justify-between">
          <View className="items-center">
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#ff7070' }}>
              {totalInSources}
            </Text>
            <Caption className="text-rose-400">sources</Caption>
          </View>
          <View className="w-px bg-rose-100" />
          <View className="items-center">
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#ff7070' }}>
              {totalDeleted}
            </Text>
            <Caption className="text-rose-400">supprimées</Caption>
          </View>
          <View className="w-px bg-rose-100" />
          <View className="items-center">
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#ff7070' }}>
              {progressPercent}%
            </Text>
            <Caption className="text-rose-400">triées</Caption>
          </View>
        </View>

        {totalInSources > 0 && (
          <View className="mt-1 h-2 overflow-hidden rounded-full bg-rose-100">
            <View
              className="h-full rounded-full bg-rose-300"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        )}
      </Card>

      {/* Config summary */}
      {configSummary && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff5f5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 12,
          }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: '#6B7280' }}>Sources configurées</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#ff7070', marginTop: 2 }}>
              {configSummary}
            </Text>
          </View>
          <Pressable onPress={handleEditSources}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffa0a0' }}>Modifier</Text>
          </Pressable>
        </View>
      )}

      {/* CTA */}
      <Button
        title="Nettoyer mes souvenirs"
        variant="rose"
        onPress={handleStartCleanup}
        className="mb-3"
        disabled={isLoadingPhotos}
      />

      {memories.length > 0 && (
        <Pressable
          onPress={() => navigation.navigate('DeletionProgress')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffe0e0',
            borderRadius: 28,
            paddingVertical: 14,
            paddingHorizontal: 20,
            marginBottom: 24,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#ff7070' }}>
            Voir mes photos triées ({memories.length})
          </Text>
        </Pressable>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <Container className="px-0">
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<LoadingSpinner />}
        />
      </Container>
    );
  }

  return (
    <Container className="px-0">
      {/* Loading overlay */}
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
          <Body className="text-lavender-600">
            {loadProgress.total > 0
              ? `Chargement… ${loadProgress.loaded} / ${loadProgress.total}`
              : 'Chargement des photos…'}
          </Body>
        </View>
      )}

      <FlatList
        data={memories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <Card className="mx-6 mb-3">
            <Body className="font-semibold">{item.uri}</Body>
            <Caption className="mt-1">Étape : {item.stage}</Caption>
          </Card>
        )}
        ListEmptyComponent={
          isError ? (
            <View className="px-6">
              <Caption className="text-center text-rose-400">
                Impossible de charger les souvenirs sauvegardés.
              </Caption>
            </View>
          ) : (
            <EmptyState
              icon="image"
              title="Aucun souvenir"
              description="Identifiez et libérez les photos liées à votre ex, à votre rythme."
            />
          )
        }
      />
    </Container>
  );
}
