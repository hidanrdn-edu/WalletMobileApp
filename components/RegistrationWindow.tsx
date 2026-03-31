import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useAppColors } from "@/hooks/useAppColors";

type RegistrationWindowProps = {
  name: string;
  email: string;
  password: string;
  statusMessage: string;
  isSubmitting: boolean;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onSwitchToLogin: () => void;
};

export function RegistrationWindow({
  name,
  email,
  password,
  statusMessage,
  isSubmitting,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onSwitchToLogin,
}: RegistrationWindowProps) {
  const theme = useTheme();
  const appColors = useAppColors();

  return (
    <View style={[styles.card, { backgroundColor: appColors.authCard }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.colors.secondary }]}>Create account</Text>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Start your Moneyfy profile</Text>
        </View>
      </View>

      <InputField
        label="Name"
        placeholder="Jane Doe"
        value={name}
        onChangeText={onChangeName}
        autoCapitalize="words"
      />

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
        style={[styles.primaryButton, { backgroundColor: appColors.successButton }, isSubmitting && styles.buttonDisabled]}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : (
          <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>Create account</Text>
        )}
      </Pressable>

      <Text style={[styles.statusMessage, { color: theme.colors.onSurfaceVariant }]}>{statusMessage}</Text>

      <Pressable
        onPress={onSwitchToLogin}
        style={[styles.switchButton, { backgroundColor: theme.colors.secondaryContainer }]}
      >
          <Text style={[styles.switchButtonText, { color: theme.colors.onSecondaryContainer }]}>Login instead</Text>
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
  const theme = useTheme();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.outline}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            color: theme.colors.onSurface,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.surface,
          },
        ]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
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
  },
  title: {
    marginTop: 6,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  switchButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 15
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
  statusLabel: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statusMessage: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
});
