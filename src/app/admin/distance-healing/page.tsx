import Link from "next/link";
import { requireStaff } from "@/lib/supabase/staff";
import { createAdminClient } from "@/lib/supabase/admin";
import { distanceHealingReference } from "@/lib/distance-healing";
import DistanceHealingCaseForm from "@/components/admin/DistanceHealingCaseForm";
import DistanceHealingPriceForm from "@/components/admin/DistanceHealingPriceForm";

export const metadata = { title: "Distance Healing Operations", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DistanceHealingAdminPage() {
  await requireStaff(["owner", "admin", "booking_manager"]);
  const admin = createAdminClient();
  const [{ data: cases }, { data: offering }] = await Promise.all([admin.from("distance_healing_cases").select("*").order("created_at", { ascending: false }).limit(100), admin.from("offerings").select("amount_subunits").eq("type", "healing").eq("slug", "distance-healing").maybeSingle()]);
  return <main className="min-h-screen bg-ivory px-6 pb-24 pt-32"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-gold-deep">Private operations</p><h1 className="mt-4 font-display text-4xl font-semibold text-charcoal sm:text-5xl">Distance Healing queue</h1></div><Link href="/admin" className="text-sm font-semibold text-primary">Back to operations</Link></div><DistanceHealingPriceForm initialPrice={offering?.amount_subunits ? offering.amount_subunits / 100 : null} /><div className="mt-10 grid gap-5 lg:grid-cols-2">{cases?.length ? cases.map((item) => <article key={item.id} className="rounded-3xl border border-parchment bg-white p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-warmgray">{distanceHealingReference(item.order_id)}</p><p className="mt-2 text-sm font-semibold capitalize text-charcoal">{item.submission_method ?? "Awaiting method"}</p></div><span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold capitalize text-primary">{item.status.replaceAll("_", " ")}</span></div><p className="mt-4 text-sm leading-6 text-warmgray">{item.intention ?? "No intention submitted yet."}</p><DistanceHealingCaseForm caseId={item.id} initialStatus={item.status} initialNotes={item.staff_notes} /></article>) : <p className="text-warmgray">No Distance Healing cases yet.</p>}</div></div></main>;
}
