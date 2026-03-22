import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import React from 'react'

const bills = [
    {
        id: 1,
        name: 'Готівка',
        type: 'готівка',
        balance: 1000
    },
    {
        id: 2,
        name: 'Картка',
        type: 'картка',
        balance: 5000
    }
]

export default function AddBillSection() {
  return (
    <View style={styles.wrapper}>
        <View style={styles.container}>
        <Text style={styles.text}>Рахунки</Text>
        <Button icon="plus" buttonColor="green" mode="contained" onPress={() => console.log('Pressed')}>Додати</Button>
        </View>
        {bills.map(bill => (
            <View key={bill.id} style={styles.container}>
                <Pressable onPress={() => console.log('Pressed')}>
                    <View>
                        <Text style={styles.text}>{bill.name}</Text>
                        <Text>{bill.type}</Text>
                    </View>
                    <Text>{bill.balance} грн</Text>
                </Pressable>
            </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create(
    {
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
        }
    }
)