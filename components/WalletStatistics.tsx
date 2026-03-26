import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { useAppColors } from '../hooks/useAppColors';

export default function WalletStatistics() {
  const theme = useTheme();
  const colors = useAppColors(); 

  const month = "Березень";
  const income = 1200.00;
  const expense = 820.00;
  const balance = income - expense;

  const pieData = [
    { value: 450, color: colors.chart[0], text: 'Оренда' },
    { value: 200, color: colors.chart[1], text: 'Їжа та напої' },
    { value: 50, color: colors.chart[2], text: 'Транспорт' },
    { value: 120, color: colors.chart[3], text: 'Розваги' },
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
        {/* Доходи */}
        <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
          <View style={styles.widgetHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.income.iconBg }]}>
              <Icon source="arrow-down-left" color={colors.income.icon} size={24} />
            </View>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Доходи</Text>
          </View>
          <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.income.text }]}>
            +€{income.toFixed(2)}
          </Text>
        </Surface>

        {/* Витрати */}
        <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
          <View style={styles.widgetHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.expense.iconBg }]}>
              <Icon source="arrow-up-right" color={colors.expense.icon} size={24} />
            </View>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Витрати</Text>
          </View>
          <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.expense.text }]}>
            -€{expense.toFixed(2)}
          </Text>
        </Surface>
      </View>

      {/* Графік */}
      <Card style={[styles.chartCard, { backgroundColor: colors.cardBackground }]} mode="elevated">
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
              innerCircleColor={colors.cardBackground}
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
              <View key={index} style={[styles.legendItem, { borderBottomColor: theme.colors.surfaceVariant }]}>
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