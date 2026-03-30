import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Appbar, Button, Modal, Portal, Surface, Text, useTheme } from "react-native-paper";

import { useBills } from "@/context/bills-context";

export default function AddBillSection() {
  const router = useRouter();
  const theme = useTheme();
  const { bills, addBill, isLoading } = useBills();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    if (isSubmitting) {
      return;
    }

    setVisible(false);
    setErrorMessage(null);
  };

  function resetForm() {
    setName("");
    setBalance("");
    setErrorMessage(null);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addBill({
        name,
        balance: Number(balance.replace(",", ".")) || 0,
      });

      hideModal();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create the account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <View style={styles.wrapper}>
      <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Accounts
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Add an account to unlock income and expense transactions.
            </Text>
          </View>
        </View>
        <Button
          icon="plus"
          mode="contained"
          onPress={showModal}
          loading={isSubmitting}
          disabled={isSubmitting || isLoading}
          style={styles.addButton}
        >
          Add
        </Button>
      </Surface>

      {isLoading ? (
        <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Loading accounts...
          </Text>
        </Surface>
      ) : bills.length === 0 ? (
        <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No accounts yet.
          </Text>
        </Surface>
      ) : (
        bills.map((bill) => (
          <Surface
            key={bill.id}
            style={[styles.accountCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Pressable
              style={styles.accountRow}
              onPress={() => router.push({ pathname: "/bills/[id]", params: { id: String(bill.id) } })}
            >
              <View style={styles.accountText}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {bill.name}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Open account details
                </Text>
              </View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {bill.balance.toFixed(2)}
              </Text>
            </Pressable>
          </Surface>
        ))
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.colors.background }]}
        >
          <Appbar.Header style={{ backgroundColor: theme.colors.background, paddingHorizontal: 0 }}>
            <Appbar.Content title="Add account" />
            <Appbar.Action icon="close" onPress={hideModal} disabled={isSubmitting} />
          </Appbar.Header>

          <View style={styles.modalSection}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
              Name
            </Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.outline }]}
              placeholder="Enter account name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.modalSection}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
              Initial balance
            </Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.outline }]}
              placeholder="Enter initial balance"
              keyboardType="decimal-pad"
              value={balance}
              onChangeText={setBalance}
            />
          </View>

          {errorMessage ? (
            <Text style={{ color: theme.colors.error }}>{errorMessage}</Text>
          ) : null}

          <Button mode="contained" onPress={() => void handleSubmit()} loading={isSubmitting}>
            Create account
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    gap: 12,
  },
  headerCard: {
    borderRadius: 16,
    padding: 16,
  },
  headerRow: {
    gap: 8,
  },
  addButton: {
    alignSelf: "flex-start",
    marginTop: 16,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 16,
  },
  accountCard: {
    borderRadius: 16,
    padding: 16,
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  accountText: {
    flex: 1,
    gap: 4,
  },
  contentContainer: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    gap: 16,
  },
  modalSection: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
});
