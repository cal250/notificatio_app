import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Demo App</Text>
      <View style={styles.buttonContainer}>
        <Link href="/notifications" asChild>
          <Button title="Go to Notifications Demo" />
        </Link>
      </View>
      <Text style={styles.note}>
        Make sure to run this on a physical device for the best experience with push notifications.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  },
});
