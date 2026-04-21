import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@/screens/chat/ChatScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';

const ChatStack = createStackNavigator({
  screens: {
    ChatRooms: {
      screen: ChatScreen,
      options: {
        headerShown: false,
      },
    },
    ChatRoom: {
      screen: ChatRoomScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default ChatStack;
