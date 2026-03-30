import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Icon,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import AddBillSection from "@/components/add-bill";
import AppHeader from "@/components/AppHeader";
import SideMenu from "@/components/SideMenu";
import { useBills } from "@/context/bills-context";
import type { User } from "@/db/schema";
import { useAppColors } from "@/hooks/useAppColors";
import {
  createTransactionForUser,
  type TransactionType,
} from "@/services/transactions";
import {
  getMonthlyWalletStatistics,
  type MonthlyWalletStatistics,
} from "@/services/walletStatistics";

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
  const { bills, isLoading: isBillsLoading, refreshBills } = useBills();
  const [menuVisible, setMenuVisible] = useState(false);
  const [statistics, setStatistics] = useState<MonthlyWalletStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statisticsRefreshKey, setStatisticsRefreshKey] = useState(0);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("income");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [categoryName, setCategoryName] = useState("Salary");
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadStatistics() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextStatistics = await getMonthlyWalletStatistics(user.id);

        if (!isCancelled) {
          setStatistics(nextStatistics);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load wallet statistics.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStatistics();

    return () => {
      isCancelled = true;
    };
  }, [statisticsRefreshKey, user.id]);

  useEffect(() => {
    if (bills.length === 0) {
      setSelectedAccountId(null);
      return;
    }

    if (!selectedAccountId || !bills.some((bill) => bill.id === selectedAccountId)) {
      setSelectedAccountId(bills[0].id);
    }
  }, [bills, selectedAccountId]);

  const monthLabel = statistics?.monthLabel ?? "";
  const income = statistics?.income ?? 0;
  const expense = statistics?.expense ?? 0;
  const balance = statistics?.balance ?? 0;
  const pieData = (statistics?.expenseBreakdown ?? []).map((item, index) => ({
    value: item.value,
    color: colors.chart[index % colors.chart.length],
    text: item.label,
  }));
  const hasExpenseData = pieData.length > 0;
  const canAddTransactions = bills.length > 0 && !isBillsLoading;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  function resetTransactionForm(nextType: TransactionType) {
    setTransactionType(nextType);
    setAmountInput("");
    setCategoryName(nextType === "income" ? "Salary" : "General");
    setTransactionError(null);
  }

  function openTransactionModal(nextType: TransactionType) {
    if (!canAddTransactions || isSubmittingTransaction) {
      return;
    }

    resetTransactionForm(nextType);
    setIsTransactionModalVisible(true);
  }

  function closeTransactionModal() {
    if (isSubmittingTransaction) {
      return;
    }

    setIsTransactionModalVisible(false);
    setTransactionError(null);
  }

  async function handleCreateTransaction() {
    const parsedAmount = Number(amountInput.replace(",", "."));

    if (!selectedAccountId) {
      setTransactionError("Please choose an account first.");
      return;
    }

    setIsSubmittingTransaction(true);
    setTransactionError(null);

    try {
      await createTransactionForUser(user.id, {
        accountId: selectedAccountId,
        amount: parsedAmount,
        type: transactionType,
        categoryName,
      });

      await refreshBills();
      setStatisticsRefreshKey((value) => value + 1);
      setIsTransactionModalVisible(false);
    } catch (error) {
      setTransactionError(
        error instanceof Error ? error.message : "Unable to save the transaction.",
      );
    } finally {
      setIsSubmittingTransaction(false);
    }
  }

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

        <AddBillSection />

        <View style={styles.balanceHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Balance ({monthLabel})
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: "bold" }}>
            {currencyFormatter.format(balance)}
          </Text>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.cardPressable}
            disabled={!canAddTransactions || isSubmittingTransaction}
            onPress={() => openTransactionModal("income")}
          >
            <Surface
              style={[
                styles.widgetCard,
                styles.touchableCard,
                { backgroundColor: colors.cardBackground },
                !canAddTransactions || isSubmittingTransaction ? styles.cardDisabled : null,
              ]}
              elevation={2}
            >
              <View style={styles.widgetHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.income.iconBg }]}>
                  <Icon source="arrow-down-left" color={colors.income.icon} size={24} />
                </View>
                <View style={styles.cardTextBlock}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                    Income
                  </Text>
                </View>
              </View>
              <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.income.text }]}>
                +{currencyFormatter.format(income)}
              </Text>
            </Surface>
          </Pressable>

          <Pressable
            style={styles.cardPressable}
            disabled={!canAddTransactions || isSubmittingTransaction}
            onPress={() => openTransactionModal("expense")}
          >
            <Surface
              style={[
                styles.widgetCard,
                styles.touchableCard,
                { backgroundColor: colors.cardBackground },
                !canAddTransactions || isSubmittingTransaction ? styles.cardDisabled : null,
              ]}
              elevation={2}
            >
              <View style={styles.widgetHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.expense.iconBg }]}>
                  <Icon source="arrow-up-right" color={colors.expense.icon} size={24} />
                </View>
                <View style={styles.cardTextBlock}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                    Expenses
                  </Text>

                </View>
              </View>
              <Text variant="titleLarge" style={[styles.widgetAmount, { color: colors.expense.text }]}>
                -{currencyFormatter.format(expense)}
              </Text>
            </Surface>
          </Pressable>
        </View>

        {!canAddTransactions ? (
          <Text style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
            Create at least one account before adding income or expenses.
          </Text>
        ) : null}

        <Card style={[styles.chartCard, { backgroundColor: colors.cardBackground }]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Expense breakdown
            </Text>

            {isLoading ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Loading current month statistics...
                </Text>
              </View>
            ) : errorMessage ? (
              <View style={styles.stateContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                  {errorMessage}
                </Text>
              </View>
            ) : hasExpenseData ? (
              <>
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
              </>
            ) : (
              <View style={styles.stateContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  No expense transactions were found for this month yet.
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Portal>
        <Modal
          visible={isTransactionModalVisible}
          onDismiss={closeTransactionModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            {transactionType === "income" ? "Add income" : "Add expense"}
          </Text>

          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Choose an account and save the transaction into your database.
          </Text>

          <View style={styles.accountList}>
            {bills.map((bill) => (
              <Chip
                key={bill.id}
                selected={selectedAccountId === bill.id}
                onPress={() => setSelectedAccountId(bill.id)}
              >
                {bill.name}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="decimal-pad"
            value={amountInput}
            onChangeText={setAmountInput}
          />

          <TextInput
            label="Category"
            mode="outlined"
            value={categoryName}
            onChangeText={setCategoryName}
          />

          {transactionError ? (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {transactionError}
            </Text>
          ) : null}

          <View style={styles.modalActions}>
            <Button mode="text" onPress={closeTransactionModal} disabled={isSubmittingTransaction}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => void handleCreateTransaction()}
              loading={isSubmittingTransaction}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
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
    gap: 12,
  },
  cardPressable: {
    flex: 1,
  },
  widgetCard: {
    borderRadius: 16,
    padding: 16,
  },
  touchableCard: {
    minHeight: 122,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTextBlock: {
    flex: 1,
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
  helperText: {
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 8,
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
  stateContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
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
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    gap: 16,
  },
  accountList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
  },
});
