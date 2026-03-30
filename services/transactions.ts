import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, categories, transactions } from "@/db/schema";

export type TransactionType = "income" | "expense";

export type TransactionInput = {
  accountId: number;
  amount: number;
  type: TransactionType;
  categoryName: string;
};

function normalizeCategoryName(name: string) {
  return name.trim();
}

function assertTransactionInput(input: TransactionInput) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (!normalizeCategoryName(input.categoryName)) {
    throw new Error("Category is required.");
  }
}

async function findOrCreateCategory(
  tx: typeof db,
  userId: number,
  categoryName: string,
  type: TransactionType,
) {
  const normalizedCategoryName = normalizeCategoryName(categoryName);

  const [existingCategory] = await tx
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(
        eq(categories.userId, userId),
        eq(categories.type, type),
        eq(categories.name, normalizedCategoryName),
      ),
    )
    .limit(1);

  if (existingCategory) {
    return existingCategory.id;
  }

  const [createdCategory] = await tx
    .insert(categories)
    .values({
      userId,
      name: normalizedCategoryName,
      type,
    })
    .returning({ id: categories.id });

  return createdCategory.id;
}

export async function createTransactionForUser(userId: number, input: TransactionInput): Promise<void> {
  assertTransactionInput(input);

  await db.transaction(async (tx) => {
    const [account] = await tx
      .select({
        id: accounts.id,
        balance: accounts.balance,
      })
      .from(accounts)
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)))
      .limit(1);

    if (!account) {
      throw new Error("Please choose a valid account.");
    }

    const categoryId = await findOrCreateCategory(tx, userId, input.categoryName, input.type);

    await tx.insert(transactions).values({
      userId,
      accountId: input.accountId,
      categoryId,
      amount: input.amount,
      type: input.type,
    });

    const balanceDelta = input.type === "income" ? input.amount : -input.amount;

    await tx
      .update(accounts)
      .set({
        balance: account.balance + balanceDelta,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(accounts.id, input.accountId), eq(accounts.userId, userId)));
  });
}
