import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { getMyOrderById, requireUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Thank You", robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  await requireUser("/thank-you");
  const { order: orderId } = await searchParams;
  const order = orderId ? await getMyOrderById(orderId) : null;
  return <section className="bg-ivory px-4 sm:px-6 pb-20 sm:pb-24 pt-24 sm:pt-36"><div className="mx-auto max-w-xl rounded-2xl sm:rounded-[30px] border border-parchment bg-white p-6 text-center shadow-xl sm:p-12">
    <CheckCircle2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
    <p className="mt-4 sm:mt-6 eyebrow text-gold-dark">Payment confirmed</p>
    <h1 className="mt-3 sm:mt-4 font-display text-3xl sm:text-5xl font-bold text-charcoal">Thank you</h1>
    <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">Your payment has been securely verified. We&apos;ll continue fulfilment using the contact details on your account.</p>
    {order ? <div className="mt-5 sm:mt-7 rounded-2xl bg-ivory p-4 sm:p-5 text-left"><p className="flex items-center gap-2 font-semibold text-charcoal"><PackageCheck className="h-5 w-5 text-gold-dark" />{order.item_title}</p><p className="mt-2 font-mono text-xs text-warmgray">Order {order.id.slice(0, 8).toUpperCase()}</p></div> : <p className="mt-4 sm:mt-6 text-sm text-warmgray">Your verified order is available in My Account.</p>}
    <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">{order?.item_type === "healing" && order.item_slug === "distance-healing" && order.payment_status === "paid" ? <Link href={`/distance-healing/${order.id}`} className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white">Submit your photograph</Link> : <Link href="/account" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white">View my account</Link>}<Link href="/account" className="inline-flex min-h-11 items-center rounded-full border border-parchment px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-charcoal">My account</Link></div>
  </div></section>;
}
