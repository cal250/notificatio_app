# Notification App with Expo and Firebase Cloud Messaging

This is a React Native application built with Expo that demonstrates how to implement both local and push notifications using Firebase Cloud Messaging (FCM).

## Features

- Local notifications
- Push notifications via Firebase Cloud Messaging
- Notification handling in both foreground and background
- Simple UI for testing notifications
- Backend server for sending push notifications

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (for FCM)
- Physical device or emulator for testing push notifications

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd notificatio_app
```

### 2. Install dependencies

```bash
npm install
cd server
npm install
cd ..
```

### 3. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Cloud Messaging
4. Download the `google-services.json` file and place it in the project root
5. Go to Project Settings > Service Accounts and generate a new private key
6. Save the private key as `server/serviceAccountKey.json`

### 4. Configure the App

1. Update `app.json` with your Firebase project details
2. Update the `API_URL` in `services/notifications.js` with your server's IP address

### 5. Start the development server

In one terminal, start the backend server:

```bash
cd server
node index.js
```

In another terminal, start the Expo app:

```bash
npx expo start
```

## Testing Notifications

1. **Local Notifications**: Tap the "Schedule Local Notification" button to schedule a local notification that will appear after 1 second.

2. **Push Notifications**: 
   - Tap the "Send Push Notification" button to send a test notification to all registered devices.
   - The app will automatically register the device token with the server when it starts.

## Project Structure

- `/app` - Main application code
- `/server` - Backend server for handling push notifications
- `/services` - Shared services (e.g., notification handling)
- `/assets` - Static assets (images, fonts, etc.)

## Important Notes

- For iOS, you'll need to set up push notification certificates in your Apple Developer account.
- For Android, ensure you've set up the correct package name and SHA-1/SHA-256 keys in Firebase.
- The app is configured to work in development mode. For production, you should:
  - Use a proper database to store device tokens
  - Implement user authentication
  - Set up proper error handling and logging

## Troubleshooting

- If you don't receive push notifications, check the following:
  - The device token is being registered correctly
  - The server is running and accessible
  - Firebase Cloud Messaging is properly configured
  - The app has the necessary permissions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
