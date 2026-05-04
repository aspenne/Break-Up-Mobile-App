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
import { useRegister } from '@/hooks/useAuth';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

type AuthParamList = {
  Login: undefined;
  Register: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<AuthParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const register = useRegister();

  const handleRegister = () => {
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
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

    register.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      },
      {
        onError: () => {
          setError('Une erreur est survenue. Vérifiez vos informations.');
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
          contentContainerClassName="py-12"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8 items-center">
            <Text className="mb-2 text-5xl">🌱</Text>
            <Heading className="text-center text-heading-xl">Nouveau départ</Heading>
            <Body className="mt-2 text-center">Créez votre compte pour commencer.</Body>
          </View>

          {error ? (
            <View className="mb-4 rounded-input bg-rose-50 px-4 py-3">
              <Text className="text-center text-body-sm text-rose-400">{error}</Text>
            </View>
          ) : null}

          <View className="mb-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-body-sm font-medium text-text-secondary">Prénom</Text>
              <TextInput
                className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
                placeholder="Prénom"
                placeholderTextColor="#9b93a8"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-body-sm font-medium text-text-secondary">Nom</Text>
              <TextInput
                className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
                placeholder="Nom"
                placeholderTextColor="#9b93a8"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

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

          <View className="mb-4">
            <Text className="mb-1 text-body-sm font-medium text-text-secondary">
              Mot de passe
            </Text>
            <TextInput
              className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
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
              className="rounded-input border border-sky-200 bg-surface px-4 py-3.5 text-body-md text-text-primary"
              placeholder="Retapez votre mot de passe"
              placeholderTextColor="#9b93a8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="items-center rounded-button bg-sky-300 px-6 py-4 shadow-soft"
            activeOpacity={0.7}
            onPress={handleRegister}
            disabled={register.isPending}
          >
            {register.isPending ? (
              <ActivityIndicator color="#542b94" />
            ) : (
              <Text className="text-body-md font-semibold text-sky-900">Créer mon compte</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center py-2"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-body-md text-text-secondary">
              Déjà un compte ?{' '}
              <Text className="font-semibold text-sky-600">Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
