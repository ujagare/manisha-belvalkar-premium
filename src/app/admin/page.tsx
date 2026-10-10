import Link from "next/link";
import { requireStaff } from "@/lib/supabase/staff";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Operations", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { role } = await requireStaff();
  const admin = createAdminClient();
  const resources = ["orders", "bookings", "payments", "enquiries", "event_registrations", "course_enrollments", "distance_healing_cases"] as const;
  const counts = await Promise.all(resources.map(async (resource) => {
    const { count } = await admin.from(resource).select("id", { count: "exact", head: true });
    return [resource, count ?? 0] as const;
  }));
  return <section className="bg-ivory px-6 pb-24 pt-36"><div className="mx-auto max-w-6xl"><p className="eyebrow text-gold-dark">Private operations · {role}</p><h1 className="mt-4 font-display text-5xl font-bold text-charcoal">Backend overview</h1><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{counts.map(([name, count]) => name === "distance_healing_cases" ? <Link href="/admin/distance-healing" key={name} className="rounded-2xl border border-gold/40 bg-white p-6 transition hover:border-gold"><p className="text-sm text-warmgray">Distance Healing queue</p><p className="mt-2 font-display text-4xl font-bold text-primary">{count}</p><p className="mt-3 text-xs font-semibold text-primary">Open workflow →</p></Link> : <article key={name} className="rounded-2xl border border-parchment bg-white p-6"><p className="text-sm capitalize text-warmgray">{name.replaceAll("_", " ")}</p><p className="mt-2 font-display text-4xl font-bold text-primary">{count}</p></article>)}</div></div></section>;
}
