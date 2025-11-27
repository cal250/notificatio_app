import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure how notifications are handled when the app is in the foreground
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export default function NotificationScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Request notification permissions
      registerForPushNotificationsAsync().then(token => {
        if (token) setExpoPushToken(token);
      });

      // Listen for incoming notifications when the app is in the foreground
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      // Listen for notification responses (user taps on notification)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
      });

      // Clean up listeners on unmount
      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, []);

  // Request notification permissions
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert('Failed to get push token for push notification!');
          return null;
        }

        // Get the token that uniquely identifies this device
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push Token:', token);
        return token;
      } else {
        Alert.alert('Must use a physical device for Push Notifications');
        return null;
      }
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Schedule a local notification
  async function scheduleLocalNotification() {
    if (Platform.OS === 'web') {
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Local Notification', {
          body: 'This is a local notification!',
          icon: 'https://expo.dev/favicon.ico',
        });
      } else {
        Alert.alert('Please enable notifications in your browser settings');
      }
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Local Notification 📬',
          body: 'This is a local notification!',
          data: { data: 'goes here' },
          sound: true,
        },
        trigger: { seconds: 1 },
      });
      Alert.alert('Notification scheduled!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  }

  // Request permission to send push notifications
  async function requestPushNotificationPermission() {
    if (Platform.OS === 'web') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          Alert.alert('Permission granted!', 'You will receive notifications on this device.');
        } else {
          Alert.alert('Permission denied', 'You need to allow notifications to receive them.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        Alert.alert('Error', 'Failed to request notification permission');
      }
      return;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to receive push notifications was denied');
      } else {
        Alert.alert('Permission granted!', 'You will receive notifications on this device.');
        // Get the token after permission is granted
        const token = await registerForPushNotificationsAsync();
        if (token) setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to request notification permission');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Demo</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={
            Platform.OS === 'web' 
              ? 'Request Browser Notification Permission'
              : 'Request Notification Permission'
          }
          onPress={requestPushNotificationPermission}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={
            Platform.OS === 'web'
              ? 'Show Browser Notification'
              : 'Send Local Notification'
          }
          onPress={scheduleLocalNotification}
        />
      </View>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Your device token:</Text>
          <Text style={styles.token} selectable>{expoPushToken}</Text>
        </View>
      ) : null}
      
      <Text style={styles.note}>
        {Platform.OS === 'web' 
          ? 'Note: Browser notifications will only work if you have granted permission.'
          : 'Note: For push notifications, you\'ll need to set up a backend service. The local notification should work immediately after granting permission.'
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  note: {
    marginTop: 30,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  tokenContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  tokenLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  token: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#333',
    overflow: 'hidden',
  },
});
