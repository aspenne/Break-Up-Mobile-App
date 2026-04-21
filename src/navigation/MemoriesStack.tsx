import { createStackNavigator } from '@react-navigation/stack';
import MemoriesScreen from '@/screens/memories/MemoriesScreen';
import FaceSelectionScreen from '@/screens/memories/FaceSelectionScreen';
import PhotoSwipeScreen from '@/screens/memories/PhotoSwipeScreen';
import CleanupCompleteScreen from '@/screens/memories/CleanupCompleteScreen';
import DeletionProgressScreen from '@/screens/memories/DeletionProgressScreen';

const MemoriesStack = createStackNavigator({
  screens: {
    MemoriesMain: {
      screen: MemoriesScreen,
      options: {
        headerShown: false,
      },
    },
    FaceSelection: {
      screen: FaceSelectionScreen,
      options: {
        headerShown: false,
      },
    },
    PhotoSwipe: {
      screen: PhotoSwipeScreen,
      options: {
        headerShown: false,
        gestureEnabled: false,
      },
    },
    CleanupComplete: {
      screen: CleanupCompleteScreen,
      options: {
        headerShown: false,
        gestureEnabled: false,
      },
    },
    DeletionProgress: {
      screen: DeletionProgressScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default MemoriesStack;
