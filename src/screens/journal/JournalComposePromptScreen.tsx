import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Container, Heading, Body, Caption, LoadingSpinner } from '@/components';
import { useJournalComposeStore, useUserStore } from '@/stores';
import { useJournalPrompts } from '@/hooks/useJournal';
import { daysSince } from '@/utils/date';
import type { JournalPrompt } from '@/types';
import type { JournalStackParamList } from '@/navigation/types';
import { ComposeHeader } from './components/ComposeHeader';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalComposePrompt'>;

export default function JournalComposePromptScreen() {
  const navigation = useNavigation<Nav>();
  const user = useUserStore((s) => s.user);
  const { setPrompt, reset } = useJournalComposeStore();

  const daysSinceBreakup = daysSince(user?.breakupDate ?? null);
  const { data: prompts, isLoading } = useJournalPrompts(
    daysSinceBreakup === null ? undefined : daysSinceBreakup
  );

  const grouped = useMemo(() => {
    if (!prompts) return {} as Record<string, JournalPrompt[]>;
    return prompts.reduce<Record<string, JournalPrompt[]>>((acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {});
  }, [prompts]);

  const goNext = (id: number | null, question: string | null) => {
    setPrompt(id, question);
    navigation.navigate('JournalComposeContent');
  };

  const handleCancel = () => {
    reset();
    navigation.popToTop();
  };

  return (
    <Container>
      <ComposeHeader step={1} total={3} onClose={handleCancel} />
      <Heading className="mb-2">Un prompt pour te guider ?</Heading>
      <Body className="mb-6">
        Choisis une question qui résonne, ou écris librement.
      </Body>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={() => goNext(null, null)}
          activeOpacity={0.7}
          className="mb-6 rounded-card border border-sky-200 bg-sky-50 px-5 py-4"
        >
          <Text className="text-body-md font-semibold text-sky-800">
            ✍️ Écrire librement
          </Text>
          <Caption className="mt-1 text-sky-500">
            Sans question, juste tes mots.
          </Caption>
        </TouchableOpacity>

        {isLoading && <LoadingSpinner />}

        {!isLoading && Object.keys(grouped).length === 0 && (
          <Caption className="text-center text-text-muted">
            Aucun prompt disponible pour le moment.
          </Caption>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} className="mb-6">
            <Caption className="mb-2 uppercase tracking-wider text-text-muted">
              {category}
            </Caption>
            <View className="gap-2">
              {items.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => goNext(p.id, p.question)}
                  activeOpacity={0.7}
                  className="rounded-card border border-cream-300 bg-surface px-5 py-4"
                >
                  <Text className="text-body-md text-text-primary">{p.question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
}
