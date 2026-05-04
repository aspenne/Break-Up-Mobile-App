import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/theme';

interface LoveSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function LoveSlider({ value, onValueChange }: LoveSliderProps) {
  return (
    <View className="items-center">
      <Text className="mb-6 text-6xl font-bold text-sky-500">{value}</Text>
      <View className="w-full px-2">
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={colors.sky[400]}
          maximumTrackTintColor={colors.sky[100]}
          thumbTintColor={colors.sky[500]}
        />
      </View>
      <View className="mt-3 w-full flex-row justify-between px-2">
        <Text className="text-caption text-text-muted">Plus du tout</Text>
        <Text className="text-caption text-text-muted">Toujours autant</Text>
      </View>
    </View>
  );
}
