import { useBills } from "@/context/bills-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import { Appbar, Button, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddBillSection() {
  const router = useRouter();
  const { bills, addBill, refreshBills } = useBills();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [visible, setVisible] = useState(false);

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <Appbar.Header style={styles.pageHeader}>
          <Appbar.Action icon="arrow-left" onPress={() => router.push("/home" as any)} />
          <Appbar.Content title="Рахунки" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.text}>Рахунки</Text>
            <Button
              icon="plus"
              buttonColor="green"
              mode="contained"
              textColor="white"
              onPress={showModal}
            >
              Додати
            </Button>
          </View>

          {bills.map((bill) => (
            <View key={bill.id} style={styles.container}>
              <View style={styles.billContainer}>
                <View style={styles.billLeft}>
                  <Text style={styles.text}>{bill.name}</Text>
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
              <Text style={styles.billBalance}>{bill.balance} грн.</Text>
            </View>
          ))}
        </ScrollView>

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.contentContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Appbar.Header style={styles.modalHeader}>
                    <Appbar.Content title="Додати рахунок" color="black" />
                    <Appbar.Action icon="close" onPress={hideModal} color="black" />
                  </Appbar.Header>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text>Назва</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Введіть назву рахунку"
                        value={name}
                        onChangeText={setName}
                        returnKeyType="next"
                      />
                    </View>

                    <View style={[styles.modalSection, styles.balanceSection]}>
                      <Text>Початковий баланс</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Введіть початковий баланс"
                        keyboardType="numeric"
                        value={balance}
                        onChangeText={setBalance}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>

                    <Button
                      buttonColor="green"
                      mode="contained"
                      textColor="white"
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
    backgroundColor: "#e2e2e2",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#e2e2e2",
  },
  pageHeader: {
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  input: {
    borderColor: "#bfc5cc",
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "88%",
    alignSelf: "center",
  },
  modalHeader: {
    backgroundColor: "white",
    padding: 0,
    marginBottom: 12,
    height: 56,
  },
  container: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    marginTop: 20,
    backgroundColor: "white",
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