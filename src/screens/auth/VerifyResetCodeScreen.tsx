import { useRef, useState } from 'react';
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
import { useVerifyResetCode, useForgotPassword } from '@/hooks/useAuth';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

type AuthParamList = {
  Login: undefined;
  VerifyResetCode: { email: string };
  ResetPassword: { email: string; code: string };
};

export default function VerifyResetCodeScreen() {
  const navigation = useNavigation<NavigationProp<AuthParamList>>();
  const route = useRoute<RouteProp<AuthParamList, 'VerifyResetCode'>>();
  const { email } = route.params;

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const verifyCode = useVerifyResetCode();
  const resend = useForgotPassword();

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        const newDigits = pasted.split('');
        setDigits(newDigits);
        inputRefs.current[5]?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setError('');
    const code = digits.join('');

    if (code.length !== 6) {
      setError('Veuillez entrer le code complet.');
      return;
    }

    verifyCode.mutate(
      { email, code },
      {
        onSuccess: () => {
          navigation.navigate('ResetPassword', { email, code });
        },
        onError: () => {
          setError('Code invalide ou expiré.');
          setDigits(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;

    resend.mutate(
      { email },
      {
        onSuccess: () => {
          setResendCooldown(60);
          const interval = setInterval(() => {
            setResendCooldown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
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
            <Text className="mb-2 text-5xl">📬</Text>
            <Heading className="text-center text-heading-xl">Vérification</Heading>
            <Body className="mt-2 text-center">
              Entrez le code à 6 chiffres envoyé à{'\n'}
              <Text className="font-semibold text-sky-600">{email}</Text>
            </Body>
          </View>

          {error ? (
            <View className="mb-4 rounded-input bg-rose-50 px-4 py-3">
              <Text className="text-center text-body-sm text-rose-400">{error}</Text>
            </View>
          ) : null}

          <View className="mb-8 flex-row justify-center gap-3">
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                className="h-14 w-12 rounded-input border border-sky-200 bg-surface text-center text-xl font-bold text-text-primary"
                value={digit}
                onChangeText={(value) => handleDigitChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            className="items-center rounded-button bg-sky-300 px-6 py-4 shadow-soft"
            activeOpacity={0.7}
            onPress={handleVerify}
            disabled={verifyCode.isPending}
          >
            {verifyCode.isPending ? (
              <ActivityIndicator color="#542b94" />
            ) : (
              <Text className="text-body-md font-semibold text-sky-900">Vérifier</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center py-2"
            onPress={handleResend}
            disabled={resendCooldown > 0 || resend.isPending}
          >
            <Text className="text-body-md text-text-secondary">
              {resendCooldown > 0
                ? `Renvoyer le code (${resendCooldown}s)`
                : 'Renvoyer le code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-2 items-center py-2"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-body-sm text-text-secondary">
              Retour à la{' '}
              <Text className="font-semibold text-sky-600">connexion</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
