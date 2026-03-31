import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { categories, transactions, type Transaction } from "@/db/schema";

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

export async function listTransactionsByUser(userId: number): Promise<Transaction[]> {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId));
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

  return results as ExpenseByCategory[];
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

  return result;
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

  return result;
}

export async function createTransaction(userId: number, input: TransactionInput): Promise<void> {
  await db.insert(transactions).values({
    userId,
    accountId: input.accountId,
    categoryId: input.categoryId,
    amount: input.amount,
    type: input.type,
    description: input.description,
  });
}
