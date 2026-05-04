import './global.css';

import { DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Text as RNText, View } from 'react-native';
import {
  useFonts,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';

import 'react-native-gesture-handler';

import { AppNavigation, AuthNavigation, OnboardingNavigation } from '@/navigation';
import { colors } from '@/theme';
import { useUserStore, useAppStore } from '@/stores';

// Police arrondie/apaisante par défaut pour tous les <Text>.
const RNTextAny = RNText as unknown as { defaultProps?: { style?: object } };
RNTextAny.defaultProps = RNTextAny.defaultProps ?? {};
RNTextAny.defaultProps.style = [
  { fontFamily: 'Quicksand_500Medium' },
  RNTextAny.defaultProps.style,
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
});

const BreakUpTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.sky[500],
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.borderLight,
    notification: colors.rose[300],
  },
};

export default function App() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const getNavigation = () => {
    if (!isAuthenticated) return <AuthNavigation theme={BreakUpTheme} />;
    if (!hasCompletedOnboarding) return <OnboardingNavigation theme={BreakUpTheme} />;
    return <AppNavigation theme={BreakUpTheme} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      {getNavigation()}
    </QueryClientProvider>
  );
}
