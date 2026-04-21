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
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Heading,
  Caption,
  LoadingSpinner,
  BackButton,
} from '@/components';
import { useJournalEntries, useUpdateJournalEntry } from '@/hooks/useJournal';
import { EMOTION_ORDER, JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { EmotionalState } from '@/types';
import type { JournalStackParamList } from '@/navigation/types';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalEntryEdit'>;
type Rt = RouteProp<JournalStackParamList, 'JournalEntryEdit'>;

export default function JournalEntryEditScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { data, isLoading } = useJournalEntries();
  const updateEntry = useUpdateJournalEntry();

  const entry = useMemo(
    () => data?.data.find((e) => e.id === params.entryId) ?? null,
    [data, params.entryId]
  );

  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [emotion, setEmotion] = useState<EmotionalState | null>(entry?.emotion ?? null);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    emotion !== null &&
    !updateEntry.isPending;

  const handleSave = async () => {
    if (!emotion) return;
    setError(null);
    try {
      await updateEntry.mutateAsync({
        id: params.entryId,
        title: title.trim(),
        content: content.trim(),
        emotion,
      });
      navigation.goBack();
    } catch {
      setError('Impossible de sauvegarder. Réessaie dans un instant.');
    }
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Container>
        <BackButton onPress={() => navigation.goBack()} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Heading className="mb-4 mt-2">Modifier l&apos;entrée</Heading>

          <Caption className="mb-2 uppercase tracking-wider text-text-muted">Émotion</Caption>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {EMOTION_ORDER.map((key) => {
              const conf = JOURNAL_EMOTION_CONFIG[key];
              const selected = emotion === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setEmotion(key)}
                  activeOpacity={0.7}
                  className={`flex-row items-center rounded-button border px-3 py-2 ${
                    selected
                      ? 'border-lavender-400 bg-lavender-100'
                      : `${conf.borderClass} ${conf.bgClass}`
                  }`}
                >
                  <Text className="mr-1.5 text-base">{conf.emoji}</Text>
                  <Text
                    className={`text-body-sm font-semibold ${
                      selected ? 'text-lavender-800' : conf.textClass
                    }`}
                  >
                    {conf.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Caption className="mb-2 uppercase tracking-wider text-text-muted">Titre</Caption>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="mb-4 rounded-card border border-lavender-200 bg-surface px-4 py-3 text-body-md text-text-primary"
          />

          <Caption className="mb-2 uppercase tracking-wider text-text-muted">Contenu</Caption>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            className="min-h-[220px] rounded-card border border-lavender-200 bg-surface p-4 text-body-md text-text-primary"
          />

          {error && <Caption className="mt-3 text-rose-400">{error}</Caption>}
        </ScrollView>

        <View className="mb-4 flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            className="items-center rounded-button border border-lavender-200 bg-surface px-6 py-4"
          >
            <Text className="text-body-md font-semibold text-lavender-700">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={!canSave}
            className={`flex-1 items-center rounded-button px-6 py-4 shadow-soft ${
              canSave ? 'bg-lavender-300' : 'bg-lavender-100'
            }`}
          >
            <Text
              className={`text-body-md font-semibold ${
                canSave ? 'text-lavender-900' : 'text-lavender-400'
              }`}
            >
              {updateEntry.isPending ? 'Sauvegarde…' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
}
