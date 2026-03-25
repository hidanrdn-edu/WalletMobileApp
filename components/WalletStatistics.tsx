import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, Icon, Surface, Text, useTheme } from 'react-native-paper';

export default function WalletStatistics() {
  const theme = useTheme();
  const month = "Березень 2026";
  const income = 2450.00;
  const expense = 1820.50;
  const balance = income - expense;

  const pieData = [
    { value: 850, color: '#FF6384', text: 'Житло' },
    { value: 450, color: '#36A2EB', text: 'Продукти' },
    { value: 320, color: '#FFCE56', text: 'Транспорт' },
    { value: 200.5, color: '#4BC0C0', text: 'Розваги' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Баланс ({month})
        </Text>
        <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
          €{balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.row}>
        <Surface style={[styles.widgetCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.widgetHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Icon source="arrow-down-left" color="#4CAF50" size={24} />
            </View>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Доходи</Text>
          </View>
          <Text variant="titleLarge" style={[styles.widgetAmount, { color: '#4CAF50' }]}>
            +€{income.toFixed(2)}
          </Text>
        </Surface>

        <Surface style={[styles.widgetCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.widgetHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Icon source="arrow-up-right" color="#F44336" size={24} />
            </View>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Витрати</Text>
          </View>
          <Text variant="titleLarge" style={[styles.widgetAmount, { color: '#F44336' }]}>
            -€{expense.toFixed(2)}
          </Text>
        </Surface>
      </View>

      <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Структура витрат
          </Text>
          
          <View style={styles.chartWrapper}>
            <PieChart
              donut
              innerRadius={65}
              radius={100}
              data={pieData}
              centerLabelComponent={() => (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Всього</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                    €{expense.toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {item.text}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}>
                  €{item.value.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

        </Card.Content>
      </Card>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  widgetCard: {
    flex: 0.48,
    borderRadius: 16,
    padding: 16,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  widgetAmount: {
    fontWeight: 'bold',
  },
  chartCard: {
    borderRadius: 16,
    elevation: 2,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', 
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});