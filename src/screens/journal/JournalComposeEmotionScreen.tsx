import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Container, Heading, Body } from '@/components';
import { useJournalComposeStore } from '@/stores';
import { EMOTION_ORDER, JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import type { EmotionalState } from '@/types';
import type { JournalStackParamList } from '@/navigation/types';
import { ComposeHeader } from './components/ComposeHeader';

type Nav = StackNavigationProp<JournalStackParamList, 'JournalComposeEmotion'>;

export default function JournalComposeEmotionScreen() {
  const navigation = useNavigation<Nav>();
  const { emotion, setEmotion, reset } = useJournalComposeStore();

  const handleSelect = (value: EmotionalState) => {
    setEmotion(value);
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
      </ScrollView>
    </Container>
  );
}
