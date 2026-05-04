import { View, Text } from 'react-native';
import { colors } from '@/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
}

const SIZE_MAP = {
  sm: { circle: 36, emoji: 18, text: 14 },
  md: { circle: 64, emoji: 32, text: 22 },
  lg: { circle: 96, emoji: 48, text: 28 },
} as const;

export function Logo({ size = 'md', withWordmark = false }: LogoProps) {
  const s = SIZE_MAP[size];

  return (
    <View className="items-center">
      <View
        style={{
          width: s.circle,
          height: s.circle,
          borderRadius: s.circle / 2,
          backgroundColor: colors.sky[100],
          borderWidth: 2,
          borderColor: colors.sky[300],
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.sky[500],
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: s.emoji, lineHeight: s.emoji * 1.25 }}>🌊</Text>
      </View>
      {withWordmark && (
        <Text
          style={{
            marginTop: 10,
            fontSize: s.text,
            fontWeight: '700',
            letterSpacing: 0.5,
            color: colors.sky[700],
          }}
        >
          BreakUp
        </Text>
      )}
    </View>
  );
}
