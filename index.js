/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { registerNotificationBackgroundHandler } from './src/modules/notifications/notificationBackground';
import { registerNotificationOpenedListener } from './src/modules/notifications/fcm.service';
import App from './App';
import { name as appName } from './app.json';

registerNotificationBackgroundHandler();
registerNotificationOpenedListener();

AppRegistry.registerComponent(appName, () => App);
