import 'expo-router/entry';
import * as Notifications from 'expo-notifications';

// Configure notification handler for the entire app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationCategoryAsync('default', [
  {
    identifier: 'default',
    buttonTitle: 'OK',
    options: {
      opensAppToForeground: true,
    },
  },
]);
