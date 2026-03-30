import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "@/db/client";
import { categories, transactions } from "@/db/schema";

export type ExpenseBreakdownItem = {
  label: string;
  value: number;
};

export type MonthlyWalletStatistics = {
  monthLabel: string;
  income: number;
  expense: number;
  balance: number;
  expenseBreakdown: ExpenseBreakdownItem[];
};

function toSqliteDateTime(value: Date) {
  return value.toISOString().slice(0, 19).replace("T", " ");
}

function getMonthRange(baseDate: Date) {
  const start = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), 1));
  const end = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 1));

  return {
    start,
    startValue: toSqliteDateTime(start),
    endValue: toSqliteDateTime(end),
  };
}

function resolveTransactionType(transactionType: string, categoryType: string) {
  const normalizedTransactionType = transactionType.trim().toLowerCase();
  const normalizedCategoryType = categoryType.trim().toLowerCase();

  if (normalizedTransactionType === "income" || normalizedCategoryType === "income") {
    return "income";
  }

  return "expense";
}

export async function getMonthlyWalletStatistics(
  userId: number,
  baseDate = new Date(),
): Promise<MonthlyWalletStatistics> {
  const { start, startValue, endValue } = getMonthRange(baseDate);

  const rows = await db
    .select({
      amount: transactions.amount,
      transactionType: transactions.type,
      categoryType: categories.type,
      categoryName: categories.name,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, startValue),
        lt(transactions.createdAt, endValue),
      ),
    );

  let income = 0;
  let expense = 0;
  const expenseByCategory = new Map<string, number>();

  for (const row of rows) {
    const transactionType = resolveTransactionType(row.transactionType, row.categoryType);
    const amount = Number(row.amount) || 0;

    if (transactionType === "income") {
      income += amount;
      continue;
    }

    expense += amount;
    expenseByCategory.set(row.categoryName, (expenseByCategory.get(row.categoryName) ?? 0) + amount);
  }

  const expenseBreakdown = Array.from(expenseByCategory.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);

  return {
    monthLabel: new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(start),
    income,
    expense,
    balance: income - expense,
    expenseBreakdown,
  };
}
