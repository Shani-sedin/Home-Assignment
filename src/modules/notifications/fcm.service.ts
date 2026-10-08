import { PermissionsAndroid, Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import {
  AuthorizationStatus,
  deleteToken,
  getInitialNotification as getInitialRemoteNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

import { NotificationPayload } from './notification.types';
import { setPendingNotification } from './pendingNotification';

const FOREGROUND_CHANNEL_ID = 'foreground-messages';

const mapRemoteMessage = (
  message: RemoteMessage,
): NotificationPayload => {
  return {
    title: message.notification?.title,
    body: message.notification?.body,
    deeplink:
      typeof message.data?.deeplink === 'string'
        ? message.data.deeplink
        : undefined,
    id:
      typeof message.data?.id === 'string'
        ? message.data.id
        : undefined,
  };
};

const mapLocalNotification = (
  notification: {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
  },
): NotificationPayload => ({
  title: notification.title,
  body: notification.body,
  deeplink:
    typeof notification.data?.deeplink === 'string'
      ? notification.data.deeplink
      : undefined,
  id:
    typeof notification.data?.id === 'string'
      ? notification.data.id
      : undefined,
});

const showForegroundNotification = async (
  payload: NotificationPayload,
) => {
  const channelId =
    Platform.OS === 'android'
      ? await notifee.createChannel({
          id: FOREGROUND_CHANNEL_ID,
          name: 'Notifications',
          importance: AndroidImportance.HIGH,
        })
      : undefined;

  await notifee.displayNotification({
    title: payload.title,
    body: payload.body,
    data: {
      deeplink: payload.deeplink ?? '',
      id: payload.id ?? '',
    },
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
};

export const subscribeToForegroundMessages = () => {
  return onMessage(getMessaging(), remoteMessage => {
    showForegroundNotification(mapRemoteMessage(remoteMessage)).catch(
      error => {
        console.error(
          'Unable to display the foreground notification:',
          error,
        );
      },
    );
  });
};

export const subscribeToLocalNotificationOpened = (
  callback: (payload: NotificationPayload) => void,
) => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification) {
      callback(mapLocalNotification(detail.notification));
    }
  });
};

export const subscribeToNotificationOpened = (
  callback: (payload: NotificationPayload) => void,
) => {
  return onNotificationOpenedApp(
    getMessaging(),
    remoteMessage => {
      if (remoteMessage) {
        callback(mapRemoteMessage(remoteMessage));
      }
    },
  );
};

let notificationOpenedListenerRegistered = false;

export const registerNotificationOpenedListener = () => {
  if (notificationOpenedListenerRegistered) {
    return;
  }

  notificationOpenedListenerRegistered = true;
  onNotificationOpenedApp(getMessaging(), remoteMessage => {
    setPendingNotification(mapRemoteMessage(remoteMessage));
  });
};

export const getInitialNotification =
  async (): Promise<NotificationPayload | null> => {
    const remoteMessage =
      await getInitialRemoteNotification(getMessaging());

    if (remoteMessage) {
      return mapRemoteMessage(remoteMessage);
    }

    const initialLocalNotification =
      await notifee.getInitialNotification();

    return initialLocalNotification
      ? mapLocalNotification(initialLocalNotification.notification)
      : null;
  };

export const requestNotificationPermission = async (): Promise<void> => {

  if (Platform.OS === 'android') {
    if (Platform.Version < 33) {
      return;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Notification permission was denied.');
    }

    return;
  }

  const authorizationStatus = await requestPermission(getMessaging());

  if (
    authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
    authorizationStatus !== AuthorizationStatus.PROVISIONAL
  ) {
    throw new Error('Notification permission was denied.');
  }
};

export const getFcmToken = async () => {
  const messaging = getMessaging();
  return getToken(messaging);
};

export const deleteFcmToken = async () => {
  const messaging = getMessaging();
  await deleteToken(messaging);
};

export const subscribeToFcmTokenRefresh = (
  onTokenRefreshListener: (token: string) => void,
) => onTokenRefresh(getMessaging(), onTokenRefreshListener);