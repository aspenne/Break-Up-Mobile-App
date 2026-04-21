import { forwardRef, useImperativeHandle } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { ScannedPhoto } from '@/types/cleanup';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;
const MAX_ROTATION = 15;

export interface SwipeCardRef {
  triggerLeft: () => void;
  triggerRight: () => void;
}

interface SwipeCardProps {
  photo: ScannedPhoto;
  isTop: boolean;
  stackIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ photo, isTop, stackIndex, onSwipeLeft, onSwipeRight }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scaleBase = 1 - stackIndex * 0.06;
    const translateYBase = stackIndex * 12;

    const finishSwipe = (direction: 'left' | 'right') => {
      'worklet';
      const targetX = direction === 'left' ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
      translateX.value = withTiming(targetX, { duration: 280 }, () => {
        runOnJS(direction === 'left' ? onSwipeLeft : onSwipeRight)();
      });
    };

    const gesture = Gesture.Pan()
      .enabled(isTop)
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY * 0.3;
      })
      .onEnd((event) => {
        if (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -600) {
          finishSwipe('left');
        } else if (event.translationX > SWIPE_THRESHOLD || event.velocityX > 600) {
          finishSwipe('right');
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      });

    useImperativeHandle(ref, () => ({
      triggerLeft: () => {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          runOnJS(onSwipeLeft)();
        });
      },
      triggerRight: () => {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          runOnJS(onSwipeRight)();
        });
      },
    }));

    const cardStyle = useAnimatedStyle(() => {
      const rotation = (translateX.value / SCREEN_WIDTH) * MAX_ROTATION;
      const scale = isTop ? 1 : scaleBase + (Math.abs(translateX.value) / SCREEN_WIDTH) * 0.06;
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: isTop ? translateY.value : translateYBase },
          { rotate: `${isTop ? rotation : 0}deg` },
          { scale },
        ],
      };
    });

    const overlayDeleteStyle = useAnimatedStyle(() => ({
      opacity: Math.max(0, (-translateX.value - 30) / (SWIPE_THRESHOLD - 30)),
    }));

    const overlayKeepStyle = useAnimatedStyle(() => ({
      opacity: Math.max(0, (translateX.value - 30) / (SWIPE_THRESHOLD - 30)),
    }));

    const uri = photo.resolvedUri;

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: '#F5F0FF',
              shadowColor: '#C4B5FD',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            },
            cardStyle,
          ]}>
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Delete overlay */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(239,68,68,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              },
              overlayDeleteStyle,
            ]}>
            <View
              style={{
                borderWidth: 3,
                borderColor: '#DC2626',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}>
              <Animated.Text
                style={{ fontSize: 32, color: '#DC2626', fontWeight: '700' }}>
                Supprimer
              </Animated.Text>
            </View>
          </Animated.View>

          {/* Keep overlay */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(134,176,150,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              },
              overlayKeepStyle,
            ]}>
            <View
              style={{
                borderWidth: 3,
                borderColor: '#5A8F72',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}>
              <Animated.Text
                style={{ fontSize: 32, color: '#5A8F72', fontWeight: '700' }}>
                Garder
              </Animated.Text>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

SwipeCard.displayName = 'SwipeCard';
