import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container, Heading, Body, Caption, Card, DailyQuoteModal, Logo, ProfileButton } from '@/components';
import { useMe } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournal';
import { useArticles } from '@/hooks/useBlog';
import { isSameDay } from '@/utils/date';
import { JOURNAL_EMOTION_CONFIG } from '@/types/journal';
import { colors } from '@/theme';

type TabNav = {
  navigate: (tab: string, params?: object) => void;
};

const FEATURE_CARDS = [
  {
    title: 'Souvenirs',
    description: 'Libère ton espace intérieur',
    emojis: '🗑️',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    titleClass: 'text-sky-700',
    tab: 'MemoriesTab',
  },
  {
    title: 'Chat',
    description: "Tu n'es pas seul(e)",
    emojis: '💬',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    titleClass: 'text-sky-700',
    tab: 'ChatTab',
  },
  {
    title: 'Blog',
    description: 'Comprendre et guérir',
    emojis: '📖',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    titleClass: 'text-sky-700',
    tab: 'BlogTab',
  },
  {
    title: 'Journal',
    description: 'Suis ton évolution',
    emojis: '✍️',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    titleClass: 'text-sky-700',
    tab: 'JournalTab',
  },
];

export default function HomeScreen() {
  const { data: user } = useMe();
  const navigation = useNavigation<TabNav>();
  const { data: entries } = useJournalEntries(1, 5);
  const { data: articles } = useArticles();

  const todayEntry = useMemo(() => {
    return entries?.data?.find((e) => isSameDay(e.createdAt, new Date())) ?? null;
  }, [entries]);

  const featuredArticle = articles?.data?.[0];

  return (
    <Container>
      <DailyQuoteModal />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View className="flex-row items-center pb-6 pt-12">
          <Logo size="sm" />
          <View className="ml-3 flex-1">
            <Heading className="mb-1 text-heading-lg" numberOfLines={2} adjustsFontSizeToFit>
              Bonjour {user?.firstName ?? ''} {user?.avatarEmoji ?? ''}
            </Heading>
            <Body className="text-text-muted">Chaque jour est un pas en avant.</Body>
          </View>
          <ProfileButton />
        </View>

        {/* Mood du jour */}
        <Pressable
          onPress={() => navigation.navigate('JournalTab')}
          className={`mb-4 rounded-card border p-5 shadow-soft ${
            todayEntry ? 'border-sage-300 bg-sage-50' : 'border-sky-300 bg-sky-50'
          }`}
        >
          <View className="flex-row items-center">
            <Text className="mr-3 text-4xl">
              {todayEntry ? JOURNAL_EMOTION_CONFIG[todayEntry.emotion].emoji : '🌤️'}
            </Text>
            <View className="flex-1">
              <Caption className={todayEntry ? 'text-sage-700' : 'text-sky-700'}>
                {todayEntry ? "Mood du jour" : "Comment te sens-tu aujourd'hui ?"}
              </Caption>
              <Body className="font-semibold" numberOfLines={2}>
                {todayEntry
                  ? JOURNAL_EMOTION_CONFIG[todayEntry.emotion].label
                  : 'Prends un instant pour poser tes mots'}
              </Body>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={todayEntry ? colors.sage[700] : colors.sky[700]}
            />
          </View>
        </Pressable>

        {/* 2x2 grid */}
        <View className="mb-4 flex-row flex-wrap gap-3">
          {FEATURE_CARDS.map((card) => (
            <TouchableOpacity
              key={card.tab}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(card.tab)}
              className={`w-[48%] rounded-card border p-5 shadow-soft ${card.bgClass} ${card.borderClass}`}
              style={{ minHeight: 140 }}
            >
              <Text className="mb-3 text-3xl">{card.emojis}</Text>
              <Text
                className={`mb-1 text-body-md font-bold ${card.titleClass}`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {card.title}
              </Text>
              <Text
                className="text-body-sm leading-snug text-text-muted"
                numberOfLines={2}
              >
                {card.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Article du jour */}
        {featuredArticle && (
          <Pressable
            onPress={() => navigation.navigate('BlogTab')}
            className="mb-4 overflow-hidden rounded-card border border-sky-100 bg-surface shadow-soft"
          >
            {featuredArticle.imageUrl ? (
              <Image
                source={{ uri: featuredArticle.imageUrl }}
                style={{ width: '100%', height: 120, backgroundColor: colors.sky[50] }}
                resizeMode="cover"
              />
            ) : null}
            <View className="p-5">
              <Caption className="mb-1 uppercase tracking-wider text-sky-500">
                📖 Article du jour
              </Caption>
              <Body className="font-semibold" numberOfLines={2}>
                {featuredArticle.title}
              </Body>
              <Caption className="mt-1 text-text-muted" numberOfLines={2}>
                {featuredArticle.excerpt}
              </Caption>
            </View>
          </Pressable>
        )}

        {/* Citation apaisante */}
        <Card className="items-center bg-cream-100 py-6">
          <Text className="text-5xl">🌅</Text>
          <Body className="mt-3 text-center font-medium text-sky-700">
            « Le calme revient toujours,{'\n'}comme la vague qui s'apaise. »
          </Body>
        </Card>

      </ScrollView>
    </Container>
  );
}
