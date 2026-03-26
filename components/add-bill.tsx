import { useBills } from '@/context/bills-context'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Appbar, Button, Modal, Portal } from 'react-native-paper'


export default function AddBillSection() {
    const router = useRouter();
    const { bills, addBill } = useBills();
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("готівка");
    const [items, setItems] = useState([
        {label: 'Готівка', value: 'готівка'},
        {label: 'Картка', value: 'картка'},
        {label: 'Депозит', value: 'депозит'},
    ]);

    const [openCurrency, setOpenCurrency] = useState(false);
    const [valueCurrency, setValueCurrency] = useState("грн.");
    const [itemsCurrency, setItemsCurrency] = useState([
        {label: 'UAH', value: 'грн.'},
        {label: 'USD', value: 'дол.'},
        {label: 'EUR', value: 'єв.'},
    ]);

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    function resetForm() {
        setName('');
        setBalance('');
        setValue('готівка');
        setValueCurrency('грн.');
    }

    function handleSubmit() {
        addBill({
            name: name,
            type: value,
            balance: parseFloat(balance) || 0,
            currency: valueCurrency
        });

        hideModal();
        resetForm();
    }

    useEffect(() => {
        if (!visible) {
            resetForm();
        }
    }, [visible])



  return (
    <View style={styles.wrapper}>
        <View style={styles.container}>
        <Text style={styles.text}>Рахунки</Text>
        <Button icon="plus" buttonColor="green" mode="contained" textColor='white' onPress={showModal}>Додати</Button>
        </View>
        {bills.map(bill => (
            <View key={bill.id} style={[styles.container]}>
                <Pressable style={styles.billContainer} onPress={() => router.push({ pathname: '/bills/[id]', params: { id: String(bill.id) } })}>
                    <View style={{gap: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '33%'}}>
                        <Text style={styles.text}>{bill.name}</Text>
                        <Text>{bill.type}</Text>
                    </View>
                    <Text style={[styles.text, { fontSize: 18 }]}>{bill.balance} {bill.currency}</Text>
                </Pressable>
            </View>
        ))}
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.contentContainer}>
                <Appbar.Header style={{ backgroundColor: 'white', padding: 0, marginBottom: 20 }}>
                    <Appbar.Content title="Додати рахунок" color='black'/>
                    <Appbar.Action icon="close" onPress={hideModal} color='black'/>
                </Appbar.Header>
                <View style={styles.modalSection}>
                    <Text>Назва</Text>
                    <TextInput style={styles.input} placeholder='Введіть назву рахунку' value={name} onChangeText={setName}/>
                </View>
                <View style={[styles.modalSection, {zIndex: 3000}]}>
                    <Text>Тип</Text>
                    <DropDownPicker style={styles.input} open={open} value={value}  items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} placeholder='Оберіть рахунок'/>
                </View>
                <View style={[styles.modalSection, styles.balanceSection, {zIndex: 1000}]}>
                    <View style={{width: '65%', gap: 10}}>
                        <Text>Початковий баланс</Text>
                        <TextInput style={styles.input} placeholder='Введіть початковий баланс' keyboardType='numeric' value={balance} onChangeText={setBalance}/>
                    </View>
                    <View style={{width: '30%', gap: 10}}>
                        <Text>Валюта</Text>
                        <DropDownPicker style={styles.input} open={openCurrency} value={valueCurrency}  items={itemsCurrency} setOpen={setOpenCurrency} setValue={setValueCurrency} setItems={setItemsCurrency} placeholder='Оберіть валюту'/>
                    </View>
                </View>
                <Button style={{zIndex: 10}} buttonColor='green' mode='contained' textColor='white' onPress={handleSubmit}>Створити рахунок</Button>
            </Modal>
        </Portal>
    </View>
  )
}

const styles = StyleSheet.create(
    {
        input: {
            borderColor: '#bfc5cc',
            borderWidth: 1,
            borderRadius: 6,
            padding: 15,
        },
        modalSection: {
            marginTop: 10,
            gap: 10,
        },
        balanceSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            alignItems: 'center',
        },
        contentContainer: {
            backgroundColor: 'white', 
            padding: 30, 
            borderRadius: 10,
            width: '65%',
            alignSelf: 'center',
        
        },
        wrapper: {
            flex : 1, 
            backgroundColor: '#e2e2e2'
        },
        container: {
            width: '90%',
            alignSelf: 'center',
            padding: 20,
            marginTop: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            gap: 20,
        },
        text: {
            fontSize: 26,
            fontWeight: 'bold',
        },
        billContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',   
            alignItems: 'center',
        }
    }
)