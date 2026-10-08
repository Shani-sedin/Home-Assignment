import { AppState } from 'react-native';
import {
  StackActions,
} from '@react-navigation/native';
import { navigationRef } from '../../navigation/navigationRef';

import { NotificationPayload } from './notification.types';
import {
  clearPendingNotification,
  getPendingNotification,
  setPendingNotification,
} from './pendingNotification';

const navigateToNotificationDetails = (
  payload: NotificationPayload,
) => {
  navigationRef.dispatch(
    StackActions.push('NotificationDetails', {
      notification: payload,
    }),
  );
};

let navigationScheduled = false;

export const navigateFromNotification = (
  payload: NotificationPayload,
) => {
  setPendingNotification(payload);
};

export const flushPendingNotification = (
  isAuthenticated: boolean,
) => {
  if (
    navigationScheduled ||
    !isAuthenticated ||
    !getPendingNotification() ||
    AppState.currentState !== 'active' ||
    !navigationRef.isReady() ||
    !navigationRef
      .getRootState()
      ?.routeNames.includes('NotificationDetails')
  ) {
    return;
  }

  navigationScheduled = true;
  setTimeout(() => {
    navigationScheduled = false;
    const pending = getPendingNotification();
    if (
      !isAuthenticated ||
      !pending ||
      AppState.currentState !== 'active' ||
      !navigationRef.isReady() ||
      !navigationRef
        .getRootState()
        ?.routeNames.includes('NotificationDetails')
    ) {
      return;
    }

    clearPendingNotification();
    navigateToNotificationDetails(pending);
  }, 0);
};
