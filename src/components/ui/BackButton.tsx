import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { colors } from '@/theme';

export const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-2">
    <Feather name="chevron-left" size={20} color={colors.sky[500]} />
    <Text className="ml-1 text-body-md text-sky-500">Retour</Text>
  </TouchableOpacity>
);
