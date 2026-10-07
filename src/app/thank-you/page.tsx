import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { getMyOrderById, requireUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Thank You", robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  await requireUser("/thank-you");
  const { order: orderId } = await searchParams;
  const order = orderId ? await getMyOrderById(orderId) : null;
  return <section className="bg-ivory px-6 pb-24 pt-36"><div className="mx-auto max-w-xl rounded-[30px] border border-parchment bg-white p-9 text-center shadow-xl sm:p-12">
    <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
    <p className="mt-6 eyebrow text-gold-dark">Payment confirmed</p>
    <h1 className="mt-4 font-display text-5xl font-bold text-charcoal">Thank you</h1>
    <p className="mt-5 leading-7 text-warmgray">Your payment has been securely verified. We&apos;ll continue fulfilment using the contact details on your account.</p>
    {order ? <div className="mt-7 rounded-2xl bg-ivory p-5 text-left"><p className="flex items-center gap-2 font-semibold text-charcoal"><PackageCheck className="h-5 w-5 text-gold-dark" />{order.item_title}</p><p className="mt-2 font-mono text-xs text-warmgray">Order {order.id.slice(0, 8).toUpperCase()}</p></div> : <p className="mt-6 text-sm text-warmgray">Your verified order is available in My Account.</p>}
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/account" className="rounded-full bg-primary px-7 py-3 font-semibold text-white">View my account</Link><Link href="/products" className="rounded-full border border-parchment px-7 py-3 font-semibold text-charcoal">Continue shopping</Link></div>
  </div></section>;
}
