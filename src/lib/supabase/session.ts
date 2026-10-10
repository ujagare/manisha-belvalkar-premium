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

/** Fetch the signed-in user's course enrollments (for the My Courses library), newest first. */
export async function getMyEnrollments(limit = 50) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];
  const { data } = await supabase
    .from("course_enrollments")
    .select("course_slug, status, enrolled_at, created_at")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Confirm that the signed-in user owns an active entitlement for a course. */
export async function hasCourseAccess(courseSlug: string): Promise<boolean> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return false;
  const { data } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .in("status", ["active", "completed"])
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

/** Progress rows used by the learning library and recorded-course player. */
export async function getMyCourseProgress(courseSlug?: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];
  let query = supabase
    .from("course_lesson_progress")
    .select("course_slug,lesson_id,completed,watched_seconds,last_watched_at,completed_at")
    .eq("user_id", user.id)
    .order("last_watched_at", { ascending: false });
  if (courseSlug) query = query.eq("course_slug", courseSlug);
  const { data } = await query;
  return data ?? [];
}

/** Fetch the signed-in user's service/healing/mentoring bookings (newest first). */
export async function getMyBookings(limit = 50) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Update one of the signed-in user's bookings (cancel / reschedule). Returns true on success. */
export async function updateMyBooking(
  id: string,
  patch: { status?: string; requested_start?: string | null },
): Promise<boolean> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return false;
  const update: { updated_at: string; status?: string; requested_start?: string | null } = { updated_at: new Date().toISOString() };
  if (patch.status) update.status = patch.status;
  if (patch.requested_start !== undefined) update.requested_start = patch.requested_start;
  const { error } = await supabase.from("bookings").update(update).eq("id", id).eq("user_id", user.id);
  return !error;
}
