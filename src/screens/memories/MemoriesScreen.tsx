import {
  Body,
  Button,
  Caption,
  Card,
  Container,
  Heading,
  ProfileButton,
} from '@/components';
import { useMemoryStats } from '@/hooks/useMemories';
import apiClient from '@/api/client';
import type { Memory } from '@/types';
import type { PaginatedResponse } from '@/api/types';
import type { MemoriesStackParamList } from '@/navigation/types';
import { loadPhotosFromConfig } from '@/services/faceDetectionService';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { colors } from '@/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Nav = StackNavigationProp<MemoriesStackParamList>;

export default function MemoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: stats, refetch: refetchStats } = useMemoryStats();
  const store = useMemoryStore();
  const cancelRef = useRef<(() => void) | null>(null);

  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });

  const { memoriesConfig } = store;

  // Stats agrégées côté backend — toujours à jour
  const deletedCount = stats?.deleted ?? 0;
  const keptCount = stats?.kept ?? 0;
  const sortedCount = stats?.sorted ?? 0;

  useFocusEffect(
    useCallback(() => {
      refetchStats();
    }, [refetchStats])
  );

  const handleStartCleanup = useCallback(async () => {
    store.resetCleanupSession();

    if (memoriesConfig) {
      setIsLoadingPhotos(true);

      // Build skip set from already-processed memories so they don't reappear
      let skip: Set<string> | undefined;
      try {
        const { data: page } = await apiClient.get<PaginatedResponse<Memory>>(
          '/api/memories',
          { params: { page: 1, limit: 10000 } }
        );
        skip = new Set(
          (page.data ?? [])
            .map((m) => m.assetId)
            .filter((id): id is string => !!id)
        );
      } catch {
        // best-effort: continue without filter
      }

      const cancel = loadPhotosFromConfig(
        memoriesConfig,
        {
          onProgress: (loaded, total) => setLoadProgress({ loaded, total }),
          onComplete: (photos) => {
            store.setSwipeQueue(photos);
            setIsLoadingPhotos(false);
            navigation.navigate('PhotoSwipe');
          },
          onError: (error) => {
            store.setCleanupError(error);
            setIsLoadingPhotos(false);
          },
        },
        skip
      );
      cancelRef.current = cancel;
    } else {
      navigation.navigate('FaceSelection');
    }
  }, [store, memoriesConfig, navigation]);

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
          <ActivityIndicator size="large" color="#7dd3fc" />
          <Body className="text-sky-600">
            {loadProgress.total > 0
              ? `Chargement… ${loadProgress.loaded} / ${loadProgress.total}`
              : 'Chargement des photos…'}
          </Body>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Heading style={{ color: colors.sky[700] }}>Souvenirs 🗑️</Heading>
            <ProfileButton />
          </View>

          {/* Compteurs agrégés depuis la base de données */}
          <Card className="mb-4 border border-sky-200 bg-sky-50">
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#EF4444' }}>
                  {deletedCount}
                </Text>
                <Caption className="text-sky-400 text-center">supprimées</Caption>
              </View>
              <View className="w-px bg-sky-100" />
              <View className="items-center flex-1">
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#467c46' }}>
                  {keptCount}
                </Text>
                <Caption className="text-sky-400 text-center">conservées</Caption>
              </View>
              <View className="w-px bg-sky-100" />
              <View className="items-center flex-1">
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#0284c7' }}>
                  {sortedCount}
                </Text>
                <Caption className="text-sky-400 text-center">triées</Caption>
              </View>
            </View>
          </Card>

          {/* CTA + bouton "ajouter des sources" */}
          <View className="mb-3 flex-row items-center gap-2">
            <View style={{ flex: 1 }}>
              <Button
                title="Nettoyer mes souvenirs"
                onPress={handleStartCleanup}
                disabled={isLoadingPhotos}
              />
            </View>
            {memoriesConfig && (
              <Pressable
                onPress={() => navigation.navigate('FaceSelection', { editMode: true })}
                accessibilityLabel="Ajouter des albums ou photos"
                hitSlop={8}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  borderWidth: 1.5,
                  borderColor: colors.sky[300],
                  backgroundColor: colors.sky[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="plus" size={22} color={colors.sky[700]} />
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
