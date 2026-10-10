import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export const DISTANCE_HEALING_SLUG = "distance-healing";
export const SOURCE_BUCKET = "distance-healing-private";
export const DELIVERY_BUCKET = "distance-healing-deliveries";

export async function ensureDistanceHealingCase(orderId: string, userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("distance_healing_cases").upsert({
    order_id: orderId,
    user_id: userId,
    status: "awaiting_submission",
  }, { onConflict: "order_id", ignoreDuplicates: true }).select("*").maybeSingle();
  if (error) throw error;
  if (data) return data;
  const { data: existing, error: fetchError } = await admin
    .from("distance_healing_cases").select("*").eq("order_id", orderId).eq("user_id", userId).single();
  if (fetchError) throw fetchError;
  return existing;
}

export function distanceHealingReference(orderId: string) {
  return `DH-${orderId.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export function validImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}
