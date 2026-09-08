import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Package } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getMyOrders } from "@/lib/supabase/session";
import { formatINR } from "@/lib/utils";
import SignOutButton from "@/components/account/SignOutButton";

export const metadata: Metadata = {
  title: "My account",
  description: "Your profile, orders and activity with Manisha Belvalkar.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const configured = isSupabaseConfigured();
  const orders = configured ? await getMyOrders(20) : [];

  const name = user.fullName ?? user.email?.split("@")[0] ?? "Seeker";
  const email = user.email ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <section className="relative overflow-hidden bg-ivory pb-20 pt-32 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        {/* Profile card */}
        <div className="relative flex flex-wrap items-start gap-6 overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] sm:items-center sm:gap-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white shadow-lg shadow-primary/25 ring-2 ring-gold/40">
            {initial}
          </div>
          <div className="relative flex-1">
            <h1 className="font-display text-3xl font-bold text-charcoal">
              Namaste, {name} 🙏
            </h1>
            <p className="mt-1 text-sm text-warmgray">{email}</p>
            <p className="mt-1 text-xs text-warmgray/70">
              Joined{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <SignOutButton />
        </div>

        {/* Orders */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-charcoal">
            <Package className="mr-2 inline h-5 w-5 text-gold" />
            Orders &amp; bookings
          </h2>

          {!configured ? (
            <div className="mt-6 rounded-2xl border border-gold/40 bg-gold-soft p-5 text-sm text-gold-deep">
              <strong>Setup pending:</strong> Supabase keys abhi placeholders hain. AUTH_SETUP.md mein
              steps follow karke .env.local update karein — tab orders dikhenge.
            </div>
          ) : orders.length ? (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-5 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] transition-all duration-500 hover:border-gold/50 hover:shadow-[0_20px_45px_-25px_rgba(221,184,41,0.4)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-charcoal">{order.item_title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-warmgray">
                      <span className="rounded-full bg-ink/10 px-2.5 py-0.5 font-semibold uppercase tracking-wider">
                        {order.item_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {order.amount ? (
                      <span className="font-display text-lg font-bold text-primary">
                        {formatINR(order.amount)}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        order.status === "pending"
                          ? "bg-gold-soft text-gold-deep"
                          : order.status === "confirmed"
                            ? "bg-primary-soft text-primary"
                            : order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-ink/10 text-warmgray"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-parchment bg-white p-10 text-center">
              <p className="text-warmgray">No orders yet.</p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                Browse services →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}