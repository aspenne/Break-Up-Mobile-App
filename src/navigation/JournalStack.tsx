import { createStackNavigator } from '@react-navigation/stack';
import JournalScreen from '@/screens/journal/JournalScreen';
import JournalComposeEmotionScreen from '@/screens/journal/JournalComposeEmotionScreen';
import JournalComposePromptScreen from '@/screens/journal/JournalComposePromptScreen';
import JournalComposeContentScreen from '@/screens/journal/JournalComposeContentScreen';
import JournalEntryDetailScreen from '@/screens/journal/JournalEntryDetailScreen';
import JournalEntryEditScreen from '@/screens/journal/JournalEntryEditScreen';

const JournalStack = createStackNavigator({
  screens: {
    JournalMain: {
      screen: JournalScreen,
      options: { headerShown: false },
    },
    JournalComposeEmotion: {
      screen: JournalComposeEmotionScreen,
      options: { headerShown: false },
    },
    JournalComposePrompt: {
      screen: JournalComposePromptScreen,
      options: { headerShown: false },
    },
    JournalComposeContent: {
      screen: JournalComposeContentScreen,
      options: { headerShown: false },
    },
    JournalEntryDetail: {
      screen: JournalEntryDetailScreen,
      options: { headerShown: false },
    },
    JournalEntryEdit: {
      screen: JournalEntryEditScreen,
      options: { headerShown: false },
    },
  },
});

export default JournalStack;
