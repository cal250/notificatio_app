import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from 'axios';

const API_URL = 'http://YOUR_SERVER_IP:3000'; // Replace with your server IP
let publicVapidKey = '';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get VAPID public key from server
async function getPublicVapidKey() {
  if (publicVapidKey) return publicVapidKey;
  
  try {
    const response = await axios.get(`${API_URL}/vapid-public-key`);
    publicVapidKey = response.data.publicKey;
    return publicVapidKey;
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    throw error;
  }
}

// Register for push notifications
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }
  
  try {
    // Get the push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Get the push subscription object
    const subscription = await Notifications.getDevicePushTokenAsync();
    
    // Get VAPID public key
    const vapidPublicKey = await getPublicVapidKey();
    
    // Register the subscription with our server
    await axios.post(`${API_URL}/subscribe`, {
      endpoint: subscription.data,
      keys: {
        p256dh: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHB24FLtzKWQVdvA',
        auth: 'FPns2mJUsUJHLxJXg7yPlA'
      }
    });
    
    console.log('Push subscription registered with server');
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

// Schedule a local notification
async function scheduleLocalNotification(title, body, data = {}, seconds = 1) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds },
  });
}

// Send a push notification to all registered devices
async function sendPushNotification(title, body, data = {}) {
  try {
    const response = await axios.post(`${API_URL}/send-notification`, {
      title,
      body,
      data,
    });
    console.log('Push notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
  sendPushNotification,
  getPublicVapidKey,
};
