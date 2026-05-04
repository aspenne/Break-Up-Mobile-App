import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme';

export const LoadingSpinner = () => (
  <View className="flex-1 items-center justify-center bg-background">
    <ActivityIndicator size="large" color={colors.sky[300]} />
  </View>
);
