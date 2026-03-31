# WalletMobileApp

## Overview

The app provides:

- Authentication (register, login, session restore).
- Account (wallet/bill) management.
- Income and expense transactions with category selection.
- Dashboard with balance summary and category pie charts.
- Light/Dark theme toggle.
- Local-first database using SQLite with Drizzle ORM migrations.

## Main Features

- Account CRUD:
	- Create account with initial balance.
	- Edit account name and balance.
	- Delete account.
- Transaction creation:
	- Add income.
	- Add expense (with balance validation).
	- Assign transactions to accounts and categories.
- Home dashboard:
	- Total balance.
	- Total income and expenses.
	- Expense pie chart by category.
	- Income pie chart by category.
- Fixed bottom quick-action buttons for creating income/expense records.

## Tech Stack

- Framework: Expo, React Native, Expo Router.
- Language: TypeScript.
- UI: React Native Paper, react-native-dropdown-picker.
- Charts: react-native-gifted-charts.
- Database: expo-sqlite + Drizzle ORM.
- Auth/Security: bcryptjs, expo-secure-store.
- Navigation: React Navigation (via Expo Router).

## Project Structure

- `app/` - Route-based screens (Expo Router).
- `components/` - Reusable UI components and main screen sections.
- `services/` - Business logic and DB operations (auth, accounts, categories, transactions).
- `db/` - DB client and schema.
- `drizzle/` - SQL migrations and migration journal.
- `context/`, `providers/`, `hooks/` - App state, providers, shared hooks.

## How to Download

### 1) Clone the repository

```bash
git clone https://github.com/hidanrdn-edu/WalletMobileApp.git
cd WalletMobileApp
```

### 2) Install dependencies

```bash
npm install
```

## Running the App

Start the Expo development server:

```bash
npm run start
```

Run directly for a platform:

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

- `npm run start` - Start Expo dev server.
- `npm run android` - Open app on Android.
- `npm run ios` - Open app on iOS.
- `npm run web` - Run web target.
- `npm run lint` - Run ESLint.
- `npm run reset-project` - Execute project reset script.

## Requirements

- Node.js 18+ recommended.
- npm 9+ recommended.
- Expo Go app (or Android/iOS emulator) for mobile testing.