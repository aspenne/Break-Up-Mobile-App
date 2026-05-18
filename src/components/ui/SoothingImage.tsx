import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ImageBackground, View, type ImageSourcePropType, type ViewStyle } from 'react-native';

const BACKGROUNDS: ImageSourcePropType[] = [
  require('../../../assets/background/bg-1.jpg'),
  require('../../../assets/background/bg-2.jpg'),
  require('../../../assets/background/bg-3.jpg'),
  require('../../../assets/background/bg-4.jpg'),
  require('../../../assets/background/bg-5.jpg'),
  require('../../../assets/background/bg-6.jpg'),
];

function pickRandom(): ImageSourcePropType {
  return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
}

interface SoothingImageProps {
  height?: number;
  borderRadius?: number;
  overlayOpacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Banner image picked at random from assets/background/, with an optional
 * dark overlay for readability. Re-rolls a new image every time the
 * containing screen is focused.
 */
export function SoothingImage({
  height = 160,
  borderRadius = 16,
  overlayOpacity = 0.25,
  style,
  children,
}: SoothingImageProps) {
  const [source, setSource] = useState<ImageSourcePropType>(() => pickRandom());

  useFocusEffect(
    useCallback(() => {
      setSource(pickRandom());
    }, [])
  );

  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      imageStyle={{ borderRadius }}
      style={[
        {
          height,
          borderRadius,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          ...StyleSheetAbsoluteFill,
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          borderRadius,
        }}
      />
      <View style={{ paddingHorizontal: 20, alignItems: 'center', zIndex: 1 }}>
        {children}
      </View>
    </ImageBackground>
  );
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
