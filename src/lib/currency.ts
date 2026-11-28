export type SupportedCurrency = "INR" | "USD";

export const SUPPORTED_CURRENCIES: readonly SupportedCurrency[] = ["INR", "USD"] as const;

const DEFAULT_USD_EXCHANGE_RATE = 85;

function sanitizeExchangeRate(value: unknown): number | null {
  if (typeof value === "string" && !value.trim()) return null;
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 50 && parsed <= 200 ? parsed : null;
}

export function usdExchangeRate(): number {
  return (
    sanitizeExchangeRate(process.env.NEXT_PUBLIC_USD_EXCHANGE_RATE) ??
    sanitizeExchangeRate(process.env.RAZORPAY_USD_RATE) ??
    DEFAULT_USD_EXCHANGE_RATE
  );
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
export function convertInrToSubunits(
  inrAmount: number,
  currency: SupportedCurrency,
  rateOverride?: number,
): number {
  if (currency === "USD") {
    const rate = sanitizeExchangeRate(rateOverride) ?? usdExchangeRate();
    const dollars = Math.max(1, Math.ceil(inrAmount / rate));
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
