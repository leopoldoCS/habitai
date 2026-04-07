# Habitai

Habitai is an Expo + React Native MVP for **Your Week on One Screen**. The app helps users visualize their week as a simple time-block timeline, log events quickly, reuse templates, import calendar data, and get explainable weekly insights.

## MVP Features

- Weekly timeline with 7 stacked days
- Manual event creation, editing, and deletion
- Reusable templates for common routines
- ICS calendar import with conflict handling
- Rule-based insights for weekly patterns
- Profile dashboard with streaks and activity heatmap
- Weekly accountability check-ins
- Optional Firebase auth and cloud sync
- Guest/demo mode with seeded example data

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- AsyncStorage for local persistence
- Firebase Auth + Firestore for optional cloud sync

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

You can then open the app in:

- Expo Go
- Android emulator
- iOS simulator
- Web browser

## Firebase Setup

Firebase is optional. The app works in guest/demo mode without it.

If you want sign-in and sync:

1. Create a Firebase project.
2. Add a **Web app** in Firebase project settings.
3. Enable **Email/Password** under Authentication.
4. Create a Firestore database.
5. Add these values to a local `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. Restart Expo after editing `.env`:

```bash
npx expo start -c
```

## Project Structure

```text
app/                Expo Router screens
components/         Reusable UI building blocks
context/            Global app state provider
lib/date/           Week and date helper functions
lib/firebase/       Firebase auth and Firestore helpers
lib/import/         ICS calendar parsing
lib/rules/          Rule-based insight generation
lib/storage/        Local persistence and seed data
types/              Shared TypeScript models
```

## Useful Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Notes

- The app ships with seeded demo events so the timeline and insights are visible immediately.
- Firebase is lazily initialized, so missing credentials do not break guest mode.
- Calendar import currently focuses on ICS files for MVP scope.
