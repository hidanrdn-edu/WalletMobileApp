export const SUPPORTED_CURRENCIES = ["UAH", "USD", "EUR"] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = "UAH";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

export function getUserCurrency(currency: string | null | undefined): CurrencyCode {
  if (currency && isCurrencyCode(currency)) {
    return currency;
  }

  return DEFAULT_CURRENCY;
}

export function formatCurrencyValue(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
