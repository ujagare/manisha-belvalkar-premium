import "server-only";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "owner" | "admin" | "booking_manager" | "catalog_manager" | "support";

export async function requireStaff(allowed?: StaffRole[]) {
  const user = await requireUser("/admin");
  const admin = createAdminClient();
  const { data } = await admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!data || (allowed && !allowed.includes(data.role as StaffRole))) redirect("/account");
  const supabase = await createClient();
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") redirect("/account/security?next=/admin");
  return { user, role: data.role as StaffRole };
}
