import { createStackNavigator } from '@react-navigation/stack';
import OnboardingQuestionnaireScreen from '@/screens/onboarding/OnboardingQuestionnaireScreen';

const OnboardingStack = createStackNavigator({
  screens: {
    OnboardingQuestionnaire: {
      screen: OnboardingQuestionnaireScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default OnboardingStack;
