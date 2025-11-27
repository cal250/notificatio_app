import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, scheduleLocalNotification, sendPushNotification } from '../services/notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ModalScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Register for push notifications when the component mounts
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo push token:', token);
      }
    });

      // This listener is called when a notification is received while the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // This listener is called when a user taps on a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
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
  }, []);

  const handleLocalNotification = async () => {
    await scheduleLocalNotification(
      'Local Notification',
      'This is a local notification sent from your app!',
      { data: 'Local notification data' },
      1 // Show after 1 second
    );
    Alert.alert('Success', 'Local notification scheduled!');
  };

  const handlePushNotification = async () => {
    try {
      await sendPushNotification(
        'Push Notification',
        'This is a push notification sent to all devices!',
        { data: 'Push notification data' }
      );
      Alert.alert('Success', 'Push notification sent to all registered devices!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send push notification');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <Button
            title="Schedule Local Notification"
            onPress={handleLocalNotification}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Send Push Notification"
            onPress={handlePushNotification}
          />
        </View>

        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Your device token:</Text>
          <Text style={styles.token} numberOfLines={1} ellipsizeMode="tail">
            {expoPushToken || 'Loading...'}
          </Text>
        </View>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Go to home screen</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tokenContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  token: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666',
  },
  link: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
