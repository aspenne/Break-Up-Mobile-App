import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMe } from '@/hooks/useAuth';
import { colors } from '@/theme';

interface ProfileButtonProps {
  className?: string;
}

export function ProfileButton({ className }: ProfileButtonProps) {
  const navigation = useNavigation<{ navigate: (tab: string) => void }>();
  const { data: user } = useMe();

  return (
    <Pressable
      onPress={() => navigation.navigate('ProfileTab')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Mon profil"
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.sky[100],
        borderWidth: 1.5,
        borderColor: colors.sky[300],
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      <Text style={{ fontSize: 20, lineHeight: 24 }}>
        {user?.avatarEmoji ?? '😊'}
      </Text>
    </Pressable>
  );
}
