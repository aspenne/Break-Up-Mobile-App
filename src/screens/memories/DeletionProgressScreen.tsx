import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Feather } from '@expo/vector-icons';
import { Container, Heading, Body, Caption, LoadingSpinner, EmptyState } from '@/components';
import { useMemories, useUpdateMemoryStage, useDeleteMemory } from '@/hooks/useMemories';
import { colors } from '@/theme';
import type { Memory, DeletionStage } from '@/types';

const STAGES: { key: DeletionStage; label: string; emoji: string; color: string }[] = [
  { key: 'hidden', label: 'Masquées', emoji: '🙈', color: '#F59E0B' },
  { key: 'archived', label: 'Archivées', emoji: '📦', color: '#8B5CF6' },
  { key: 'deleted', label: 'Supprimées', emoji: '🗑', color: '#EF4444' },
];

const NEXT_STAGE: Record<string, DeletionStage> = {
  hidden: 'archived',
  archived: 'deleted',
};

const NEXT_STAGE_LABEL: Record<string, string> = {
  hidden: 'Archiver',
  archived: 'Supprimer',
};

function MemoryCard({
  memory,
  onAdvance,
  onRestore,
}: {
  memory: Memory;
  onAdvance: () => void;
  onRestore: () => void;
}) {
  const nextLabel = NEXT_STAGE_LABEL[memory.stage];

  return (
    <View className="mx-6 mb-3 overflow-hidden rounded-card bg-surface shadow-card">
      <Image
        source={{ uri: memory.uri }}
        style={{ width: '100%', height: 180 }}
        resizeMode="cover"
      />
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1">
          <Caption>
            {memory.dateTaken
              ? new Date(memory.dateTaken).toLocaleDateString('fr-FR')
              : 'Date inconnue'}
          </Caption>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onRestore}
            className="rounded-button border border-sage-200 bg-sage-50 px-3 py-1.5"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-semibold text-sage-600">Restaurer</Text>
          </TouchableOpacity>
          {nextLabel && (
            <TouchableOpacity
              onPress={onAdvance}
              className={`rounded-button px-3 py-1.5 ${
                memory.stage === 'archived' ? 'bg-rose-100' : 'bg-sky-100'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-xs font-semibold ${
                  memory.stage === 'archived' ? 'text-rose-400' : 'text-sky-700'
                }`}
              >
                {nextLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default function DeletionProgressScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useMemories(1, 100);
  const updateStage = useUpdateMemoryStage();
  const deleteMemory = useDeleteMemory();

  const [activeStage, setActiveStage] = useState<DeletionStage>('hidden');

  const allMemories = data?.data ?? [];
  const filteredMemories = allMemories.filter((m) => m.stage === activeStage);

  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: allMemories.filter((m) => m.stage === s.key).length,
  }));

  const handleAdvance = (memory: Memory) => {
    const nextStage = NEXT_STAGE[memory.stage];
    if (!nextStage) return;

    if (nextStage === 'deleted') {
      Alert.alert(
        'Supprimer définitivement ?',
        'Cette photo sera supprimée de ton appareil. Cette action est irréversible.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: async () => {
              try {
                await MediaLibrary.deleteAssetsAsync([memory.uri]);
              } catch {
                // User may deny on iOS
              }
              updateStage.mutate({ id: memory.id, stage: 'deleted' });
            },
          },
        ]
      );
    } else {
      updateStage.mutate({ id: memory.id, stage: nextStage });
    }
  };

  const handleRestore = (memory: Memory) => {
    Alert.alert(
      'Restaurer cette photo ?',
      'Elle sera retirée de la liste et reviendra dans ta galerie normalement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Restaurer',
          onPress: () => deleteMemory.mutate(memory.id),
        },
      ]
    );
  };

  return (
    <Container className="px-0">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Heading>Mes souvenirs triés</Heading>
      </View>

      {/* Stage tabs */}
      <View className="mb-4 flex-row px-6">
        {stageCounts.map((stage) => (
          <Pressable
            key={stage.key}
            onPress={() => setActiveStage(stage.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeStage === stage.key ? '#F5F0FF' : 'transparent',
              alignItems: 'center',
              marginHorizontal: 2,
            }}
          >
            <Text style={{ fontSize: 18 }}>{stage.emoji}</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: activeStage === stage.key ? '#7C3AED' : '#9b93a8',
                marginTop: 2,
              }}
            >
              {stage.label}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: activeStage === stage.key ? '#7C3AED' : '#9b93a8',
              }}
            >
              {stage.count}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Explanation */}
      <View className="mx-6 mb-4 rounded-2xl bg-sky-50 px-4 py-3">
        <Caption className="text-center text-sky-600">
          {activeStage === 'hidden' &&
            'Ces photos sont masquées. Tu peux les archiver ou les restaurer.'}
          {activeStage === 'archived' &&
            'Ces photos sont archivées. Prochaine étape : suppression définitive.'}
          {activeStage === 'deleted' &&
            'Ces photos ont été supprimées de ton appareil.'}
        </Caption>
      </View>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={filteredMemories}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <MemoryCard
              memory={item}
              onAdvance={() => handleAdvance(item)}
              onRestore={() => handleRestore(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="image"
              title={`Aucun souvenir ${STAGES.find((s) => s.key === activeStage)?.label.toLowerCase()}`}
              description="Les photos triées apparaîtront ici."
            />
          }
        />
      )}
    </Container>
  );
}
