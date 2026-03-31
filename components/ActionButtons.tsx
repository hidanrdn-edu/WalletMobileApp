import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text, useTheme } from 'react-native-paper';

import { useAppColors } from '../hooks/useAppColors';
import { useAuth } from '@/providers/AuthProvider';
import { listAccountsByUser } from '@/services/accounts';
import type { Account } from '@/db/schema';

export default function ActionButtons() {
  const theme = useTheme();
  const colors = useAppColors();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const loadAccounts = useCallback(async () => {
    if (!currentUser) {
      setAccounts([]);
      return;
    }

    try {
      const userAccounts = await listAccountsByUser(currentUser.id);
      setAccounts(userAccounts);
    } catch (error) {
      console.error('Error loading accounts for ActionButtons:', error);
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      void loadAccounts();

      return undefined;
    }, [loadAccounts]),
  );

  const firstAccountId = useMemo(() => accounts[0]?.id ?? null, [accounts]);
  const hasAccounts = accounts.length > 0;

  const openIncome = () => {
    if (!hasAccounts || !firstAccountId) {
      router.push('/bills' as any);
      return;
    }

    router.push({
      pathname: '/add-income' as any,
      params: { accountId: String(firstAccountId) },
    });
  };

  const openExpense = () => {
    if (!hasAccounts || !firstAccountId) {
      router.push('/bills' as any);
      return;
    }

    router.push({
      pathname: '/add-expense' as any,
      params: { accountId: String(firstAccountId) },
    });
  };

  return (
    <View style={[styles.container, { borderTopColor: theme.colors.surfaceVariant, backgroundColor: theme.colors.background }]}>

      <Button
        mode="contained"
        icon="arrow-down-left"
        buttonColor={colors.income.background}
        textColor={colors.income.text}
        style={styles.button}
        contentStyle={styles.buttonContent}
        elevation={0}
        onPress={openIncome}
      >
        Дохід
      </Button>

      <Button
        mode="contained"
        icon="arrow-up-right"
        buttonColor={colors.expense.background}
        textColor={colors.expense.text}
        style={styles.button}
        contentStyle={styles.buttonContent}
        elevation={0}
        onPress={openExpense}
      >
        Витрата
      </Button>

      {!hasAccounts ? (
        <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>Спочатку створіть хоча б один рахунок</Text>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  button: {
    flex: 0.48,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  hint: {
    width: '100%',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
  },
});