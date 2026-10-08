import { useEffect, useState } from 'react';

import {
  getFcmToken,
  requestNotificationPermission,
  subscribeToFcmTokenRefresh,
} from './fcm.service';

export const useFcm = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let tokenRefreshed = false;

    const unsubscribe = subscribeToFcmTokenRefresh(fcmToken => {
      tokenRefreshed = true;

      if (mounted) {
        setToken(fcmToken);
      }
    });

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        await requestNotificationPermission();

        const fcmToken = await getFcmToken();

        if (mounted && !tokenRefreshed) {
          setToken(fcmToken);
        }
      } catch (err) {
        console.error('FCM initialization failed:', err);

        if (mounted) {
          setError(
            'Unable to initialize push notifications.',
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    token,
    loading,
    error,
  };
};
