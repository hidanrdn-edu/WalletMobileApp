import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, type Account } from "@/db/schema";
import { convertAmount, getExchangeRate, getUserCurrencySettings } from "@/services/currency";

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
  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);

  if (currency === baseCurrency) {
    return userAccounts;
  }

  const rate = await getExchangeRate(baseCurrency, currency);

  return userAccounts.map((account) => ({
    ...account,
    balance: Math.round(account.balance * rate * 1_000_000) / 1_000_000,
  }));
}

export async function createAccountForUser(userId: number, input: AccountInput): Promise<void> {
  assertAccountInput(input);

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);
  const balanceInBase = await convertAmount(input.balance, currency, baseCurrency);

  await db.insert(accounts).values({
    userId,
    name: normalizeName(input.name),
    balance: balanceInBase,
  });
}

export async function updateAccountForUser(userId: number, accountId: number, input: AccountInput): Promise<void> {
  assertAccountInput(input);

  const { currency, baseCurrency } = await getUserCurrencySettings(userId);
  const balanceInBase = await convertAmount(input.balance, currency, baseCurrency);

  await db
    .update(accounts)
    .set({
      name: normalizeName(input.name),
      balance: balanceInBase,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}

export async function deleteAccountForUser(userId: number, accountId: number): Promise<void> {
  await db
    .delete(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}
