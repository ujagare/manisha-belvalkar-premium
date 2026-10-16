/**
 * Supabase env configuration shared by client, server, middleware and edge.
 * Safe to import from anywhere (no browser/next-only APIs).
 */

/** Public key used by browser, server-session and proxy clients. */
export function getSupabasePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

/** True once real Supabase credentials have been pasted into .env.local. */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = getSupabasePublicKey();
  return (
    url.startsWith("https://") &&
    !url.includes("YOUR-PROJECT-REF") &&
    key.length > 20 &&
    !key.includes("your-anon")
  );
}
