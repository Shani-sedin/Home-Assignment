import { createNavigationContainerRef } from '@react-navigation/native';

import type { NotificationPayload } from '../modules/notifications/notification.types';

export type RootStackParamList = {
  Login: undefined;
  DeveloperConsole: undefined;
  NotSupported: undefined;
  NotificationDetails:
    | { notification?: NotificationPayload }
    | undefined;
};

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();
