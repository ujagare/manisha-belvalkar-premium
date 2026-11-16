const placeholderPattern = /^(your-|replace-|placeholder|https:\/\/your-project)/i;

function read(name: string) {
  const value = process.env[name]?.trim();
  return value && !placeholderPattern.test(value) ? value : null;
}

export const serverEnv = {
  supabaseUrl: () => read("NEXT_PUBLIC_SUPABASE_URL"),
  supabasePublishableKey: () =>
    read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseSecretKey: () => read("SUPABASE_SECRET_KEY") ?? read("SUPABASE_SERVICE_ROLE_KEY"),
  razorpayKeyId: () => read("NEXT_PUBLIC_RAZORPAY_KEY_ID") ?? read("RAZORPAY_KEY_ID"),
  razorpayKeySecret: () => read("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: () => read("RAZORPAY_WEBHOOK_SECRET"),
  resendApiKey: () => read("RESEND_API_KEY"),
  resendFromEmail: () => read("RESEND_FROM_EMAIL"),
  /**
   * Signs guest invoice links. A guest order has no session to authenticate
   * with, so the invoice URL carries an HMAC of the order id — only a holder of
   * the emailed link can open it. Falls back to the Supabase secret so existing
   * deployments keep working without a new env var.
   */
  invoiceLinkSecret: () =>
    read("INVOICE_LINK_SECRET") ??
    read("SUPABASE_SECRET_KEY") ??
    read("SUPABASE_SERVICE_ROLE_KEY"),
  /** Seller GSTIN printed on tax invoices. Optional until GST registration. */
  sellerGstin: () => read("GSTIN") ?? read("SELLER_GSTIN"),
};

export function isEmailConfigured() {
  return Boolean(
    serverEnv.resendApiKey() &&
      serverEnv.resendFromEmail(),
  );
}

export function isPaymentsConfigured() {
  return Boolean(
    serverEnv.supabaseUrl() &&
      serverEnv.supabaseSecretKey() &&
      serverEnv.razorpayKeyId() &&
      serverEnv.razorpayKeySecret(),
  );
}

export function isServerConfigured() {
  return Boolean(
    serverEnv.supabaseUrl() &&
      serverEnv.supabasePublishableKey() &&
      serverEnv.supabaseSecretKey(),
  );
}
