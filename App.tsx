import './global.css';

import { DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import 'react-native-gesture-handler';

import { AppNavigation, AuthNavigation, OnboardingNavigation } from '@/navigation';
import { colors } from '@/theme';
import { useUserStore, useAppStore } from '@/stores';


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
    primary: colors.lavender[500],
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
