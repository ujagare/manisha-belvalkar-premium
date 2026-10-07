import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/session";
import MfaSetup from "@/components/account/MfaSetup";

export const metadata: Metadata = { title: "Account Security", robots: { index: false, follow: false } };

export default async function AccountSecurityPage() {
  await requireUser("/account/security");
  return <section className="bg-ivory px-6 pb-24 pt-36"><div className="mx-auto max-w-2xl"><p className="eyebrow text-gold-dark">Account security</p><h1 className="mt-4 mb-9 font-display text-5xl font-bold text-charcoal">Two-step verification</h1><MfaSetup /></div></section>;
}
