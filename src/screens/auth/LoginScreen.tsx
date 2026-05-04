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
import { useLogin } from '@/hooks/useAuth';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

type AuthParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<AuthParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useLogin();

  const handleLogin = () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    login.mutate(
      { email: email.trim(), password },
      {
        onError: () => {
          setError('Email ou mot de passe incorrect.');
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
            <Text className="mb-2 text-5xl">💜</Text>
            <Heading className="text-center text-heading-xl">Bon retour</Heading>
            <Body className="mt-2 text-center">Connectez-vous pour continuer.</Body>
          </View>

          {error ? (
            <View className="mb-4 rounded-input bg-rose-50 px-4 py-3">
              <Text className="text-center text-body-sm text-rose-400">{error}</Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">Email</Text>
            <TextInput
              className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="votre@email.com"
              placeholderTextColor="#9b93a8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-2">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">
              Mot de passe
            </Text>
            <TextInput
              className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="••••••••"
              placeholderTextColor="#9b93a8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="mb-6 self-end py-1"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text className="text-body-sm font-medium text-sky-600">
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-button bg-sky-300 px-6 py-4 shadow-soft"
            activeOpacity={0.7}
            onPress={handleLogin}
            disabled={login.isPending}
          >
            {login.isPending ? (
              <ActivityIndicator color="#542b94" />
            ) : (
              <Text className="text-body-md font-semibold text-sky-900">Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center py-2"
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-body-md text-text-secondary">
              Pas encore de compte ?{' '}
              <Text className="font-semibold text-sky-600">S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
