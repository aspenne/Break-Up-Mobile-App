import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ComposeHeaderProps {
  step: number;
  total: number;
  onClose?: () => void;
}

export function ComposeHeader({ step, total, onClose }: ComposeHeaderProps) {
  const navigation = useNavigation();
  const handleClose = () => {
    if (onClose) onClose();
    else navigation.getParent()?.goBack?.() ?? navigation.goBack();
  };

  return (
    <View className="mb-6 mt-2 flex-row items-center justify-between">
      <View className="flex-1 flex-row gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? 'bg-sky-400' : 'bg-sky-100'
            }`}
          />
        ))}
      </View>
      <TouchableOpacity onPress={handleClose} activeOpacity={0.7} className="ml-4">
        <Text className="text-body-sm font-medium text-text-muted">Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}
