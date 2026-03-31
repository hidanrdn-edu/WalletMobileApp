import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, categories, transactions, type Transaction } from "@/db/schema";

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

  return results as IncomeByCategory[];
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
  await db.transaction(async (tx) => {
    const [account] = await tx
      .select({ id: accounts.id, balance: accounts.balance })
      .from(accounts)
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)))
      .limit(1);

    if (!account) {
      throw new Error("Рахунок не знайдено.");
    }

    if (input.type === "expense" && input.amount > account.balance) {
      throw new Error("Недостатньо коштів на вибраному рахунку.");
    }

    await tx.insert(transactions).values({
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId,
      amount: input.amount,
      type: input.type,
      description: input.description,
    });

    const delta = input.type === "income" ? input.amount : -input.amount;

    await tx
      .update(accounts)
      .set({
        balance: sql`${accounts.balance} + ${delta}`,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)));
  });
}
