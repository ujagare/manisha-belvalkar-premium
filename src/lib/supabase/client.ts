"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicKey } from "@/lib/supabase/config";

/**
 * Browser-side Supabase client (login/signup forms, client components).
 * Uses the anon key + URL from .env.local — never server secrets here.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
  );
}

export { isSupabaseConfigured } from "@/lib/supabase/config";
