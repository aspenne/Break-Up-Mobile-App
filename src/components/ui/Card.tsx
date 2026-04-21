import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <View className={`bg-surface rounded-card shadow-card p-4 ${className}`} {...props}>
    {children}
  </View>
);
