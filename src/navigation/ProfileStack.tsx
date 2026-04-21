import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import CharterScreen from '@/screens/profile/CharterScreen';

const ProfileStack = createStackNavigator({
  screens: {
    ProfileMain: {
      screen: ProfileScreen,
      options: {
        headerShown: false,
      },
    },
    Charter: {
      screen: CharterScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default ProfileStack;
