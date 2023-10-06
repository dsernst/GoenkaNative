/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Persistence from './src/Persistence';

AppRegistry.registerComponent(appName, () => Persistence);
