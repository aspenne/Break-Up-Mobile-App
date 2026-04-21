import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className = '', ...props }: ContainerProps) => (
  <SafeAreaView className="flex-1 bg-background" {...props}>
    <View className={`flex-1 px-6 ${className}`}>{children}</View>
  </SafeAreaView>
);
