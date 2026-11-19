export type SupportedCurrency = "INR" | "USD";

export const SUPPORTED_CURRENCIES: readonly SupportedCurrency[] = ["INR", "USD"] as const;

const DEFAULT_USD_EXCHANGE_RATE = 85;

export function usdExchangeRate(): number {
  const raw = Number(process.env.NEXT_PUBLIC_USD_EXCHANGE_RATE ?? process.env.RAZORPAY_USD_RATE);
  return Number.isFinite(raw) && raw >= 50 && raw <= 200 ? raw : DEFAULT_USD_EXCHANGE_RATE;
}

export function normalizeCurrency(value: unknown): SupportedCurrency {
  if (typeof value === "string" && value.trim().toUpperCase() === "USD") return "USD";
  return "INR";
}

/**
 * Authoritative INR -> payment subunit conversion.
 * - INR: paise (rupees * 100)
 * - USD: cents (rounded to whole USD dollars so international pricing stays clean, min $1)
 */
export function convertInrToSubunits(inrAmount: number, currency: SupportedCurrency): number {
  if (currency === "USD") {
    const dollars = Math.max(1, Math.ceil(inrAmount / usdExchangeRate()));
    return dollars * 100;
  }
  return Math.round(inrAmount * 100);
}

export function formatCurrencyAmount(amountMajor: number, currency: SupportedCurrency): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: amountMajor % 1 === 0 ? 0 : 2,
    }).format(amountMajor);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountMajor);
}

export function formatCurrencySubunits(subunits: number, currency: SupportedCurrency): string {
  return formatCurrencyAmount(subunits / 100, currency);
}
