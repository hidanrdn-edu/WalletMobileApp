import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { BillsProvider } from "@/context/bills-context";
import { AppThemeProvider } from "@/context/ThemeContext";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";


export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}

function RootLayoutContent() {
  const { success, error } = useMigrations(db, migrations);
  const theme = useTheme();

  if (error) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.stateTitle, { color: theme.colors.onSurface }]}>Database error</Text>
        <Text style={[styles.stateMessage, { color: theme.colors.onSurfaceVariant }]}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.stateTitle, { color: theme.colors.onSurface }]}>Preparing database</Text>
        <Text style={[styles.stateMessage, { color: theme.colors.onSurfaceVariant }]}>Running local migrations for Moneyfy.</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthReady } = useAuth();
  const theme = useTheme();

  if (!isAuthReady) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.stateTitle, { color: theme.colors.onSurface }]}>Loading session</Text>
        <Text style={[styles.stateMessage, { color: theme.colors.onSurfaceVariant }]}>Checking whether a user is already signed in.</Text>
      </View>
    );
  }

  return (
    <BillsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </BillsProvider>
  );
}

const styles = StyleSheet.create({
  stateScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
  },
  stateMessage: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});