import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";

export function createAdminClient() {
  const url = serverEnv.supabaseUrl();
  const secret = serverEnv.supabaseSecretKey();
  if (!url || !secret) throw new Error("Supabase server credentials are not configured");

  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

