import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Home',
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{
            title: 'Notifications',
            headerShown: true,
          }} 
        />
      </Stack>
    </View>
  );
}