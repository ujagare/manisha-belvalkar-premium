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
};

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
