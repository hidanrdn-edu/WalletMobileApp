import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Card, Icon, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/AppHeader";
import SideMenu from "@/components/SideMenu";
import type { User } from "@/db/schema";
import { useAppColors } from "@/hooks/useAppColors";

type MainScreenProps = {
  user: User;
  onLogout: () => void;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function MainScreen({ user, onLogout }: MainScreenProps) {
  const theme = useTheme();
  const colors = useAppColors();
  const [menuVisible, setMenuVisible] = useState(false);

  const monthLabel = "March 2026";
  const income = 1200;
  const expense = 820;
  const balance = income - expense;

  const pieData = [
    { value: 450, color: colors.chart[0], text: "Rent" },
    { value: 200, color: colors.chart[1], text: "Food & Drinks" },
    { value: 50, color: colors.chart[2], text: "Transport" },
    { value: 120, color: colors.chart[3], text: "Entertainment" },
  ];

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader onOpenMenu={openMenu} />
      <SideMenu visible={menuVisible} onClose={closeMenu} onLogout={onLogout} user={user} />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Home</Text>
          <Text style={styles.greeting}>Hello, {user.name}</Text>
          <Text style={styles.subtitle}>Your Moneyfy main page is ready.</Text>
        </View>

        <View style={styles.balanceHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Balance ({monthLabel})
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: "bold" }}>
            {currencyFormatter.format(balance)}
          </Text>
        </View>

        <View style={styles.row}>
          <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
            <View style={styles.widgetHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.income.iconBg }]}>
                <Icon source="arrow-down-left" color={colors.income.icon} size={24} />
              </View>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Income
              </Text>
            </View>
            <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.income.text }]}>
              +{currencyFormatter.format(income)}
            </Text>
          </Surface>

          <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
            <View style={styles.widgetHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.expense.iconBg }]}>
                <Icon source="arrow-up-right" color={colors.expense.icon} size={24} />
              </View>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Expenses
              </Text>
            </View>
            <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.expense.text }]}>
              -{currencyFormatter.format(expense)}
            </Text>
          </Surface>
        </View>

        <Card style={[styles.chartCard, { backgroundColor: colors.cardBackground }]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Expense breakdown
            </Text>

            <View style={styles.chartWrapper}>
              <PieChart
                donut
                innerRadius={65}
                radius={100}
                data={pieData}
                innerCircleColor={colors.cardBackground}
                centerLabelComponent={() => (
                  <View style={styles.chartCenter}>
                    <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
                      Total
                    </Text>
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.onSurface, fontWeight: "bold" }}
                    >
                      {currencyFormatter.format(expense)}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View
                  key={`${item.text}-${index}`}
                  style={[styles.legendItem, { borderBottomColor: theme.colors.surfaceVariant }]}
                >
                  <View style={styles.legendLeft}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {item.text}
                    </Text>
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, fontWeight: "bold" }}
                  >
                    {currencyFormatter.format(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fff8",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  hero: {
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#ffffffff",
  },
  greeting: {
    marginTop: 12,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#ffffffff",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#91bbaeff",
  },
  balanceHeader: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  widgetCard: {
    flex: 0.48,
    borderRadius: 16,
    padding: 16,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  widgetAmount: {
    fontWeight: "bold",
  },
  chartCard: {
    borderRadius: 16,
    elevation: 2,
  },
  chartWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  chartCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  bottomSpacer: {
    height: 40,
  },
});
