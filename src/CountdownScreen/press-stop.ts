import {Animated} from 'react-native';

import {Props} from '../reducer';

export default ({
  history,
  latestTrack,
  setState,
  timeouts,
  titleOpacity,
}: Props) => {
  // Fade in title
  Animated.timing(titleOpacity, {
    toValue: 1,
    useNativeDriver: false,
  }).start();

  // Clear all of the timeouts
  timeouts.forEach(t => clearTimeout(t));
  setState({timeouts: []});

  // Stop audio
  if (latestTrack) {
    latestTrack.stop();
    setState({latestTrack: null});
  }

  // Go back to MainScreen
  setState({finished: false, screen: 'MainScreen'});

  // Turn on HistoryBtnTooltip if this was their first sit
  if (history.length === 1) {
    setTimeout(() => {
      setState({showHistoryBtnTooltip: true});
    }, 500);
  }
};
