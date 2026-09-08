import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser, UserProfile, UserOrder } from "@/lib/supabase/models";

/**
 * Typed auth helpers. Every page that needs the current user goes
 * through these, so the returned shape is always the SessionUser model
 * and nobody can drift into raw supabase objects.
 */

/** Fetch the signed-in user as a typed SessionUser (null when signed out). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    fullName:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      null,
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ??
      (user.user_metadata?.picture as string | undefined) ??
      null,
    createdAt: user.created_at,
  };
});

/** Like getCurrentUser but redirects to /login?next=… when signed out. */
export async function requireUser(
  next = "/account",
): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return user;
}

/** Fetch the signed-in user's profile row (null when not signed in). */
export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data;
}

/** Fetch the signed-in user's most recent orders (newest first). */
export async function getMyOrders(limit = 50): Promise<UserOrder[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
