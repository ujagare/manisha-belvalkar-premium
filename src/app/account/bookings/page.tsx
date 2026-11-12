import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyBookings, getCurrentUser } from "@/lib/supabase/session";
import BookingsDashboard from "@/components/account/BookingsDashboard";

export const metadata: Metadata = {
  title: "My Sessions & Bookings",
  robots: { index: false, follow: false },
};

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/bookings");
  const configured = isSupabaseConfigured();
  const bookings = configured ? await getMyBookings(50) : [];

  return (
    <section className="relative overflow-hidden bg-ivory pb-24 pt-20 sm:pt-32 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <Link href="/account" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-warmgray hover:text-primary">
          ← Back to My Account
        </Link>
        <div className="mt-4 sm:mt-6 border-b border-parchment pb-5 sm:pb-6">
          <p className="eyebrow text-gold-dark">Sessions &amp; bookings</p>
          <h1 className="mt-2 sm:mt-3 font-display text-3xl font-bold text-charcoal sm:text-5xl">My Bookings</h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-warmgray">Aapki healing aur mentoring session requests — status, meeting details, reschedule aur cancel ke saath.</p>
        </div>

        {!configured ? (
          <div className="mt-6 sm:mt-8 rounded-2xl border border-gold/40 bg-gold-soft p-4 sm:p-5 text-sm text-gold-deep">
            <strong>Setup pending:</strong> Supabase keys abhi placeholders hain. Connection ke baad aapki bookings yahan dikhengi aur reschedule/cancel kaam karega.
          </div>
        ) : null}

        {bookings.length ? (
          <BookingsDashboard bookings={bookings} />
        ) : (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-parchment bg-white p-8 sm:p-12 text-center">
            <CalendarDays className="mx-auto h-9 w-9 sm:h-10 sm:w-10 text-gold-dark" />
            <p className="mt-3 text-warmgray">Abhi koi booking nahi hai.</p>
            <Link href="/healing" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
              Book a healing session <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
