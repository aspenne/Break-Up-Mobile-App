import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Container, Heading, Caption, LoadingSpinner, BackButton } from '@/components';
import { useArticle, useToggleFavorite } from '@/hooks/useBlog';
import type { BlogStackParamList } from '@/navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme';

type Nav = StackNavigationProp<BlogStackParamList, 'BlogArticle'>;
type Rt = RouteProp<BlogStackParamList, 'BlogArticle'>;

const CATEGORY_LABELS: Record<string, string> = {
  'toxic-relationships': 'Relations toxiques',
  grief: 'Deuil',
  trust: 'Confiance',
  rebuilding: 'Reconstruction',
  'self-care': 'Prendre soin de soi',
};

export default function BlogArticleScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { data: article, isLoading } = useArticle(params.articleId);
  const toggleFavorite = useToggleFavorite();

  if (isLoading || !article) {
    return (
      <Container>
        <BackButton onPress={() => navigation.goBack()} />
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <View className="mb-4 mt-2 flex-row items-center justify-between">
        <BackButton onPress={() => navigation.goBack()} />
        <TouchableOpacity
          onPress={() => toggleFavorite.mutate(article.id)}
          activeOpacity={0.7}
          className="rounded-full border border-sky-100 bg-sky-50 p-2"
        >
          <Feather
            name="heart"
            size={20}
            color={colors.sky[400]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Caption className="mb-2 uppercase tracking-wider text-sky-500">
          {CATEGORY_LABELS[article.category] ?? article.category} · {article.readTimeMinutes} min
        </Caption>

        <Heading className="mb-4 text-2xl leading-tight">{article.title}</Heading>

        <View className="mb-6 rounded-card bg-sky-50 px-4 py-3">
          <Text className="text-body-md italic text-sky-500">{article.excerpt}</Text>
        </View>

        <Text className="text-body-md leading-relaxed text-text-primary">
          {article.content}
        </Text>

        <Caption className="mt-8 text-center text-text-muted">
          Publié le{' '}
          {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Caption>
      </ScrollView>
    </Container>
  );
}
