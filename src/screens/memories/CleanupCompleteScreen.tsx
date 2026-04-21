import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import { Button, Container, Heading, Body, Caption } from '@/components';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { useCreateMemory } from '@/hooks/useMemories';
import type { MemoriesStackParamList } from '@/navigation/types';

type Props = StackScreenProps<MemoriesStackParamList, 'CleanupComplete'>;
type Nav = StackNavigationProp<MemoriesStackParamList>;

export default function CleanupCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { deletedCount, keptCount } = route.params;

  const store = useMemoryStore();
  const createMemory = useCreateMemory();
  const committed = useRef(false);

  useEffect(() => {
    if (committed.current) return;
    committed.current = true;

    const results = store.cleanup.swipeResults;

    const commit = async () => {
      const deletedResults = results.filter((r) => r.decision === 'delete');

      // 1. Update local counters immediately (no backend dependency)
      store.incrementTotalSwiped(results.length);
      store.incrementTotalDeleted(deletedResults.length);

      // 2. Sync to backend — "delete" swipes become "hidden" (not deleted from device)
      //    "keep" swipes become "identified" (tracked but kept)
      for (const result of results) {
        try {
          await createMemory.mutateAsync({
            uri: result.uri,
            dateTaken: result.decidedAt,
            stage: result.decision === 'delete' ? 'hidden' : 'identified',
          });
        } catch {
          // best-effort — backend sync is optional
        }
      }
    };

    commit();
  }, []);

  const totalCount = deletedCount + keptCount;

  const getSupportMessage = () => {
    if (deletedCount === 0) {
      return 'Garder des souvenirs, c\'est aussi avancer à son rythme. Tu feras le tri quand tu te sentiras prêt(e).';
    }
    if (keptCount === 0) {
      return 'Bravo pour ce grand pas. Les photos sont masquées pour l\'instant — tu pourras les archiver ou les supprimer définitivement quand tu te sentiras prêt(e).';
    }
    return `Tu as fait le tri avec courage. ${deletedCount} souvenir${deletedCount > 1 ? 's' : ''} masqué${deletedCount > 1 ? 's' : ''}, ${keptCount} conservé${keptCount > 1 ? 's' : ''}. Tu avances à ton rythme.`;
  };

  return (
    <Container>
      <View className="flex-1 items-center justify-center px-4">
        {/* Emoji */}
        <Text style={{ fontSize: 72, marginBottom: 24 }}>
          {deletedCount > keptCount ? '🌱' : '✨'}
        </Text>

        <Heading className="text-center mb-3">Session terminée</Heading>

        {/* Stats */}
        <View className="flex-row gap-6 mb-8">
          <View className="items-center">
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#7C3AED' }}>
              {totalCount}
            </Text>
            <Caption className="text-lavender-500">traitées</Caption>
          </View>
          <View className="w-px bg-lavender-200" />
          <View className="items-center">
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#EF4444' }}>
              {deletedCount}
            </Text>
            <Caption className="text-lavender-500">mises de côté</Caption>
          </View>
          <View className="w-px bg-lavender-200" />
          <View className="items-center">
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#5A8F72' }}>
              {keptCount}
            </Text>
            <Caption className="text-lavender-500">conservées</Caption>
          </View>
        </View>

        {/* Support message */}
        <View className="bg-lavender-50 rounded-2xl px-6 py-5 mb-10 mx-2">
          <Body className="text-center text-lavender-700 leading-6">
            {getSupportMessage()}
          </Body>
        </View>

        <Button
          title="Retour à mes souvenirs"
          onPress={() => navigation.navigate('MemoriesMain')}
          className="w-full"
        />
      </View>
    </Container>
  );
}
