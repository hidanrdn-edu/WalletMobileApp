import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type LoginWindowProps = {
  email: string;
  password: string;
  statusMessage: string;
  isSubmitting: boolean;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onSwitchToRegister: () => void;
};

export function LoginWindow({
  email,
  password,
  statusMessage,
  isSubmitting,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onSwitchToRegister,
}: LoginWindowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Login to your Moneyfy account</Text>
        </View>
      </View>

      <InputField
        label="Email"
        placeholder="jane@example.com"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
      />

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Login</Text>
        )}
      </Pressable>

      <Text style={styles.statusMessage}>{statusMessage}</Text>

      <Pressable onPress={onSwitchToRegister} style={styles.switchButton}>
          <Text style={styles.switchButtonText}>Register instead</Text>
        </Pressable>
    </View>
  );
}

type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  secureTextEntry?: boolean;
};

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
}: InputFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#78938b"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#5b7a71",
  },
  title: {
    marginTop: 6,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#16312b",
  },
  switchButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e6f0ed",
    marginTop: 15
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#33554d",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#23463f",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d7e4df",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#16312b",
    backgroundColor: "#f7fbf9",
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f766e",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  statusLabel: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#5b7a71",
  },
  statusMessage: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#24433d",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
});
