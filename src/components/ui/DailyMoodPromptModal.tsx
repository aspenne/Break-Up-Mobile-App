import { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/stores';
import { useJournalEntries } from '@/hooks/useJournal';
import { isSameDay } from '@/utils/date';

type TabNav = {
  navigate: (tab: string, params?: object) => void;
};

export function DailyMoodPromptModal() {
  const navigation = useNavigation<TabNav>();
  const lastMoodPromptDate = useAppStore((s) => s.lastMoodPromptDate);
  const markSeen = useAppStore((s) => s.markMoodPromptSeenToday);
  const { data: entries, isLoading } = useJournalEntries(1, 5);

  const today = new Date();
  const alreadySeenToday =
    !!lastMoodPromptDate && isSameDay(lastMoodPromptDate, today);
  const hasEntryToday =
    entries?.data?.some((e) => isSameDay(e.createdAt, today)) ?? false;

  const shouldShow = !isLoading && !alreadySeenToday && !hasEntryToday;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldShow) {
      // Délai un peu plus long que la citation pour ne pas se chevaucher
      const t = setTimeout(() => setVisible(true), 1400);
      return () => clearTimeout(t);
    }
  }, [shouldShow]);

  const handleSkip = () => {
    setVisible(false);
    markSeen();
  };

  const handleStart = () => {
    setVisible(false);
    markSeen();
    navigation.navigate('JournalTab', {
      screen: 'JournalComposeEmotion',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleSkip}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={handleSkip}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="w-full rounded-3xl bg-surface px-8 py-10 shadow-lg">
            <Text className="mb-6 text-center text-5xl">🌤️</Text>

            <Text className="mb-1 text-center text-caption uppercase tracking-widest text-sky-400">
              Mood du jour
            </Text>

            <Text className="mb-3 text-center text-heading-md font-semibold text-text-primary">
              Comment te sens-tu{'\n'}aujourd&apos;hui ?
            </Text>

            <Text className="mb-8 text-center text-body-sm leading-relaxed text-text-muted">
              Prends un instant pour poser tes mots.{'\n'}Ça ne prend que quelques minutes.
            </Text>

            <TouchableOpacity
              onPress={handleStart}
              activeOpacity={0.8}
              className="mb-3 items-center rounded-button bg-sky-300 py-4"
            >
              <Text className="text-body-md font-semibold text-sky-900">
                C&apos;est parti
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              className="items-center py-2"
            >
              <Text className="text-body-sm font-medium text-text-muted">
                Passer pour aujourd&apos;hui
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
