import { useBills } from '@/context/bills-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from 'react-native-paper';

export default function BillDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBillById, updateBill, deleteBill } = useBills();

  const billId = Number(id);
  const bill = useMemo(() => getBillById(billId), [billId, getBillById]);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');

  const [openType, setOpenType] = useState(false);
  const [typeItems, setTypeItems] = useState([
    { label: 'Готівка', value: 'готівка' },
    { label: 'Картка', value: 'картка' },
    { label: 'Депозит', value: 'депозит' },
  ]);

  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencyItems, setCurrencyItems] = useState([
    { label: 'UAH', value: 'грн.' },
    { label: 'USD', value: 'дол.' },
    { label: 'EUR', value: 'єв.' },
  ]);

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setType(bill.type);
      setBalance(String(bill.balance));
      setCurrency(bill.currency);
    }
  }, [bill]);

  if (!bill) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Рахунок не знайдено</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Назад
        </Button>
      </View>
    );
  }

  function handleSave() {
    if (!bill) {
      return;
    }

    updateBill(billId, {
      name: name.trim() || bill.name,
      type: type.trim() || bill.type,
      balance: Number.parseFloat(balance) || 0,
      currency: currency.trim() || bill.currency,
    });

    setIsEditing(false);
  }

  function handleDelete() {
    deleteBill(billId);
    router.back();
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Деталі рахунку</Text>
        <View style={styles.headerButtons}>
          <Button mode="contained" buttonColor="#0077ff" textColor="white" onPress={() => setIsEditing((prev) => !prev)}>
            {isEditing ? 'Назад' : 'Редагувати'}
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
            <View style={[styles.row, { zIndex: 2000 }]}>
              <Text style={styles.label}>Тип</Text>
              <DropDownPicker
                style={styles.input}
                open={openType}
                value={type}
                items={typeItems}
                setOpen={setOpenType}
                setValue={setType}
                setItems={setTypeItems}
                placeholder="Оберіть тип"
                zIndex={2000}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Баланс</Text>
              <TextInput style={styles.input} value={balance} onChangeText={setBalance} keyboardType="numeric" />
            </View>
            <View style={[styles.row, { zIndex: 1000 }]}>
              <Text style={styles.label}>Валюта</Text>
              <DropDownPicker
                style={styles.input}
                open={openCurrency}
                value={currency}
                items={currencyItems}
                setOpen={setOpenCurrency}
                setValue={setCurrency}
                setItems={setCurrencyItems}
                placeholder="Оберіть валюту"
                zIndex={1000}
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
              <Text style={styles.infoLabel}>Тип</Text>
              <Text style={styles.infoValue}>{bill.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Баланс</Text>
              <Text style={styles.infoValue}>
                {bill.balance} {bill.currency}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  back: {
    fontSize: 28,
    color: '#6b7280',
    width: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 14,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eceff1',
    gap: 6,
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 16,
  },
  infoValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '600',
  },
  row: {
    gap: 8,
  },
  label: {
    color: '#6b7280',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
});
