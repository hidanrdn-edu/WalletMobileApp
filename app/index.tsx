import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppColors } from "@/hooks/useAppColors";
import { LoginWindow } from "@/components/LoginWindow";
import { RegistrationWindow } from "@/components/RegistrationWindow";
import WelcomeCard from "@/components/WelcomeCard";
import { useAuth } from "@/providers/AuthProvider";
import { loginUser, registerUser } from "@/services/auth";

type AuthMode = "register" | "login";

export default function IndexScreen() {
  const theme = useTheme();
  const appColors = useAppColors();
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

  if (currentUser) {
    return <Redirect href={"/home" as any} />;
  }

  return (
    <LinearGradient colors={appColors.authGradient as [string, string, string]} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: theme.colors.backdrop + "22" }}
          >
            <WelcomeCard />

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