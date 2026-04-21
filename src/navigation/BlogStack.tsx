import { createStackNavigator } from '@react-navigation/stack';
import BlogScreen from '@/screens/blog/BlogScreen';
import BlogArticleScreen from '@/screens/blog/BlogArticleScreen';

const BlogStack = createStackNavigator({
  screens: {
    BlogList: {
      screen: BlogScreen,
      options: { headerShown: false },
    },
    BlogArticle: {
      screen: BlogArticleScreen,
      options: { headerShown: false },
    },
  },
});

export default BlogStack;
