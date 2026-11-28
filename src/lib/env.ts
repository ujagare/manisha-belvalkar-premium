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
  /** Daily.co private video room API key (server-only). */
  dailyApiKey: () => read("DAILY_API_KEY"),
  /** Optional Daily.co subdomain (e.g. manishabelvalkar.daily.co). */
  dailyDomain: () => read("DAILY_DOMAIN"),
  /** Shiprocket API user email & password (server-only). */
  shiprocketEmail: () => read("SHIPROCKET_EMAIL"),
  shiprocketPassword: () => read("SHIPROCKET_PASSWORD"),
  /** Shiprocket registered pickup location nickname (default: "Primary"). */
  shiprocketPickupLocation: () => read("SHIPROCKET_PICKUP_LOCATION") ?? "Primary",
  /** Origin warehouse 6-digit Indian PIN code (Pune/Mumbai default). */
  shiprocketPickupPincode: () => read("SHIPROCKET_PICKUP_PINCODE") ?? "411001",
  /** Shared secret token verified against incoming Shiprocket `x-api-key` webhook header. */
  shiprocketWebhookToken: () => read("SHIPROCKET_WEBHOOK_TOKEN"),
  /** Optional Shiprocket custom channel ID. */
  shiprocketChannelId: () => read("SHIPROCKET_CHANNEL_ID"),
  /** Auto-push paid physical orders to Shiprocket immediately on payment capture. */
  shiprocketAutoPush: () => (read("SHIPROCKET_AUTO_PUSH") ?? "true").toLowerCase() !== "false",
  /**
   * Secret key for short-lived HMAC course video stream tokens & session locks.
   * Falls back to INVOICE_LINK_SECRET / SUPABASE_SERVICE_ROLE_KEY when unset.
   */
  courseStreamSecret: () =>
    read("COURSE_STREAM_SECRET") ??
    read("INVOICE_LINK_SECRET") ??
    read("SUPABASE_SECRET_KEY") ??
    read("SUPABASE_SERVICE_ROLE_KEY"),
  /** VdoCipher API Secret for Widevine + FairPlay hardware DRM & server-baked watermark OTPs. */
  vdocipherApiSecret: () => read("VDOCIPHER_API_SECRET"),
  /** Bunny Stream Embed View Token Authentication Key (optional). */
  bunnyStreamSigningKey: () => read("BUNNY_STREAM_SIGNING_KEY"),
  /** Maximum distinct devices allowed per student account (default: 2 — e.g. laptop + phone). */
  courseMaxDevices: () => {
    const parsed = Number.parseInt(read("COURSE_MAX_DEVICES") ?? "2", 10);
    return Number.isFinite(parsed) && parsed >= 1 && parsed <= 10 ? parsed : 2;
  },
};

export function isVdoCipherConfigured() {
  return Boolean(serverEnv.vdocipherApiSecret());
}

export function isShiprocketConfigured() {
  return Boolean(serverEnv.shiprocketEmail() && serverEnv.shiprocketPassword());
}

export function isDailyConfigured() {
  return Boolean(serverEnv.dailyApiKey());
}

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
      serverEnv.razorpayKeySecret() &&
      serverEnv.razorpayWebhookSecret(),
  );
}

export function isServerConfigured() {
  return Boolean(
    serverEnv.supabaseUrl() &&
      serverEnv.supabasePublishableKey() &&
      serverEnv.supabaseSecretKey(),
  );
}
