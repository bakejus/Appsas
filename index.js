/**
 * @format
 */
import 'react-native-polyfill-globals/auto';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import {AppRegistry} from 'react-native';
import App from './src/route/App';
registerRootComponent(App);
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

