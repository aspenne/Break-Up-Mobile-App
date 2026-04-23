import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { BackButton, Button, Caption, Container, Heading } from '@/components';
import { useCreateArticle } from '@/hooks/useBlog';
import { colors } from '@/theme';
import type { BlogStackParamList } from '@/navigation/types';
import type { ArticleCategory } from '@/types';

type Nav = StackNavigationProp<BlogStackParamList, 'BlogArticleCreate'>;

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'toxic-relationships', label: 'Relations toxiques' },
  { value: 'grief', label: 'Deuil' },
  { value: 'trust', label: 'Confiance' },
  { value: 'rebuilding', label: 'Reconstruction' },
  { value: 'self-care', label: 'Prendre soin de soi' },
];

export default function BlogArticleCreateScreen() {
  const navigation = useNavigation<Nav>();
  const createArticle = useCreateArticle();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('rebuilding');
  const [readTimeMinutes, setReadTimeMinutes] = useState('5');

  const handleSubmit = () => {
    const minutes = parseInt(readTimeMinutes, 10);
    if (!title.trim() || title.trim().length < 3) {
      Alert.alert('Titre requis', 'Le titre doit faire au moins 3 caractères.');
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      Alert.alert('Contenu requis', 'Le contenu doit faire au moins 10 caractères.');
      return;
    }
    if (!minutes || minutes <= 0 || minutes > 120) {
      Alert.alert('Durée invalide', 'La durée de lecture doit être entre 1 et 120 minutes.');
      return;
    }

    createArticle.mutate(
      {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        category,
        readTimeMinutes: minutes,
      },
      {
        onSuccess: () => {
          Alert.alert('Article publié', 'Votre article est en ligne.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            'Impossible de créer l\'article.';
          Alert.alert('Erreur', String(msg));
        },
      }
    );
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View className="mb-4 mt-2">
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Heading className="mb-6" style={{ color: colors.lavender[700] }}>
            Nouvel article ✍️
          </Heading>

          {/* Title */}
          <Caption className="mb-2 uppercase tracking-wider" style={{ color: colors.lavender[500] }}>
            Titre
          </Caption>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Un titre inspirant…"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.lavender[100],
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.textPrimary,
              marginBottom: 20,
            }}
          />

          {/* Category */}
          <Caption className="mb-2 uppercase tracking-wider" style={{ color: colors.lavender[500] }}>
            Catégorie
          </Caption>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map((c) => {
              const active = category === c.value;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => setCategory(c.value)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: active ? colors.lavender[300] : '#fff',
                    borderWidth: 1,
                    borderColor: active ? colors.lavender[400] : colors.lavender[100],
                  }}>
                  <Text
                    style={{
                      color: active ? colors.lavender[900] : colors.lavender[600],
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Read time */}
          <Caption className="mb-2 uppercase tracking-wider" style={{ color: colors.lavender[500] }}>
            Durée de lecture (minutes)
          </Caption>
          <TextInput
            value={readTimeMinutes}
            onChangeText={(v) => setReadTimeMinutes(v.replace(/[^0-9]/g, ''))}
            placeholder="5"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.lavender[100],
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.textPrimary,
              marginBottom: 20,
              width: 100,
            }}
          />

          {/* Excerpt */}
          <Caption className="mb-2 uppercase tracking-wider" style={{ color: colors.lavender[500] }}>
            Résumé (optionnel)
          </Caption>
          <TextInput
            value={excerpt}
            onChangeText={setExcerpt}
            placeholder="Un court extrait pour donner envie…"
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.lavender[100],
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: colors.textPrimary,
              marginBottom: 20,
              minHeight: 70,
              textAlignVertical: 'top',
            }}
          />

          {/* Content */}
          <Caption className="mb-2 uppercase tracking-wider" style={{ color: colors.lavender[500] }}>
            Contenu
          </Caption>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Écrivez votre article ici…"
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.lavender[100],
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: colors.textPrimary,
              marginBottom: 24,
              minHeight: 200,
              textAlignVertical: 'top',
            }}
          />

          <Button
            title={createArticle.isPending ? 'Publication…' : 'Publier l\'article'}
            onPress={handleSubmit}
            disabled={createArticle.isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
