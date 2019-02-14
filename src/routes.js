import { createStackNavigator } from 'react-navigation';

import CameraSurface from './Screens/CameraSurface';
import VideoPreview from './Screens/VideoPreview';

const Home = createStackNavigator(
  {
    CameraSurface,
    VideoPreview,
  },
  {
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
  }
);

export default Home;
