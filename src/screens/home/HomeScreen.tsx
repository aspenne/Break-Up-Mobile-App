import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Heading, Body, DailyQuoteModal } from '@/components';
import { useMe } from '@/hooks/useAuth';

type TabNav = {
  navigate: (tab: string) => void;
};

const FEATURE_CARDS = [
  {
    title: 'Souvenirs',
    description: 'Libère ton espace intérieur',
    emojis: '🗑️',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-100',
    titleClass: 'text-rose-400',
    tab: 'MemoriesTab',
  },
  {
    title: 'Chat',
    description: 'Tu n\'es pas seul(e)',
    emojis: '💬',
    bgClass: 'bg-lavender-50',
    borderClass: 'border-lavender-200',
    titleClass: 'text-lavender-700',
    tab: 'ChatTab',
  },
  {
    title: 'Blog',
    description: 'Comprendre et guérir',
    emojis: '📖',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-100',
    titleClass: 'text-sky-500',
    tab: 'BlogTab',
  },
  {
    title: 'Journal',
    description: 'Suis ton évolution',
    emojis: '✍️',
    bgClass: 'bg-sage-50',
    borderClass: 'border-sage-200',
    titleClass: 'text-sage-600',
    tab: 'JournalTab',
  },
];

export default function HomeScreen() {
  const { data: user } = useMe();
  const navigation = useNavigation<TabNav>();

  return (
    <Container>
      <DailyQuoteModal />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View className="pb-6 pt-12">
          <Heading className="mb-1 text-heading-xl">
            Bonjour {user?.firstName ?? ''} {user?.avatarEmoji ?? ''}
          </Heading>
          <Body className="text-text-muted">Chaque jour est un pas en avant.</Body>
        </View>

        {/* 2x2 grid */}
        <View className="flex-row flex-wrap gap-3">
          {FEATURE_CARDS.map((card) => (
            <TouchableOpacity
              key={card.tab}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(card.tab)}
              className={`w-[48%] rounded-card border p-5 shadow-soft ${card.bgClass} ${card.borderClass}`}
              style={{ minHeight: 140 }}
            >
              <Text className="mb-3 text-3xl">{card.emojis}</Text>
              <Text className={`mb-1 text-body-md font-bold ${card.titleClass}`}>
                {card.title}
              </Text>
              <Text className="text-body-sm leading-snug text-text-muted">
                {card.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}
