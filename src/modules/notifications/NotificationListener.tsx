import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import {
  getInitialNotification,
  subscribeToForegroundMessages,
  subscribeToLocalNotificationOpened,
} from './fcm.service';
import type { NotificationPayload } from './notification.types';
import { consumePersistedNotificationTap } from './pendingNotification';

type Props = {
  onNotification: (payload: NotificationPayload) => void;
};

export const NotificationListener = ({
  onNotification,
}: Props) => {
  const onNotificationRef = useRef(onNotification);
  const readingPersistedTap = useRef(false);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    let active = true;
    const handleNotification = (payload: NotificationPayload) => {
      onNotificationRef.current(payload);
    };

    const unsubscribeForeground = subscribeToForegroundMessages();

    const unsubscribeLocalOpened =
      subscribeToLocalNotificationOpened(handleNotification);

    const consumePersistedTap = () => {
      if (readingPersistedTap.current) {
        return;
      }

      readingPersistedTap.current = true;
      consumePersistedNotificationTap()
        .then(payload => {
          if (active && payload) {
            handleNotification(payload);
          }
        })
        .catch(error => {
          if (active) {
            console.error(
              'Unable to read the stored notification tap:',
              error,
            );
          }
        })
        .finally(() => {
          readingPersistedTap.current = false;
        });
    };

    consumePersistedTap();

    const appStateSubscription = AppState.addEventListener(
      'change',
      state => {
        if (state === 'active') {
          consumePersistedTap();
        }
      },
    );

    getInitialNotification()
      .then(payload => {
        if (active && payload) {
          handleNotification(payload);
        }
      })
      .catch(error => {
        if (active) {
          console.error(
            'Unable to read the initial notification:',
            error,
          );
        }
      });

    return () => {
      active = false;
      unsubscribeForeground();
      unsubscribeLocalOpened();
      appStateSubscription.remove();
    };
  }, []);

  return null;
};
