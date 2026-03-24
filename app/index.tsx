import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { LoginWindow } from "@/components/LoginWindow";
import { MainScreen } from "@/components/MainScreen";
import { RegistrationWindow } from "@/components/RegistrationWindow";
import { useAuth } from "@/providers/AuthProvider";
import { loginUser, logout, registerUser } from "@/services/auth";

type AuthMode = "register" | "login";

export default function IndexScreen() {
  const { currentUser, setCurrentUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("Create an account or login to continue.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setIsSubmitting(true);

    try {
      const user = await registerUser(name, email, password);
      setCurrentUser(user);
      setName("");
      setPassword("");
      setStatusMessage(`Registered ${user.email} successfully.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogin() {
    setIsSubmitting(true);

    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      setPassword("");
      setStatusMessage(`Logged in as ${user.email}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await logout();
      setCurrentUser(null);
      setPassword("");
      setStatusMessage("Logged out successfully.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Logout failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (currentUser) {
    return (
      <MainScreen
        user={currentUser}
        onLogout={() => void handleLogout()}
      />
    );
  }

  return (
    <LinearGradient colors={["#16a34a", "#22c55e", "#86efac"]} style={styles.background}>
      <View style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>Moneyfy</Text>
              <Text style={styles.title}>Sign up or log in to enter your wallet app.</Text>
              <Text style={styles.subtitle}>
                Take control of your money. Track, spend, and save smarter with MONEYFY!
              </Text>
            </View>

            {mode === "register" ? (
              <RegistrationWindow
                name={name}
                email={email}
                password={password}
                statusMessage={statusMessage}
                isSubmitting={isSubmitting}
                onChangeName={setName}
                onChangeEmail={setEmail}
                onChangePassword={setPassword}
                onSubmit={() => void handleRegister()}
                onSwitchToLogin={() => {
                  setMode("login");
                  setStatusMessage("Enter your email and password to login.");
                }}
              />
            ) : (
              <LoginWindow
                email={email}
                password={password}
                statusMessage={statusMessage}
                isSubmitting={isSubmitting}
                onChangeEmail={setEmail}
                onChangePassword={setPassword}
                onSubmit={() => void handleLogin()}
                onSwitchToRegister={() => {
                  setMode("register");
                  setStatusMessage("Create an account or login to continue.");
                }}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "rgba(16, 42, 36, 0.92)",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#8ff0c9",
  },
  title: {
    marginTop: 12,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: "#f9fffc",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#cfe7dd",
  },
});
