import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getMyOrders } from "@/lib/supabase/session";
import { formatINR } from "@/lib/utils";
import SignOutButton from "@/components/account/SignOutButton";

export const metadata: Metadata = {
  title: "My account",
  description: "Your profile, orders and activity with Manisha Belvalkar.",
  robots: { index: false, follow: false },
};

const shortcuts = [
  {
    href: "/account/addresses",
    icon: MapPin,
    title: "Addresses",
    copy: "Saved shipping locations",
  },
  {
    href: "/account/courses",
    icon: BookOpen,
    title: "My courses",
    copy: "Enrolled lessons",
  },
  {
    href: "/account/bookings",
    icon: CalendarDays,
    title: "Bookings",
    copy: "Healing & mentoring",
  },
  {
    href: "/track-order",
    icon: Truck,
    title: "Track parcels",
    copy: "Live Shiprocket AWB",
  },
] as const;

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const configured = isSupabaseConfigured();
  const orders = configured ? await getMyOrders(20) : [];

  const name = user.fullName ?? user.email?.split("@")[0] ?? "Account";
  const email = user.email ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <section className="min-h-[100dvh] bg-ivory pb-20 pt-20 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* Account header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:rounded-2xl sm:p-6">
          <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal font-display text-lg font-medium text-ivory sm:h-14 sm:w-14 sm:text-xl">
              {initial}
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-medium tracking-[-0.015em] text-charcoal sm:text-3xl">
                {name}
              </h1>
              <p className="mt-0.5 truncate text-xs text-warmgray sm:text-sm">{email}</p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-warmgray/80 sm:mt-1 sm:text-xs">
                Member since{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          <SignOutButton />
        </header>

        {/* Compact 2x2 shortcut grid on mobile & desktop */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4">
          {shortcuts.map(({ href, icon: Icon, title, copy }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between gap-2 rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-3.5 transition-colors duration-150 hover:border-charcoal/25 hover:bg-white sm:flex-row sm:items-start sm:rounded-2xl sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                <Icon className="h-4 w-4 shrink-0 text-warmgray sm:mt-0.5" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal">{title}</p>
                  <p className="mt-0.5 text-xs text-warmgray sm:mt-1 sm:text-sm">{copy}</p>
                </div>
              </div>
              <ArrowRight
                className="hidden h-4 w-4 shrink-0 text-warmgray transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-charcoal sm:mt-0.5 sm:block"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </div>

        {/* Orders list */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-baseline justify-between gap-4 border-b border-charcoal/10 pb-3 sm:pb-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-medium text-charcoal sm:gap-2.5 sm:text-2xl">
              <Package className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
              Orders and bookings
            </h2>
            <span className="font-mono text-xs tabular-nums text-warmgray">
              {orders.length} {orders.length === 1 ? "record" : "records"}
            </span>
          </div>

          {!configured ? (
            <div className="mt-4 rounded-xl border border-charcoal/12 bg-white p-4 text-sm text-warmgray sm:mt-6 sm:p-5">
              Supabase configuration is pending. Update <code className="font-mono text-charcoal">.env.local</code> using AUTH_SETUP.md to view recorded orders.
            </div>
          ) : orders.length ? (
            <div className="mt-3 divide-y divide-charcoal/8 overflow-hidden rounded-xl border border-charcoal/10 bg-[#fdfbf7] sm:mt-4 sm:rounded-2xl">
              {orders.map((order) => {
                const statusColor =
                  order.status === "completed"
                    ? "text-[#16a34a]"
                    : order.status === "confirmed"
                      ? "text-primary"
                      : "text-warmgray";

                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-white sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{order.item_title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-warmgray">
                        <span className="capitalize">{order.item_type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className="hidden sm:inline" aria-hidden="true">·</span>
                        <span className="hidden items-center gap-1 tabular-nums sm:inline-flex">
                          <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-6">
                      {order.amount ? (
                        <span className="font-mono text-sm font-medium tabular-nums text-charcoal">
                          {formatINR(order.amount)}
                        </span>
                      ) : null}
                      <span className={`text-xs font-medium capitalize sm:min-w-20 sm:text-right ${statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-8 text-center sm:mt-6 sm:rounded-2xl sm:p-10">
              <p className="text-sm text-warmgray">No orders recorded yet.</p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-dark"
              >
                Browse shop
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
