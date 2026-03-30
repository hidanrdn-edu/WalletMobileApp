import { PaperProvider } from "react-native-paper";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { BillsProvider } from "@/context/bills-context";


export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={styles.stateScreen}>
        <Text style={styles.stateTitle}>Database error</Text>
        <Text style={styles.stateMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.stateScreen}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.stateTitle}>Preparing database</Text>
        <Text style={styles.stateMessage}>Running local migrations for Moneyfy.</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </PaperProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <View style={styles.stateScreen}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.stateTitle}>Loading session</Text>
        <Text style={styles.stateMessage}>Checking whether a user is already signed in.</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <BillsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BillsProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  stateScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f4fbf7",
  },
  stateTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#15322c",
  },
  stateMessage: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#49625a",
  },
});
