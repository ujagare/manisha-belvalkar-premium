import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/session";
import DailySessionRoom from "@/components/bookings/DailySessionRoom";

export const metadata = {
  title: "Private Online Session Room",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function BookingVideoRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/account/bookings/${id}/room`);
  const admin = createAdminClient();

  const [{ data: booking }, { data: staffRow }] = await Promise.all([
    admin
      .from("bookings")
      .select("id,user_id,offering_type,offering_slug,format,requested_start,status")
      .eq("id", id)
      .maybeSingle(),
    admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle(),
  ]);

  const isStaff = Boolean(staffRow?.role);
  if (!booking || (!isStaff && booking.user_id !== user.id) || booking.format !== "online") {
    notFound();
  }

  const title = booking.offering_slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (ch: string) => ch.toUpperCase());

  return (
    <main className="min-h-[100dvh] bg-ivory px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <DailySessionRoom
          bookingId={booking.id}
          offeringTitle={title}
          startsAtIso={booking.requested_start}
          status={booking.status}
        />
      </div>
    </main>
  );
}
