import notifee, { EventType } from '@notifee/react-native';

import { persistNotificationTap } from './pendingNotification';
import type { NotificationPayload } from './notification.types';

export const registerNotificationBackgroundHandler = () => {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type !== EventType.PRESS || !detail.notification) {
      return;
    }

    const data = detail.notification.data;
    const payload: NotificationPayload = {
      title: detail.notification.title,
      body: detail.notification.body,
      deeplink:
        typeof data?.deeplink === 'string'
          ? data.deeplink
          : undefined,
      id: typeof data?.id === 'string' ? data.id : undefined,
    };

    try {
      await persistNotificationTap(payload);
    } catch (error) {
      console.error(
        'Unable to persist the notification tap:',
        error,
      );
    }
  });
};
