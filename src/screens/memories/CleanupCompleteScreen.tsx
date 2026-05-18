import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
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
  const [actuallyDeleted, setActuallyDeleted] = useState<number | null>(null);

  useEffect(() => {
    if (committed.current) return;
    committed.current = true;

    const results = store.cleanup.swipeResults;
    const toDelete = results.filter((r) => r.decision === 'delete');
    const toKeep = results.filter((r) => r.decision === 'keep');

    const commit = async () => {
      // 1. Update local counters immediately
      store.incrementTotalSwiped(results.length);
      store.incrementTotalDeleted(toDelete.length);

      // 2. Really delete the swiped-left photos from the device.
      //    deleteAssetsAsync shows a confirmation prompt (iOS/Android 11+)
      //    and returns true if the user confirmed. Bulk-delete in one call.
      let deletionConfirmed = false;
      if (toDelete.length > 0) {
        try {
          deletionConfirmed = await MediaLibrary.deleteAssetsAsync(
            toDelete.map((r) => r.assetId)
          );
        } catch {
          deletionConfirmed = false;
        }
      }
      setActuallyDeleted(deletionConfirmed ? toDelete.length : 0);

      // 3. Sync to backend so they don't reappear next session.
      //    - delete results → stage 'deleted' if confirmed, else 'hidden'
      //    - keep results   → stage 'identified'
      for (const r of toDelete) {
        try {
          await createMemory.mutateAsync({
            assetId: r.assetId,
            uri: r.uri,
            dateTaken: r.decidedAt,
            stage: deletionConfirmed ? 'deleted' : 'hidden',
          });
        } catch {
          // best-effort
        }
      }
      for (const r of toKeep) {
        try {
          await createMemory.mutateAsync({
            assetId: r.assetId,
            uri: r.uri,
            dateTaken: r.decidedAt,
            stage: 'identified',
          });
        } catch {
          // best-effort
        }
      }
    };

    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCount = deletedCount + keptCount;

  const getSupportMessage = () => {
    if (deletedCount === 0) {
      return "Garder des souvenirs, c'est aussi avancer à son rythme. Tu feras le tri quand tu te sentiras prêt(e).";
    }
    if (actuallyDeleted === null) {
      return 'Suppression en cours…';
    }
    if (actuallyDeleted === 0 && deletedCount > 0) {
      return `Tu as marqué ${deletedCount} souvenir${deletedCount > 1 ? 's' : ''} à supprimer, mais la suppression a été annulée. Ils sont masqués pour ne pas réapparaître la prochaine fois.`;
    }
    if (keptCount === 0) {
      return `Bravo pour ce grand pas. ${actuallyDeleted} souvenir${actuallyDeleted > 1 ? 's' : ''} supprimé${actuallyDeleted > 1 ? 's' : ''} de ton appareil.`;
    }
    return `Tu as fait le tri avec courage. ${actuallyDeleted} souvenir${actuallyDeleted > 1 ? 's' : ''} supprimé${actuallyDeleted > 1 ? 's' : ''}, ${keptCount} conservé${keptCount > 1 ? 's' : ''}. Tu avances à ton rythme.`;
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
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#0369a1' }}>
              {totalCount}
            </Text>
            <Caption className="text-sky-500">traitées</Caption>
          </View>
          <View className="w-px bg-sky-200" />
          <View className="items-center">
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#EF4444' }}>
              {deletedCount}
            </Text>
            <Caption className="text-sky-500">supprimées</Caption>
          </View>
          <View className="w-px bg-sky-200" />
          <View className="items-center">
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#467c46' }}>
              {keptCount}
            </Text>
            <Caption className="text-sky-500">conservées</Caption>
          </View>
        </View>

        {/* Support message */}
        <View className="bg-sky-50 rounded-2xl px-6 py-5 mb-10 mx-2">
          <Body className="text-center text-sky-700 leading-6">
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
