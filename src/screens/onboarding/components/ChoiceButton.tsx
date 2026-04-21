import { Text, TouchableOpacity } from 'react-native';

interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  emoji?: string;
}

export function ChoiceButton({ label, selected, onPress, emoji }: ChoiceButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center rounded-button border px-5 py-3.5 ${
        selected
          ? 'border-lavender-400 bg-lavender-100'
          : 'border-lavender-200 bg-surface'
      }`}
    >
      {emoji ? <Text className="mr-2 text-xl">{emoji}</Text> : null}
      <Text
        className={`text-body-md ${
          selected ? 'font-semibold text-lavender-800' : 'text-text-secondary'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
