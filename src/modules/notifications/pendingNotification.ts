import AsyncStorage from '@react-native-async-storage/async-storage';

import { NotificationPayload } from './notification.types';

let pendingNotification: NotificationPayload | null = null;
const PERSISTED_NOTIFICATION_KEY = 'pending_notification_tap';
const pendingNotificationListeners = new Set<() => void>();

export const setPendingNotification = (
  payload: NotificationPayload,
) => {
  pendingNotification = payload;
  pendingNotificationListeners.forEach(listener => listener());
};

export const getPendingNotification = () => {
  return pendingNotification;
};

export const subscribeToPendingNotification = (
  listener: () => void,
) => {
  pendingNotificationListeners.add(listener);
  return () => {
    pendingNotificationListeners.delete(listener);
  };
};

export const clearPendingNotification = () => {
  pendingNotification = null;
};

export const persistNotificationTap = async (
  payload: NotificationPayload,
) => {
  await AsyncStorage.setItem(
    PERSISTED_NOTIFICATION_KEY,
    JSON.stringify(payload),
  );
};

export const consumePersistedNotificationTap =
  async (): Promise<NotificationPayload | null> => {
    const value = await AsyncStorage.getItem(
      PERSISTED_NOTIFICATION_KEY,
    );

    if (value === null) {
      return null;
    }

    await AsyncStorage.removeItem(PERSISTED_NOTIFICATION_KEY);

    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error('Stored notification tap has an invalid format.');
    }

    const payload = parsed as Record<string, unknown>;
    return {
      title: typeof payload.title === 'string' ? payload.title : undefined,
      body: typeof payload.body === 'string' ? payload.body : undefined,
      deeplink:
        typeof payload.deeplink === 'string'
          ? payload.deeplink
          : undefined,
      id: typeof payload.id === 'string' ? payload.id : undefined,
    };
  };