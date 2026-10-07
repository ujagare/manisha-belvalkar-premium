import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser, UserProfile, UserOrder, UserAddress } from "@/lib/supabase/models";

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

/** Fetch one order owned by the signed-in user. RLS and user_id both scope access. */
export async function getMyOrderById(id: string): Promise<UserOrder | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

/** Fetch the signed-in user's saved delivery/shipping addresses (newest first). */
export async function getMyAddresses(): Promise<UserAddress[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("updated_at", { ascending: false });

  return data ?? [];
}

/** Create/update a saved address for the signed-in user. Returns the row or false. */
export async function saveMyAddress(input: {
  id?: string;
  label?: string;
  recipient_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country_code?: string;
}): Promise<UserAddress | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const base = {
    user_id: user.id,
    label: input.label ?? "Home",
    recipient_name: input.recipient_name,
    phone: input.phone,
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city,
    state: input.state,
    postal_code: input.postal_code,
    country_code: input.country_code ?? "IN",
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("addresses")
      .update(base)
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();
    if (error) return null;
    return data;
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(base)
    .select("*")
    .maybeSingle();
  if (error) return null;
  return data;
}

/** Delete one of the signed-in user's addresses. Returns true on success. */
export async function deleteMyAddress(id: string): Promise<boolean> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return false;
  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  return !error;
}

/** Fetch the shipment (tracking) record for an order owned by the user, if any. */
export async function getShipmentForOrder(orderId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase.from("shipments").select("*").eq("order_id", orderId).maybeSingle();
  return data;
}
