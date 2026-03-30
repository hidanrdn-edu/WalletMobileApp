import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Appbar, Button, TextInput, useTheme } from 'react-native-paper';

import { useAppColors } from '../hooks/useAppColors';

import { and, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { accounts, categories, transactions } from '../db/schema';

export default function AddIncomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const colors = useAppColors();
  const currentUserId = 1; 
  const [amount, setAmount] = useState('');
  const [openAccount, setOpenAccount] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountItems, setAccountItems] = useState<{label: string, value: number}[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{label: string, value: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAccounts = await db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, currentUserId));
        
        setAccountItems(fetchedAccounts.map(acc => ({
          label: acc.name, 
          value: acc.id 
        })));

        const fetchedCategories = await db
          .select()
          .from(categories)
          .where(
            and(
              eq(categories.userId, currentUserId),
              eq(categories.type, 'income') 
            )
          );
          
        setCategoryItems(fetchedCategories.map(cat => ({
          label: cat.name, 
          value: cat.id 
        })));

      } catch (error) {
        console.error("Помилка завантаження рахунків/категорій:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!accountId || !categoryId || !amount) return;

    try {
      await db.insert(transactions).values({
        userId: currentUserId,
        accountId: accountId,
        categoryId: categoryId,
        amount: parseFloat(amount),
        type: 'income',
      });

      console.log('Дохід успішно збережено в БД!');
      router.back(); 
    } catch (error) {
      console.error("Помилка збереження доходу:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Новий дохід" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput label="Сума" value={amount} onChangeText={setAmount} keyboardType="numeric" 
          mode="outlined"activeOutlineColor={colors.income.text} style={styles.input}/>

        <View style={{ zIndex: 3000, marginBottom: 20 }}>
          <DropDownPicker open={openAccount} value={accountId} items={accountItems} 
            setOpen={setOpenAccount} setValue={setAccountId} setItems={setAccountItems} 
            placeholder="Оберіть рахунок" onOpen={() => setOpenCategory(false)} 
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            textStyle={{ color: theme.colors.onSurface, fontSize: 16 }} 
            dropDownContainerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            placeholderStyle={{ color: theme.colors.onSurfaceVariant }} listMode="SCROLLVIEW"/>
        </View>

        <View style={{ zIndex: 2000, marginBottom: 20 }}>
          <DropDownPicker open={openCategory} value={categoryId} items={categoryItems} setOpen={setOpenCategory}
            setValue={setCategoryId} setItems={setCategoryItems} placeholder="Оберіть категорію"
            onOpen={() => setOpenAccount(false)} style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            textStyle={{ color: theme.colors.onSurface, fontSize: 16 }} 
            dropDownContainerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            placeholderStyle={{ color: theme.colors.onSurfaceVariant }} listMode="SCROLLVIEW"/>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" buttonColor={colors.income.background} textColor={colors.income.text} onPress={handleSave} 
          style={styles.saveButton} disabled={!amount || !categoryId || !accountId}>
          Зберегти
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 20, fontSize: 16 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#e0e0e0' },
  saveButton: { paddingVertical: 8, borderRadius: 12 }
});