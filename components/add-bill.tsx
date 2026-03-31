import { useBills } from "@/context/bills-context";
import { useAuth } from "@/providers/AuthProvider";
import { formatCurrencyValue, getUserCurrency } from "@/types/currency";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Appbar, Button, Modal, Portal, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppColors } from "@/hooks/useAppColors";

export default function AddBillSection() {
  const router = useRouter();
  const theme = useTheme();
  const appColors = useAppColors();
  const { currentUser } = useAuth();
  const { bills, addBill, refreshBills } = useBills();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [visible, setVisible] = useState(false);
  const currencyCode = getUserCurrency(currentUser?.currency);
  const balancePlaceholder = useMemo(
    () => `Введіть початковий баланс (${currencyCode})`,
    [currencyCode],
  );

  const showModal = () => setVisible(true);
  const hideModal = () => {
    Keyboard.dismiss();
    setVisible(false);
  };

  function resetForm() {
    setName("");
    setBalance("");
  }

  async function handleSubmit() {
    await addBill({
      name,
      balance: parseFloat(balance) || 0,
    });

    hideModal();
    resetForm();
  }

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      void refreshBills();
      return undefined;
    }, [refreshBills]),
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header style={[styles.pageHeader, { backgroundColor: theme.colors.background }]}>
          <Appbar.Action icon="arrow-left" onPress={() => router.push("/home" as any)} />
          <Appbar.Content title="Рахунки" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.text, { color: theme.colors.onSurface }]}>Рахунки</Text>
            <Button
              icon="plus"
              buttonColor={theme.colors.primary}
              mode="contained"
              textColor={theme.colors.onPrimary}
              onPress={showModal}
            >
              Додати
            </Button>
          </View>

          {bills.map((bill) => (
            <View key={bill.id} style={[styles.container, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.billContainer}>
                <View style={styles.billLeft}>
                  <Text style={[styles.text, { color: theme.colors.onSurface }]}>{bill.name}</Text>
                </View>
                <Button
                  mode="text"
                  onPress={() =>
                    router.push({
                      pathname: "/bills/[id]",
                      params: { id: String(bill.id) },
                    })
                  }
                >
                  Детальніше
                </Button>
              </View>
              <Text style={[styles.billBalance, { color: theme.colors.onSurfaceVariant }]}>
                {formatCurrencyValue(bill.balance, currencyCode)}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.colors.surface }]}
          >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Appbar.Header style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
                    <Appbar.Content title="Додати рахунок" color={theme.colors.onSurface} />
                    <Appbar.Action icon="close" onPress={hideModal} color={theme.colors.onSurface} />
                  </Appbar.Header>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text style={{ color: theme.colors.onSurface }}>Назва</Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: theme.colors.onSurface,
                            borderColor: theme.colors.outlineVariant,
                            backgroundColor: theme.colors.elevation.level1,
                          },
                        ]}
                        placeholder="Введіть назву рахунку"
                        placeholderTextColor={theme.colors.outline}
                        value={name}
                        onChangeText={setName}
                        returnKeyType="next"
                      />
                    </View>

                    <View style={[styles.modalSection, styles.balanceSection]}>
                      <Text style={{ color: theme.colors.onSurface }}>Початковий баланс</Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            color: theme.colors.onSurface,
                            borderColor: theme.colors.outlineVariant,
                            backgroundColor: theme.colors.elevation.level1,
                          },
                        ]}
                        placeholder={balancePlaceholder}
                        placeholderTextColor={theme.colors.outline}
                        keyboardType="numeric"
                        value={balance}
                        onChangeText={setBalance}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>

                    <Button
                      buttonColor={appColors.successButton}
                      mode="contained"
                      textColor={theme.colors.onPrimary}
                      onPress={handleSubmit}
                    >
                      Створити рахунок
                    </Button>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  pageHeader: {},
  scrollContent: {
    paddingBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 15,
  },
  modalBody: {
    gap: 8,
  },
  modalSection: {
    gap: 10,
  },
  balanceSection: {
    marginBottom: 8,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 10,
    width: "88%",
    alignSelf: "center",
  },
  modalHeader: {
    padding: 0,
    marginBottom: 12,
    height: 56,
  },
  container: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    gap: 12,
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
  },
  billContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billLeft: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  billBalance: {
    fontSize: 18,
    fontWeight: "600",
  },
});