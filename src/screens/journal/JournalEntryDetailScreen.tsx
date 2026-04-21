import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Heading,
  Body,
  Caption,
  LoadingSpinner,
  BackButton,
} from '@/components';
import { useJournalEntries, useDeleteJournalEntry } from '@/hooks/useJournal';
import { JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { JournalStackParamList } from '@/navigation/types';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalEntryDetail'>;
type Rt = RouteProp<JournalStackParamList, 'JournalEntryDetail'>;

export default function JournalEntryDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { data, isLoading } = useJournalEntries();
  const deleteEntry = useDeleteJournalEntry();

  const entry = useMemo(
    () => data?.data.find((e) => e.id === params.entryId) ?? null,
    [data, params.entryId]
  );

  const handleDelete = () => {
    Alert.alert(
      'Supprimer cette entrée ?',
      'Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry.mutateAsync(params.entryId);
              navigation.goBack();
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer pour le moment.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (!entry) {
    return (
      <Container>
        <BackButton onPress={() => navigation.goBack()} />
        <Caption className="mt-8 text-center text-text-muted">Entrée introuvable.</Caption>
      </Container>
    );
  }

  const conf = JOURNAL_EMOTION_CONFIG[entry.emotion];

  return (
    <Container>
      <View className="mb-4 flex-row items-center justify-between">
        <BackButton onPress={() => navigation.goBack()} />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('JournalEntryEdit', { entryId: entry.id })
            }
            activeOpacity={0.7}
            className="rounded-button border border-lavender-200 bg-surface px-4 py-2"
          >
            <Text className="text-body-sm font-semibold text-lavender-700">Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            className="rounded-button border border-rose-200 bg-rose-50 px-4 py-2"
          >
            <Text className="text-body-sm font-semibold text-rose-400">Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View
          className={`mb-4 flex-row items-center rounded-card border px-4 py-3 ${conf.borderClass} ${conf.bgClass}`}
        >
          <Text className="mr-2 text-2xl">{conf.emoji}</Text>
          <Text className={`text-body-md font-semibold ${conf.textClass}`}>
            {conf.label}
          </Text>
        </View>

        <Heading className="mb-2">{entry.title}</Heading>
        <Caption className="mb-6 text-text-muted">
          {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Caption>

        {entry.prompt && (
          <View className="mb-4 rounded-card bg-cream-100 px-4 py-3">
            <Caption className="mb-1 uppercase tracking-wider text-text-muted">
              Question
            </Caption>
            <Body>{entry.prompt.question}</Body>
          </View>
        )}

        <Body className="text-text-primary">{entry.content}</Body>
      </ScrollView>
    </Container>
  );
}
