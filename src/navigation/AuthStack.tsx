import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import VerifyResetCodeScreen from '@/screens/auth/VerifyResetCodeScreen';
import ResetPasswordScreen from '@/screens/auth/ResetPasswordScreen';

const AuthStack = createStackNavigator({
  screens: {
    Login: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    Register: {
      screen: RegisterScreen,
      options: {
        headerShown: false,
      },
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      options: {
        headerShown: false,
      },
    },
    VerifyResetCode: {
      screen: VerifyResetCodeScreen,
      options: {
        headerShown: false,
      },
    },
    ResetPassword: {
      screen: ResetPasswordScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default AuthStack;
