import { useMemo } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Card,
  Heading,
  Body,
  Caption,
  LoadingSpinner,
  EmptyState,
} from '@/components';
import { useJournalEntries } from '@/hooks/useJournal';
import { colors } from '@/theme';
import { isSameDay } from '@/utils/date';
import { JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { JournalStackParamList } from '@/navigation/types';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalMain'>;

export default function JournalScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isError } = useJournalEntries();

  const entries = data?.data ?? [];
  const hasEntryToday = useMemo(
    () => entries.some((e) => isSameDay(e.createdAt, new Date())),
    [entries]
  );

  const header = (
    <View className="mb-4 px-4">
      <Heading className="mb-4" style={{ color: colors.sky[700] }}>Journal ✍️</Heading>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={hasEntryToday}
        onPress={() => navigation.navigate('JournalComposeEmotion')}
        className={`items-center rounded-button px-6 py-4 shadow-soft ${
          hasEntryToday ? 'bg-sky-100' : 'bg-sky-300'
        }`}
      >
        <Text
          className={`text-body-md font-semibold ${
            hasEntryToday ? 'text-sky-400' : 'text-sky-900'
          }`}
        >
          {hasEntryToday ? 'Revenez demain 🌱' : '+ Nouvelle entrée'}
        </Text>
      </TouchableOpacity>
      {hasEntryToday && (
        <Caption className="mt-2 text-center text-text-muted">
          Tu as déjà écrit aujourd&apos;hui. Repose-toi, à demain.
        </Caption>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <Container>
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
          ListHeaderComponent={header}
          ListEmptyComponent={<LoadingSpinner />}
        />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
        ListHeaderComponent={header}
        renderItem={({ item }) => {
          const conf = JOURNAL_EMOTION_CONFIG[item.emotion];
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('JournalEntryDetail', { entryId: item.id })
              }
            >
              <Card className="mx-4 mb-3 border border-sky-200">
                <View className="flex-row items-center">
                  <Text className="mr-3 text-2xl">{conf.emoji}</Text>
                  <View className="flex-1">
                    <Body className="font-semibold">{item.title}</Body>
                    <Caption className="mt-1">
                      {conf.label} ·{' '}
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </Caption>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          isError ? (
            <View className="px-4">
              <Caption className="text-center text-sky-400">
                Impossible de charger les entrées.
              </Caption>
            </View>
          ) : (
            <EmptyState
              icon="edit-3"
              title="Aucune entrée"
              description="Écris tes pensées et suis ton évolution émotionnelle jour après jour."
            />
          )
        }
      />
    </Container>
  );
}
