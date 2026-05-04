import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container, Heading, Body, Button, Card, Caption } from '@/components';
import { useMe, useLogout } from '@/hooks/useAuth';
import { colors } from '@/theme';

type ProfileParamList = {
  ProfileMain: undefined;
  Charter: undefined;
};

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<ProfileParamList>>();
  const { data: user } = useMe();
  const logout = useLogout();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr(e) de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => logout.mutate(),
      },
    ]);
  };

  return (
    <Container>
      <View className="pb-6 pt-12">
        <Heading className="text-heading-xl">Mon profil</Heading>
      </View>

      <Card className="mb-6 items-center py-8">
        <Text className="mb-3 text-6xl">{user?.avatarEmoji ?? '😊'}</Text>
        <Heading className="mb-1">
          {user?.firstName ?? ''} {user?.lastName ?? ''}
        </Heading>
        <Body>{user?.email ?? ''}</Body>
      </Card>

      {/* Settings */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Charter')}
        activeOpacity={0.7}
        className="mb-3 flex-row items-center justify-between rounded-card border border-sky-100 bg-surface px-5 py-4"
      >
        <View className="flex-row items-center">
          <Feather name="heart" size={18} color={colors.sky[500]} />
          <Body className="ml-3 font-medium">Charte de bienveillance</Body>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <View className="mt-auto pb-8">
        <Button
          title="Se déconnecter"
          variant="secondary"
          onPress={handleLogout}
          disabled={logout.isPending}
        />
      </View>
    </Container>
  );
}
