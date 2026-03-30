import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { LoginWindow } from "@/components/LoginWindow";
import { MainScreen } from "@/components/MainScreen";
import { RegistrationWindow } from "@/components/RegistrationWindow";
import { useAuth } from "@/providers/AuthProvider";
import { loginUser, logout, registerUser } from "@/services/auth";
import WelcomeCard from "@/components/WelcomeCard"
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            <WelcomeCard></WelcomeCard>

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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
});




