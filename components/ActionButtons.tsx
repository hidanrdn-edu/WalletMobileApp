import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { useAppColors } from '../hooks/useAppColors';

export default function ActionButtons() {
  const theme = useTheme();
  const colors = useAppColors();
  const router = useRouter(); 

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
        onPress={() => router.push('/add-income' as any)} 
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
        onPress={() => router.push('/add-expense' as any)} 
      >
        Витрата
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  }
});