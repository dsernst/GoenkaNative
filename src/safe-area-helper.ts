import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {setStatePayload} from './reducer';

function init(setState: (payload: setStatePayload) => void) {
  if (Platform.OS === 'ios') {
    if (DeviceInfo.hasNotch()) {
      // iPhone X or 11
      setState({
        safeAreaInsetBottom: 34,
        safeAreaInsetTop: 44,
      });
    } else {
      setState({
        safeAreaInsetTop: 18,
      });
    }
  }
}

export default {init};
