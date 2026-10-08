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


npm install
cd android
./gradlew clean
cd ..
npx react-native run-android

```

## Known Limitations and Next Steps

- Push sending belongs on a trusted server. The current assignment flow obtains Google OAuth credentials in the mobile app to send FCM messages. A production version should move this to an authenticated backend or Firebase Cloud Function, keep service-account keys out of the app bundle, and enforce authorization and rate limits on the server.
- Notification behavior needs broader device coverage. FCM and local-notification behavior can differ by OS version and app state. With more time, I would exercise a repeatable device matrix for foreground, background, terminated, signed-in, and signed-out cases on both Android and iOS.
- Automated coverage is limited. I would add focused tests for notification payload mapping, queued tap handling, login handoff, and access checks, plus integration tests for the main notification flows.
- Remote Config failures need a deliberate product policy. Network errors or malformed configuration can affect developer-role resolution. I would define safe fallback behavior, add observable diagnostics, and test cached/offline operation.
- Improve delivery feedback and accessibility. I would add clearer permission-denied/retry guidance and verify screen-reader labels, contrast, and small-screen layouts.bash
