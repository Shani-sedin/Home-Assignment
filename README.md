# Push Notification Test App

A React Native app for sending and receiving Firebase Cloud Messaging test notifications.

Sign in with an enrolled developer account to send test pushes to the current device, view notification details, and test notification handling while the app is in the foreground, background, or closed.

# Test  User Accounts
1. developer-user => developer@test.com => Test@123
2. guest-user => guest@test.com => Guest@123

# React Native FCM Notification Test Console

React Native CLI + TypeScript assignment demonstrating Firebase
Authentication, Remote Config role-based access, FCM notifications,
deep linking, and expired-session notification handling.

## Tech Stack

- React Native CLI
- TypeScript
- Firebase Authentication
- Firebase Remote Config
- Firebase Cloud Messaging
- React Navigation
- Android

## Setup

```bash
npm install
cd android
./gradlew clean
cd ..
npx react-native run-android