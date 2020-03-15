/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings([
    'Warning:', 'Setting', 'Possible', 'Require cycle', 'Setting a timer', 'Remote'
]);
AppRegistry.registerComponent(appName, () => App);

