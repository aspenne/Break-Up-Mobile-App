import { useCallback, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeCard } from '@/components';
import type { SwipeCardRef } from '@/components';
import { useMemoryStore } from '@/stores/useMemoryStore';
import type { MemoriesStackParamList } from '@/navigation/types';
import type { ScannedPhoto } from '@/types/cleanup';

type Nav = StackNavigationProp<MemoriesStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.35;
const MAX_VISIBLE_CARDS = 3;

export default function PhotoSwipeScreen() {
  const navigation = useNavigation<Nav>();
  const store = useMemoryStore();
  const cardRef = useRef<SwipeCardRef>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const queue = store.cleanup.swipeQueue;
  const total = queue.length;

  const handleStop = useCallback(() => {
    const results = store.cleanup.swipeResults;
    const deletedCount = results.filter((r) => r.decision === 'delete').length;
    const keptCount = results.filter((r) => r.decision === 'keep').length;
    navigation.replace('CleanupComplete', { deletedCount, keptCount });
  }, [store, navigation]);

  const handleDecision = useCallback(
    (decision: 'keep' | 'delete', photo: ScannedPhoto) => {
      store.recordSwipe({
        assetId: photo.asset.id,
        uri: photo.resolvedUri,
        decision,
        decidedAt: new Date().toISOString(),
      });

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= total) {
        // Count from previous results + current decision
        const prevResults = store.cleanup.swipeResults;
        const deletedCount =
          prevResults.filter((r) => r.decision === 'delete').length +
          (decision === 'delete' ? 1 : 0);
        const keptCount =
          prevResults.filter((r) => r.decision === 'keep').length +
          (decision === 'keep' ? 1 : 0);
        navigation.replace('CleanupComplete', { deletedCount, keptCount });
      }
    },
    [currentIndex, total, store, navigation]
  );

  if (total === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF6EC' }}>
        <Text style={{ color: '#7C3AED', fontSize: 18 }}>Aucune photo à traiter</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24, padding: 16 }}>
          <Text style={{ color: '#A78BFA' }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const visibleCards = queue
    .slice(currentIndex, currentIndex + MAX_VISIBLE_CARDS)
    .reverse();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FDF6EC' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 60,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 64 }} />
          <Text style={{ color: '#7C3AED', fontSize: 14, fontWeight: '600' }}>
            {Math.min(currentIndex + 1, total)} / {total}
          </Text>
          <Pressable
            onPress={handleStop}
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}>
            <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>
              Arrêter
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: '#A78BFA', fontSize: 13, marginTop: 4, textAlign: 'center' }}>
          Gauche pour supprimer · Droite pour garder
        </Text>
      </View>

      {/* Cards stack */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
          {visibleCards.map((photo, reverseIdx) => {
            const stackIndex = visibleCards.length - 1 - reverseIdx;
            const isTop = stackIndex === 0;

            return (
              <SwipeCard
                key={photo.asset.id}
                ref={isTop ? cardRef : undefined}
                photo={photo}
                isTop={isTop}
                stackIndex={stackIndex}
                onSwipeLeft={() => handleDecision('delete', photo)}
                onSwipeRight={() => handleDecision('keep', photo)}
              />
            );
          })}
        </View>
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
          paddingBottom: 48,
          paddingTop: 16,
        }}>
        {/* Delete */}
        <Pressable
          onPress={() => cardRef.current?.triggerLeft()}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <Text style={{ fontSize: 28 }}>🗑</Text>
        </Pressable>

        {/* Keep */}
        <Pressable
          onPress={() => cardRef.current?.triggerRight()}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#86B096',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <Text style={{ fontSize: 28 }}>♡</Text>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}
