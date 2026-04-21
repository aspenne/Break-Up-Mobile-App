import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Container, Heading, Body } from '@/components';
import { useResetPassword } from '@/hooks/useAuth';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

type AuthParamList = {
  Login: undefined;
  ResetPassword: { email: string; code: string };
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<AuthParamList>>();
  const route = useRoute<RouteProp<AuthParamList, 'ResetPassword'>>();
  const { email, code } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const resetPassword = useResetPassword();

  const handleReset = () => {
    setError('');

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    resetPassword.mutate(
      { email, code, password },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            navigation.navigate('Login');
          }, 2000);
        },
        onError: () => {
          setError('Une erreur est survenue. Le code a peut-être expiré.');
        },
      }
    );
  };

  if (success) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-5xl">✨</Text>
          <Heading className="text-center text-heading-xl">C'est fait !</Heading>
          <Body className="mt-3 text-center">
            Ton mot de passe a été réinitialisé.{'\n'}Redirection vers la connexion...
          </Body>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-1 justify-center"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center">
            <Text className="mb-2 text-5xl">🔒</Text>
            <Heading className="text-center text-heading-xl">Nouveau mot de passe</Heading>
            <Body className="mt-2 text-center">
              Choisissez un nouveau mot de passe pour votre compte.
            </Body>
          </View>

          {error ? (
            <View className="mb-4 rounded-input bg-rose-50 px-4 py-3">
              <Text className="text-center text-body-sm text-rose-400">{error}</Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">
              Nouveau mot de passe
            </Text>
            <TextInput
              className="rounded-input border border-lavender-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="Minimum 8 caractères"
              placeholderTextColor="#9b93a8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="mb-6">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">
              Confirmer le mot de passe
            </Text>
            <TextInput
              className="rounded-input border border-lavender-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="Retapez votre mot de passe"
              placeholderTextColor="#9b93a8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="items-center rounded-button bg-lavender-300 px-6 py-4 shadow-soft"
            activeOpacity={0.7}
            onPress={handleReset}
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? (
              <ActivityIndicator color="#542b94" />
            ) : (
              <Text className="text-body-md font-semibold text-lavender-900">
                Réinitialiser
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center py-2"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-body-md text-text-secondary">
              Retour à la{' '}
              <Text className="font-semibold text-lavender-600">connexion</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
