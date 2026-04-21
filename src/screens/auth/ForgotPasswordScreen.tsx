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
import { useForgotPassword } from '@/hooks/useAuth';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

type AuthParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyResetCode: { email: string };
};

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp<AuthParamList>>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const forgotPassword = useForgotPassword();

  const handleSubmit = () => {
    setError('');

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    forgotPassword.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          navigation.navigate('VerifyResetCode', { email: email.trim() });
        },
        onError: () => {
          setError('Une erreur est survenue. Réessayez.');
        },
      }
    );
  };

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
            <Text className="mb-2 text-5xl">🔑</Text>
            <Heading className="text-center text-heading-xl">Mot de passe oublié</Heading>
            <Body className="mt-2 text-center">
              Entrez votre email, nous vous enverrons un code de réinitialisation.
            </Body>
          </View>

          {error ? (
            <View className="mb-4 rounded-input bg-rose-50 px-4 py-3">
              <Text className="text-center text-body-sm text-rose-400">{error}</Text>
            </View>
          ) : null}

          <View className="mb-6">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">Email</Text>
            <TextInput
              className="rounded-input border border-lavender-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="votre@email.com"
              placeholderTextColor="#9b93a8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className="items-center rounded-button bg-lavender-300 px-6 py-4 shadow-soft"
            activeOpacity={0.7}
            onPress={handleSubmit}
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? (
              <ActivityIndicator color="#542b94" />
            ) : (
              <Text className="text-body-md font-semibold text-lavender-900">
                Envoyer le code
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
