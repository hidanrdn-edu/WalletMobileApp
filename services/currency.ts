import { eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, transactions, users } from "@/db/schema";
import { CurrencyCode, getUserCurrency } from "@/types/currency";

const STORAGE_PRECISION = 6;

type ExchangeRateResponse = {
  result?: "success" | "error";
  rates?: Record<string, number>;
  "error-type"?: string;
};

export type UserCurrencySettings = {
  currency: CurrencyCode;
  baseCurrency: CurrencyCode;
};

function roundToStoragePrecision(value: number) {
  const factor = 10 ** STORAGE_PRECISION;
  return Math.round(value * factor) / factor;
}

export async function getExchangeRate(from: CurrencyCode, to: CurrencyCode): Promise<number> {
  if (from === to) {
    return 1;
  }

  let response: Response;

  try {
    response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
  } catch {
    throw new Error("Не вдалося підключитися до сервісу курсів валют. Перевірте інтернет-з'єднання.");
  }

  if (!response.ok) {
    throw new Error("Не вдалося отримати курс валют. Спробуйте пізніше.");
  }

  const payload = (await response.json()) as ExchangeRateResponse;

  if (payload.result === "error") {
    throw new Error("Сервіс курсів валют тимчасово недоступний.");
  }

  const rate = payload.rates?.[to];

  if (!rate || !Number.isFinite(rate) || rate <= 0) {
    throw new Error("Сервіс курсів валют повернув некоректні дані.");
  }

  return rate;
}

export async function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<number> {
  if (from === to) {
    return amount;
  }

  const rate = await getExchangeRate(from, to);
  return roundToStoragePrecision(amount * rate);
}

export async function getUserCurrencySettings(userId: number): Promise<UserCurrencySettings> {
  const [user] = await db
    .select({
      currency: users.currency,
      baseCurrency: users.baseCurrency,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("Користувача не знайдено.");
  }

  const currency = getUserCurrency(user.currency);
  const baseCurrency = getUserCurrency(user.baseCurrency ?? user.currency);

  return {
    currency,
    baseCurrency,
  };
}

export async function convertUserCurrency(userId: number, nextCurrency: CurrencyCode): Promise<void> {
  const { currency: currentCurrency } = await getUserCurrencySettings(userId);

  if (currentCurrency === nextCurrency) {
    return;
  }

  await getExchangeRate(currentCurrency, nextCurrency);
  const now = new Date().toISOString();

  await db
    .update(users)
    .set({
      currency: nextCurrency,
      updatedAt: now,
    })
    .where(eq(users.id, userId));
}
