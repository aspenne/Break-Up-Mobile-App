import { View, Text, Alert, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container, Heading, Body, Button, Card, Caption } from '@/components';
import { useMe, useLogout } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournal';
import { daysSince } from '@/utils/date';
import { colors } from '@/theme';

type ProfileParamList = {
  ProfileMain: undefined;
  Charter: undefined;
};

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<ProfileParamList>>();
  const { data: user } = useMe();
  const logout = useLogout();
  const { data: entries } = useJournalEntries(1, 100);

  const days = daysSince(user?.breakupDate ?? null);
  const entriesCount = entries?.data?.length ?? 0;

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between pb-6 pt-12">
          <Heading className="text-heading-xl">Mon profil</Heading>
          <Pressable
            onPress={() => (navigation as unknown as { navigate: (t: string) => void }).navigate('HomeTab')}
            hitSlop={8}
            accessibilityLabel="Retour à l'accueil"
            style={{ padding: 8 }}
          >
            <Feather name="x" size={24} color={colors.textMuted} />
          </Pressable>
        </View>

        <Card className="mb-6 items-center py-8">
          <Text className="mb-3 text-6xl">{user?.avatarEmoji ?? '😊'}</Text>
          <Heading className="mb-1">
            {user?.firstName ?? ''} {user?.lastName ?? ''}
          </Heading>
          <Body>{user?.email ?? ''}</Body>
        </Card>

        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-card border border-sky-200 bg-sky-50 px-3 py-4">
            <Text className="text-2xl">📅</Text>
            <Text className="mt-1 text-heading-md font-bold text-sky-700">
              {days ?? '—'}
            </Text>
            <Caption className="text-center text-text-muted">jours de chemin</Caption>
          </View>
          <View className="flex-1 items-center rounded-card border border-sage-200 bg-sage-50 px-3 py-4">
            <Text className="text-2xl">✍️</Text>
            <Text className="mt-1 text-heading-md font-bold text-sage-700">
              {entriesCount}
            </Text>
            <Caption className="text-center text-text-muted">entrées partagées</Caption>
          </View>
          <View className="flex-1 items-center rounded-card border border-cream-300 bg-cream-100 px-3 py-4">
            <Text className="text-2xl">🌱</Text>
            <Text className="mt-1 text-heading-md font-bold text-cream-500">
              {Math.max(1, Math.floor(entriesCount / 3))}
            </Text>
            <Caption className="text-center text-text-muted">étapes franchies</Caption>
          </View>
        </View>

        <Card className="mb-6 items-center bg-sky-50 py-6">
          <Text className="text-5xl">🌅</Text>
          <Body className="mt-3 text-center font-medium text-sky-700">
            « Chaque petit pas compte.{'\n'}Tu es exactement là où tu dois être. »
          </Body>
        </Card>

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

        <View className="mt-6">
          <Button
            title="Se déconnecter"
            variant="secondary"
            onPress={handleLogout}
            disabled={logout.isPending}
          />
        </View>
      </ScrollView>
    </Container>
  );
}
