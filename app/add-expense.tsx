import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Appbar, Button, HelperText, TextInput, useTheme } from 'react-native-paper';

import { useAppColors } from '../hooks/useAppColors';
import { useAuth } from '@/providers/AuthProvider';
import { useBills } from '@/context/bills-context';
import { listAccountsByUser } from '@/services/accounts';
import { listCategoriesByUserAndType } from '@/services/categories';
import { createTransaction } from '@/services/transactions';

export default function AddExpenseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const colors = useAppColors();
  const { currentUser } = useAuth();
  const { refreshBills } = useBills();
  const { accountId: routeAccountId } = useLocalSearchParams<{ accountId?: string }>();
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAccount, setOpenAccount] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountItems, setAccountItems] = useState<{label: string, value: number}[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{label: string, value: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        return;
      }

      try {
        const fetchedAccounts = await listAccountsByUser(currentUser.id);
        
        setAccountItems(fetchedAccounts.map(acc => ({
          label: acc.name,
          value: acc.id
        })));

        if (routeAccountId) {
          const parsedAccountId = Number(routeAccountId);

          if (!Number.isNaN(parsedAccountId)) {
            setAccountId(parsedAccountId);
          }
        } else if (fetchedAccounts.length) {
          setAccountId(fetchedAccounts[0].id);
        }

        const fetchedCategories = await listCategoriesByUserAndType(currentUser.id, 'expense');

        setCategoryItems(fetchedCategories.map(cat => ({
          label: cat.name,
          value: cat.id
        })));

        if (fetchedCategories.length) {
          setCategoryId((prev) => prev ?? fetchedCategories[0].id);
        }

      } catch (error) {
        console.error("Помилка завантаження рахунків/категорій:", error);
      }
    };

    void fetchData();
  }, [currentUser, routeAccountId]);

  const handleSave = async () => {
    setErrorMessage('');

    if (!currentUser) {
      setErrorMessage('Потрібно увійти в акаунт.');
      return;
    }

    if (!accountId || !categoryId || !amount) {
      setErrorMessage('Заповніть всі обовʼязкові поля.');
      return;
    }

    const parsedAmount = Number.parseFloat(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Сума повинна бути більше 0.');
      return;
    }

    try {
      await createTransaction(currentUser.id, {
        accountId,
        categoryId,
        amount: parsedAmount,
        type: 'expense',
        description: 'Витрата',
      });

      await refreshBills();

      router.back();
    } catch (error) {
      console.error("Помилка збереження витрати:", error);
      setErrorMessage(error instanceof Error ? error.message : 'Не вдалося зберегти витрату.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Нова витрата" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <TextInput label="Сума" value={amount} onChangeText={setAmount}
          keyboardType="numeric" mode="outlined" activeOutlineColor={colors.expense.text} style={styles.input}/>

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
          <DropDownPicker open={openCategory} value={categoryId} items={categoryItems}
            setOpen={setOpenCategory} setValue={setCategoryId} setItems={setCategoryItems}
            placeholder="Оберіть категорію" onOpen={() => setOpenAccount(false)}
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            textStyle={{ color: theme.colors.onSurface, fontSize: 16 }}
            dropDownContainerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }}
            placeholderStyle={{ color: theme.colors.onSurfaceVariant }} listMode="SCROLLVIEW"/>
        </View>

        <HelperText type="error" visible={Boolean(errorMessage)}>
          {errorMessage}
        </HelperText>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" buttonColor={colors.expense.background}
          textColor={colors.expense.text} onPress={handleSave}
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