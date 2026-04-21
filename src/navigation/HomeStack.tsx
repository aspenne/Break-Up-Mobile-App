import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/home/HomeScreen';

const HomeStack = createStackNavigator({
  screens: {
    HomeMain: {
      screen: HomeScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default HomeStack;
