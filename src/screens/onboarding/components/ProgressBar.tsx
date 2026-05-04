import { View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <View className="h-1.5 w-full rounded-full bg-sky-100">
      <View
        className="h-1.5 rounded-full bg-sky-400"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
}
