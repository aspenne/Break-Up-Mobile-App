import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Container, Heading, Body } from '@/components';
import { useJournalComposeStore } from '@/stores';
import { EMOTION_ORDER, JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { EmotionalState } from '@/types';
import type { JournalStackParamList } from '@/navigation/types';
import { colors } from '@/theme';
import { ComposeHeader } from './components/ComposeHeader';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalComposeEmotion'>;

export default function JournalComposeEmotionScreen() {
  const navigation = useNavigation<Nav>();
  const { emotion, customEmotion, setEmotion, setCustomEmotion, reset } =
    useJournalComposeStore();

  const [otherDraft, setOtherDraft] = useState(customEmotion ?? '');

  const handleSelect = (value: EmotionalState) => {
    setEmotion(value);
    if (value !== 'other') {
      navigation.navigate('JournalComposePrompt');
    }
  };

  const handleConfirmOther = () => {
    const trimmed = otherDraft.trim();
    if (!trimmed) return;
    setCustomEmotion(trimmed);
    navigation.navigate('JournalComposePrompt');
  };

  const handleCancel = () => {
    reset();
    navigation.goBack();
  };

  return (
    <Container>
      <ComposeHeader step={0} total={3} onClose={handleCancel} />
      <Heading className="mb-2">Comment tu te sens ?</Heading>
      <Body className="mb-6">Choisis l&apos;émotion la plus proche de ton ressenti maintenant.</Body>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="flex-row flex-wrap gap-3">
          {EMOTION_ORDER.map((key) => {
            const conf = JOURNAL_EMOTION_CONFIG[key];
            const selected = emotion === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(key)}
                activeOpacity={0.7}
                className={`w-[48%] items-center rounded-card border px-4 py-6 ${
                  selected
                    ? 'border-sky-400 bg-sky-100'
                    : `${conf.borderClass} ${conf.bgClass}`
                }`}
              >
                <Text className="mb-2 text-4xl">{conf.emoji}</Text>
                <Text
                  className={`text-body-md font-semibold ${
                    selected ? 'text-sky-800' : conf.textClass
                  }`}
                >
                  {conf.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {emotion === 'other' && (
          <View className="mt-6 rounded-card border border-sky-200 bg-sky-50 p-4">
            <Body className="mb-2 font-medium text-sky-700">
              Décris ton émotion en quelques mots
            </Body>
            <TextInput
              value={otherDraft}
              onChangeText={setOtherDraft}
              placeholder="ex: nostalgique, en paix, anxieux(se)…"
              placeholderTextColor={colors.textMuted}
              maxLength={80}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmOther}
              className="rounded-input border border-sky-200 bg-surface px-4 py-3 text-body-md text-text-primary"
            />
            <TouchableOpacity
              onPress={handleConfirmOther}
              activeOpacity={0.7}
              disabled={!otherDraft.trim()}
              className={`mt-3 items-center rounded-button px-6 py-3 ${
                otherDraft.trim() ? 'bg-sky-300' : 'bg-sky-100'
              }`}
            >
              <Text
                className={`text-body-md font-semibold ${
                  otherDraft.trim() ? 'text-sky-900' : 'text-sky-400'
                }`}
              >
                Continuer
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Container>
  );
}
