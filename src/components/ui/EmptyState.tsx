import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme';

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="mb-6 rounded-full bg-lavender-50 p-6">
      <Feather name={icon} size={40} color={colors.lavender[300]} />
    </View>
    <Text className="mb-2 text-center text-heading-md font-semibold text-text-primary">
      {title}
    </Text>
    <Text className="text-center text-body-md text-text-secondary">{description}</Text>
  </View>
);
