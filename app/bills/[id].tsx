import { useBills } from "@/context/bills-context";
import { useAuth } from "@/providers/AuthProvider";
import { formatCurrencyValue, getUserCurrency } from "@/types/currency";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppColors } from "@/hooks/useAppColors";

export default function BillDetailsScreen() {
  const theme = useTheme();
  const appColors = useAppColors();
  const { currentUser } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBillById, updateBill, deleteBill } = useBills();
  const currencyCode = getUserCurrency(currentUser?.currency);

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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Рахунок не знайдено</Text>
          <Button mode="contained" buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} onPress={() => router.back()}>
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}> 
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.back, { color: theme.colors.onSurfaceVariant }]}>←</Text>
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Деталі рахунку</Text>

          <View style={styles.headerButtons}>
            <Button
              mode="contained"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Назад" : "Редагувати"}
            </Button>

            <Button mode="text" textColor={theme.colors.error} onPress={handleDelete}>
              Видалити
            </Button>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
          {isEditing ? (
            <>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Назва</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.outlineVariant,
                      backgroundColor: theme.colors.elevation.level1,
                      color: theme.colors.onSurface,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={theme.colors.outline}
                />
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Баланс</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.outlineVariant,
                      backgroundColor: theme.colors.elevation.level1,
                      color: theme.colors.onSurface,
                    },
                  ]}
                  value={balance}
                  onChangeText={setBalance}
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.outline}
                />
              </View>

              <Button mode="contained" buttonColor={appColors.successButton} textColor={theme.colors.onPrimary} onPress={handleSave}>
                Зберегти
              </Button>
            </>
          ) : (
            <>
              <View style={[styles.infoRow, { borderBottomColor: theme.colors.surfaceVariant }]}> 
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Назва</Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{bill.name}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: theme.colors.surfaceVariant }]}> 
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Баланс</Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}> 
                  {formatCurrencyValue(bill.balance, currencyCode)}
                </Text>
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
  },
  page: {
    flex: 1,
    padding: 16,
  },
  header: {
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
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  row: {
    gap: 8,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
});