import { useBills } from "@/context/bills-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BillDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBillById, updateBill, deleteBill } = useBills();

  const billId = Number(id);
  const bill = useMemo(() => getBillById(billId), [billId, getBillById]);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setBalance(String(bill.balance));
    }
  }, [bill]);

  if (!bill) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <Text style={styles.title}>Рахунок не знайдено</Text>
          <Button mode="contained" onPress={() => router.back()}>
            Назад
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  async function handleSave() {
    if (!bill) return;
  
    await updateBill(billId, {
      name: name.trim() || bill.name,
      balance: Number.parseFloat(balance) || 0,
    });
  
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteBill(billId);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Деталі рахунку</Text>

          <View style={styles.headerButtons}>
            <Button
              mode="contained"
              buttonColor="#0077ff"
              textColor="white"
              onPress={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Назад" : "Редагувати"}
            </Button>

            <Button mode="text" textColor="#d32f2f" onPress={handleDelete}>
              Видалити
            </Button>
          </View>
        </View>

        <View style={styles.card}>
          {isEditing ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Назва</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Баланс</Text>
                <TextInput
                  style={styles.input}
                  value={balance}
                  onChangeText={setBalance}
                  keyboardType="numeric"
                />
              </View>

              <Button mode="contained" buttonColor="green" textColor="white" onPress={handleSave}>
                Зберегти
              </Button>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Назва</Text>
                <Text style={styles.infoValue}>{bill.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Баланс</Text>
                <Text style={styles.infoValue}>{bill.balance}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  page: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  back: {
    fontSize: 28,
    color: "#6b7280",
    width: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 14,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eceff1",
    gap: 6,
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 16,
  },
  infoValue: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "600",
  },
  row: {
    gap: 8,
  },
  label: {
    color: "#6b7280",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
});