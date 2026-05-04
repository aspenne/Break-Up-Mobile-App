import {
  Body,
  Caption,
  Card,
  Container,
  EmptyState,
  Heading,
  LoadingSpinner,
} from '@/components';
import { useArticles } from '@/hooks/useBlog';
import { colors } from '@/theme';
import { useUserStore } from '@/stores';
import type { BlogStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';

type Nav = StackNavigationProp<BlogStackParamList, 'BlogList'>;

const CATEGORY_LABELS: Record<string, string> = {
  'toxic-relationships': 'Relations toxiques',
  grief: 'Deuil',
  trust: 'Confiance',
  rebuilding: 'Reconstruction',
  'self-care': 'Prendre soin de soi',
};

export default function BlogScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isError } = useArticles();
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.roles?.includes('admin') ?? false;

  const articles = data?.data ?? [];

  const listHeader = (
    <View className="mb-4 px-4">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading style={{ color: colors.sky[700] }}>Blog 📖</Heading>
        {isAdmin && (
          <Pressable
            onPress={() => navigation.navigate('BlogArticleCreate')}
            style={{
              backgroundColor: colors.sky[300],
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              shadowColor: colors.sky[500],
              shadowOpacity: 0.15,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}>
            <Text style={{ color: colors.sky[900], fontWeight: '700', fontSize: 13 }}>
              + Article
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Container>
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<LoadingSpinner />}
        />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={articles}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BlogArticle', { articleId: item.id })}
          >
            <Card className="mx-4 mb-3 border border-sky-100">
              <Caption className="mb-1 uppercase" style={{ color: colors.sky[400] }}>
                {CATEGORY_LABELS[item.category] ?? item.category} · {item.readTimeMinutes} min
              </Caption>
              <Body className="font-semibold">{item.title}</Body>
              <Caption className="mt-1" style={{ color: colors.textMuted }}>
                {item.excerpt}
              </Caption>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isError ? (
            <View className="px-4">
              <Caption className="text-sky-400 text-center" style={{ color: colors.sky[400] }}>
                Impossible de charger les articles.
              </Caption>
            </View>
          ) : (
            <EmptyState
              icon="book-open"
              title="Aucun article"
              description="Les articles seront bientôt disponibles."
            />
          )
        }
      />
    </Container>
  );
}
