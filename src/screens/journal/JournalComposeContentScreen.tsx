import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Container, Heading, Body, Caption } from '@/components';
import { useJournalComposeStore } from '@/stores';
import { useCreateJournalEntry } from '@/hooks/useJournal';
import { formatJournalTitle } from '@/utils/date';
import { JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { JournalStackParamList } from '@/navigation/types';
import { ComposeHeader } from './components/ComposeHeader';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalComposeContent'>;

export default function JournalComposeContentScreen() {
  const navigation = useNavigation<Nav>();
  const { emotion, promptId, promptQuestion, content, setContent, reset } =
    useJournalComposeStore();
  const createEntry = useCreateJournalEntry();
  const [error, setError] = useState<string | null>(null);

  const autoTitle = useMemo(() => {
    if (!emotion) return '';
    return formatJournalTitle(new Date(), emotion);
  }, [emotion]);

  const canSubmit = emotion !== null && content.trim().length > 0 && !createEntry.isPending;

  const handleCancel = () => {
    reset();
    navigation.getParent()?.goBack();
  };

  const handleSubmit = async () => {
    if (!emotion) return;
    setError(null);
    try {
      await createEntry.mutateAsync({
        title: autoTitle,
        content: content.trim(),
        emotion,
        promptId: promptId ?? undefined,
      });
      reset();
      navigation.popToTop();
    } catch {
      setError("Impossible d'enregistrer l'entrée. Réessaie dans un instant.");
    }
  };

  if (!emotion) {
    // Defensive: should not happen in normal flow
    return (
      <Container>
        <Body>Étape précédente manquante.</Body>
      </Container>
    );
  }

  const emotionConf = JOURNAL_EMOTION_CONFIG[emotion];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Container>
        <ComposeHeader step={2} total={3} onClose={handleCancel} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className={`mb-4 flex-row items-center rounded-card border px-4 py-3 ${emotionConf.borderClass} ${emotionConf.bgClass}`}
          >
            <Text className="mr-2 text-2xl">{emotionConf.emoji}</Text>
            <Text className={`text-body-md font-semibold ${emotionConf.textClass}`}>
              {emotionConf.label}
            </Text>
          </View>

          {promptQuestion && (
            <View className="mb-4 rounded-card bg-cream-100 px-4 py-3">
              <Caption className="mb-1 uppercase tracking-wider text-text-muted">
                Question
              </Caption>
              <Body>{promptQuestion}</Body>
            </View>
          )}

          <Heading className="mb-2">Pose tes mots.</Heading>
          <Caption className="mb-4 text-text-muted">
            Titre automatique : <Text className="italic">{autoTitle}</Text>
          </Caption>

          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Écris ce qui te traverse, sans filtre…"
            placeholderTextColor="#9b93a8"
            textAlignVertical="top"
            className="min-h-[220px] rounded-card border border-sky-200 bg-surface p-4 text-body-md text-text-primary"
          />

          {error && (
            <Caption className="mt-3 text-rose-400">{error}</Caption>
          )}
        </ScrollView>

        <View className="mb-4 flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            className="items-center rounded-button border border-sky-200 bg-surface px-6 py-4"
          >
            <Text className="text-body-md font-semibold text-sky-700">Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={!canSubmit}
            className={`flex-1 items-center rounded-button px-6 py-4 shadow-soft ${
              canSubmit ? 'bg-sky-300' : 'bg-sky-100'
            }`}
          >
            <Text
              className={`text-body-md font-semibold ${
                canSubmit ? 'text-sky-900' : 'text-sky-400'
              }`}
            >
              {createEntry.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
}
