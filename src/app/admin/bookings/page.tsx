import Link from "next/link";
import { requireStaff } from "@/lib/supabase/staff";
import { createAdminClient } from "@/lib/supabase/admin";
import BookingOperationsCard from "@/components/admin/BookingOperationsCard";

export const metadata = {
  title: "Live Sessions & Bookings · Operations",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function BookingsAdminPage() {
  await requireStaff(["owner", "admin", "booking_manager", "support"]);
  const admin = createAdminClient();

  const { data: bookings } = await admin
    .from("bookings")
    .select("*")
    .order("requested_start", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(100);

  const list = bookings ?? [];
  const userIds = [...new Set(list.map((b) => b.user_id).filter(Boolean))];
  const orderIds = [...new Set(list.map((b) => b.order_id).filter((id): id is string => Boolean(id)))];

  const [profilesRes, ordersRes] = await Promise.all([
    userIds.length
      ? admin.from("profiles").select("id, full_name, email").in("id", userIds)
      : Promise.resolve({ data: [] as Array<{ id: string; full_name: string | null; email: string | null }> }),
    orderIds.length
      ? admin.from("orders").select("id, guest_name, guest_email, item_title").in("id", orderIds)
      : Promise.resolve({ data: [] as Array<{ id: string; guest_name: string | null; guest_email: string | null; item_title: string }> }),
  ]);

  const profileById = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
  const orderById = new Map((ordersRes.data ?? []).map((o) => [o.id, o]));

  const summary = {
    confirmed: list.filter((b) => b.status === "confirmed").length,
    completed: list.filter((b) => b.status === "completed").length,
    pending: list.filter((b) => ["requested", "payment_pending"].includes(b.status)).length,
  };

  return (
    <main className="min-h-[100dvh] bg-ivory px-4 pb-24 pt-20 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-deep">Private operations</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:mt-4 sm:text-5xl">
              Live Sessions &amp; Aftercare Desk
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-warmgray">
              Join private 1:1 Daily.co video sessions as Host, track attendance, mark sessions complete, and send personalized post-session aftercare notes.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-primary"
          >
            Back to operations
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:max-w-xl sm:gap-4">
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Confirmed</p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">{summary.confirmed}</p>
          </div>
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Completed</p>
            <p className="mt-1 font-display text-2xl font-bold text-charcoal">{summary.completed}</p>
          </div>
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Pending</p>
            <p className="mt-1 font-display text-2xl font-bold text-charcoal">{summary.pending}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
          {list.length ? (
            list.map((item) => {
              const profile = profileById.get(item.user_id);
              const order = item.order_id ? orderById.get(item.order_id) : undefined;
              const clientEmail = profile?.email ?? order?.guest_email ?? null;
              const clientName =
                profile?.full_name ??
                order?.guest_name ??
                clientEmail?.split("@")[0] ??
                "Client";
              const offeringTitle =
                order?.item_title ??
                item.offering_slug.replace(/-/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase());

              return (
                <BookingOperationsCard
                  key={item.id}
                  bookingId={item.id}
                  offeringTitle={offeringTitle}
                  clientName={clientName}
                  clientEmail={clientEmail}
                  format={item.format}
                  startsAtIso={item.requested_start}
                  initialStatus={item.status}
                  clientIntention={item.notes}
                  initialAftercareNotes={item.aftercare_notes ?? null}
                  aftercareSentAt={item.aftercare_sent_at ?? null}
                  clientJoinedAt={item.client_joined_at}
                  hostJoinedAt={item.host_joined_at}
                />
              );
            })
          ) : (
            <p className="text-warmgray">No session bookings recorded yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
