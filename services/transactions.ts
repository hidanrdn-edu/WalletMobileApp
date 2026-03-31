import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, categories, transactions, type Transaction } from "@/db/schema";
import { convertAmount, getExchangeRate, getUserCurrencySettings } from "@/services/currency";

export type TransactionInput = {
  accountId: number;
  categoryId: number;
  amount: number;
  type: "income" | "expense";
  description: string;
};

export type ExpenseByCategory = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export type IncomeByCategory = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export async function listTransactionsByUser(userId: number): Promise<Transaction[]> {
  const userTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId));

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);

  if (currency === baseCurrency) {
    return userTransactions;
  }

  const rate = await getExchangeRate(baseCurrency, currency);

  return userTransactions.map((item) => ({
    ...item,
    amount: Math.round(item.amount * rate * 1_000_000) / 1_000_000,
  }));
}

export async function getExpensesByCategory(userId: number): Promise<ExpenseByCategory[]> {
  const results = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.type, "expense")
    ))
    .groupBy(transactions.categoryId, categories.name);

  const typedResults = results as ExpenseByCategory[];
  const { currency, baseCurrency } = await getUserCurrencySettings(userId);

  if (currency === baseCurrency) {
    return typedResults;
  }

  const rate = await getExchangeRate(baseCurrency, currency);

  return typedResults.map((item) => ({
    ...item,
    total: Math.round(item.total * rate * 1_000_000) / 1_000_000,
  }));
}

export async function getIncomeByCategory(userId: number): Promise<IncomeByCategory[]> {
  const results = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.type, "income")
    ))
    .groupBy(transactions.categoryId, categories.name);

  const typedResults = results as IncomeByCategory[];
  const { currency, baseCurrency } = await getUserCurrencySettings(userId);

  if (currency === baseCurrency) {
    return typedResults;
  }

  const rate = await getExchangeRate(baseCurrency, currency);

  return typedResults.map((item) => ({
    ...item,
    total: Math.round(item.total * rate * 1_000_000) / 1_000_000,
  }));
}

export async function getTotalExpensesForUser(userId: number): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.type, "expense")
    ))
    .then(rows => rows[0]?.total ?? 0);

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);
  return convertAmount(result, baseCurrency, currency);
}

export async function getTotalIncomeForUser(userId: number): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.type, "income")
    ))
    .then(rows => rows[0]?.total ?? 0);

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);
  return convertAmount(result, baseCurrency, currency);
}

export async function createTransaction(userId: number, input: TransactionInput): Promise<void> {
  const { currency, baseCurrency } = await getUserCurrencySettings(userId);
  const amountInBase = await convertAmount(input.amount, currency, baseCurrency);

  await db.transaction(async (tx) => {
    const [account] = await tx
      .select({ id: accounts.id, balance: accounts.balance })
      .from(accounts)
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)))
      .limit(1);

    if (!account) {
      throw new Error("Рахунок не знайдено.");
    }

    if (input.type === "expense" && amountInBase > account.balance) {
      throw new Error("Недостатньо коштів на вибраному рахунку.");
    }

    await tx.insert(transactions).values({
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId,
      amount: amountInBase,
      type: input.type,
      description: input.description,
    });

    const delta = input.type === "income" ? amountInBase : -amountInBase;

    await tx
      .update(accounts)
      .set({
        balance: sql`${accounts.balance} + ${delta}`,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)));
  });
}
