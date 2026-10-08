import React, { useCallback } from 'react';

import { AuthProvider } from './src/modules/auth/AuthContext';
import { NotificationListener } from './src/modules/notifications/NotificationListener';
import { navigateFromNotification } from './src/modules/notifications/notificationNavigation';
import type { NotificationPayload } from './src/modules/notifications/notification.types';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const handleNotification = useCallback(
    (payload: NotificationPayload) => {
      navigateFromNotification(payload);
    },
    [],
  );

  return (
    <>
      <NotificationListener onNotification={handleNotification} />
      <AppNavigator />
    </>
  );
};

export default App;
