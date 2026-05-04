import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme';

import HomeStack from './HomeStack';
import MemoriesStack from './MemoriesStack';
import ChatStack from './ChatStack';
import BlogStack from './BlogStack';
import JournalStack from './JournalStack';
import ProfileStack from './ProfileStack';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';

const TabNavigator = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: colors.sky[500],
    tabBarInactiveTintColor: colors.textMuted,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.borderLight,
      borderTopWidth: 1,
      paddingTop: 8,
      paddingBottom: 8,
      height: 88,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '500' as const,
      marginTop: 4,
    },
  },
  screens: {
    HomeTab: {
      screen: HomeStack,
      options: {
        title: 'Accueil',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="home" color={color} size={size} />
        ),
      },
    },
    MemoriesTab: {
      screen: MemoriesStack,
      options: {
        title: 'Souvenirs',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="image" color={color} size={size} />
        ),
      },
    },
    ChatTab: {
      screen: ChatStack,
      options: {
        title: 'Chat',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="message-circle" color={color} size={size} />
        ),
      },
    },
    BlogTab: {
      screen: BlogStack,
      options: {
        title: 'Blog',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="book-open" color={color} size={size} />
        ),
      },
    },
    JournalTab: {
      screen: JournalStack,
      options: {
        title: 'Journal',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="edit-3" color={color} size={size} />
        ),
      },
    },
    ProfileTab: {
      screen: ProfileStack,
      options: {
        title: 'Profil',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Feather name="user" color={color} size={size} />
        ),
      },
    },
  },
});

type AppParamList = StaticParamList<typeof TabNavigator>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends AppParamList {}
  }
}

export const AppNavigation = createStaticNavigation(TabNavigator);
export const AuthNavigation = createStaticNavigation(AuthStack);
export const OnboardingNavigation = createStaticNavigation(OnboardingStack);
