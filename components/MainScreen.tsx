import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Card, Icon, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "@/components/AppHeader";
import SideMenu from "@/components/SideMenu";
import type { User } from "@/db/schema";
import { useAppColors } from "@/hooks/useAppColors";
import { listAccountsByUser } from "@/services/accounts";
import {
  getExpensesByCategory,
  getIncomeByCategory,
  getTotalExpensesForUser,
  getTotalIncomeForUser,
} from "@/services/transactions";
import { getUserCurrency } from "@/types/currency";
import ActionButtons from "./ActionButtons";

type MainScreenProps = {
  user: User;
  onLogout: () => void;
};

export function MainScreen({ user, onLogout }: MainScreenProps) {
  const theme = useTheme();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const currencyCode = getUserCurrency(user.currency);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currencyCode],
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    expensesByCategory: [] as { categoryName: string; total: number; color: string }[],
    incomeByCategory: [] as { categoryName: string; total: number; color: string }[],
  });

  const loadData = useCallback(async () => {
    try {
      const userAccounts = await listAccountsByUser(user.id);
      const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

      const totalIncome = await getTotalIncomeForUser(user.id);
      const totalExpense = await getTotalExpensesForUser(user.id);

      const expensesByCategory = await getExpensesByCategory(user.id);
      const incomeByCategory = await getIncomeByCategory(user.id);

      const expenseChartData = expensesByCategory.map((exp, index) => ({
        categoryName: exp.categoryName,
        total: exp.total,
        color: colors.chart[index % colors.chart.length],
      }));

      const incomeChartData = incomeByCategory.map((inc, index) => ({
        categoryName: inc.categoryName,
        total: inc.total,
        color: colors.chart[index % colors.chart.length],
      }));

      setData({
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        expensesByCategory: expenseChartData,
        incomeByCategory: incomeChartData,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [colors.chart, user.id]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
      return undefined;
    }, [loadData]),
  );

  const today = new Date();
  const monthLabel = today.toLocaleDateString("uk-UA", {
    month: "long",
    year: "numeric",
  });

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const pieData = data.expensesByCategory.map(item => ({
    value: item.total,
    color: item.color,
    text: item.categoryName,
  }));

  const incomePieData = data.incomeByCategory.map(item => ({
    value: item.total,
    color: item.color,
    text: item.categoryName,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader onOpenMenu={openMenu} onCurrencyChanged={loadData} />
      <SideMenu visible={menuVisible} onClose={closeMenu} onLogout={onLogout} user={user} />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingBottom: 172 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: theme.colors.onSurfaceVariant }]}>Home</Text>
          <Text style={[styles.greeting, { color: theme.colors.onSurface }]}>Вітаю, {user.name}</Text>
        </View>

        <View style={styles.balanceHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Баланс ({monthLabel})
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: "bold" }}>
            {currencyFormatter.format(data.balance)}
          </Text>
        </View>

        <View style={styles.row}>
          <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
            <View style={styles.widgetHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.income.iconBg }]}>
                <Icon source="arrow-down-left" color={colors.income.icon} size={24} />
              </View>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Доходи
              </Text>
            </View>
            <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.income.text }]}>
              +{currencyFormatter.format(data.income)}
            </Text>
          </Surface>

          <Surface style={[styles.widgetCard, { backgroundColor: colors.cardBackground }]} elevation={2}>
            <View style={styles.widgetHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.expense.iconBg }]}>
                <Icon source="arrow-up-right" color={colors.expense.icon} size={24} />
              </View>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Витрати
              </Text>
            </View>
            <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.expense.text }]}>
              -{currencyFormatter.format(data.expense)}
            </Text>
          </Surface>
        </View>

        <Card style={[styles.chartCard, { backgroundColor: colors.cardBackground }]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Діаграма витрат
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
                      Всього
                    </Text>
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.onSurface, fontWeight: "bold" }}
                    >
                      {currencyFormatter.format(data.expense)}
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

        <Card style={[styles.chartCard, styles.secondChartCard, { backgroundColor: colors.cardBackground }]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Діаграма доходів
            </Text>

            <View style={styles.chartWrapper}>
              <PieChart
                donut
                innerRadius={65}
                radius={100}
                data={incomePieData}
                innerCircleColor={colors.cardBackground}
                centerLabelComponent={() => (
                  <View style={styles.chartCenter}>
                    <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
                      Всього
                    </Text>
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.onSurface, fontWeight: "bold" }}
                    >
                      {currencyFormatter.format(data.income)}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.legendContainer}>
              {incomePieData.map((item, index) => (
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
      </ScrollView>

      <View style={[styles.fixedActionButtons, { backgroundColor: theme.colors.background }]}>
        <ActionButtons />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  greeting: {
    marginTop: 12,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
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
  secondChartCard: {
    marginTop: 16,
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
  fixedActionButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
