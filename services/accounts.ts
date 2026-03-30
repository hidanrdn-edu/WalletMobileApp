import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, type Account } from "@/db/schema";

export type AccountInput = {
  name: string;
  balance: number;
};

function normalizeName(name: string) {
  return name.trim();
}

function assertAccountInput(input: AccountInput) {
  if (!normalizeName(input.name)) {
    throw new Error("Account name is required.");
  }
}

export async function listAccountsByUser(userId: number): Promise<Account[]> {
  return db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
}

export async function createAccountForUser(userId: number, input: AccountInput): Promise<void> {
  assertAccountInput(input);

  await db.insert(accounts).values({
    userId,
    name: normalizeName(input.name),
    balance: input.balance,
  });
}

export async function updateAccountForUser(userId: number, accountId: number, input: AccountInput): Promise<void> {
  assertAccountInput(input);

  await db
    .update(accounts)
    .set({
      name: normalizeName(input.name),
      balance: input.balance,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}

export async function deleteAccountForUser(userId: number, accountId: number): Promise<void> {
  await db
    .delete(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}
