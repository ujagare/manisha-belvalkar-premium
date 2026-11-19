import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, PackageCheck, Video } from "lucide-react";
import { getMyOrderById, requireUser } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Thank You", robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const user = await requireUser("/thank-you");
  const { order: orderId } = await searchParams;
  const order = orderId ? await getMyOrderById(orderId) : null;

  let booking: { id: string; format: string; requested_start: string | null; status: string } | null = null;
  if (order && isServerConfigured() && ["service", "healing", "mentoring"].includes(order.item_type) && order.item_slug !== "distance-healing") {
    const admin = createAdminClient();
    const { data } = await admin
      .from("bookings")
      .select("id,format,requested_start,status")
      .eq("order_id", order.id)
      .eq("user_id", user.id)
      .maybeSingle();
    booking = data ?? null;
  }

  return (
    <section className="bg-ivory px-4 sm:px-6 pb-20 sm:pb-24 pt-24 sm:pt-36">
      <div className="mx-auto max-w-xl rounded-2xl sm:rounded-[30px] border border-parchment bg-white p-6 text-center shadow-xl sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
        <p className="mt-4 sm:mt-6 eyebrow text-gold-dark">Payment confirmed</p>
        <h1 className="mt-3 sm:mt-4 font-display text-3xl sm:text-5xl font-bold text-charcoal">Thank you</h1>
        <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">
          Your Razorpay payment has been securely verified. A confirmation email with your receipt{booking?.format === "online" ? ", calendar invite (.ics), and private Daily.co video room link" : ""} has been sent to your account email.
        </p>
        {order ? (
          <div className="mt-5 sm:mt-7 rounded-2xl bg-ivory p-4 sm:p-5 text-left">
            <p className="flex items-center gap-2 font-semibold text-charcoal">
              <PackageCheck className="h-5 w-5 text-gold-dark" />{order.item_title}
            </p>
            <p className="mt-2 font-mono text-xs text-warmgray">Order {order.id.slice(0, 8).toUpperCase()}</p>
            {booking?.requested_start ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(booking.requested_start).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                IST ({booking.format === "online" ? "Private Daily.co Room" : booking.format})
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 sm:mt-6 text-sm text-warmgray">Your verified order is available in My Account.</p>
        )}

        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
          {order?.item_type === "healing" && order.item_slug === "distance-healing" && order.payment_status === "paid" ? (
            <Link href={`/distance-healing/${order.id}`} className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white">
              Submit your photograph
            </Link>
          ) : booking && booking.format === "online" && booking.status === "confirmed" ? (
            <Link href={`/account/bookings/${booking.id}/room`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white">
              <Video className="h-4 w-4" /> Open Private Video Room
            </Link>
          ) : (
            <Link href="/account/bookings" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white">
              View my bookings
            </Link>
          )}
          <Link href="/account" className="inline-flex min-h-11 items-center rounded-full border border-parchment px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-charcoal">
            My account
          </Link>
        </div>
      </div>
    </section>
  );
}
