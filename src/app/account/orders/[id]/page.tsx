import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, MessageCircle, PackageCheck, Truck, X } from "lucide-react";
import { brand } from "@/lib/data";
import { getCatalogItem } from "@/lib/checkout";
import { formatINR } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyOrderById, requireUser, getShipmentForOrder } from "@/lib/supabase/session";
import type { OrderItemType, OrderStatus } from "@/lib/supabase/database.types";
import RefundRequestForm from "@/components/backend/RefundRequestForm";

export const metadata: Metadata = { title: "Order Details", robots: { index: false, follow: false } };
interface Props { params: Promise<{ id: string }> }

const statusOrder: OrderStatus[] = ["pending", "confirmed", "completed"];
const statusCopy: Record<OrderStatus, { title: string; description: string }> = {
  pending: { title: "Request received", description: "The request is recorded. Continue on WhatsApp so the team can confirm availability, payment, delivery, or scheduling." },
  confirmed: { title: "Confirmed", description: "The team has confirmed the request. Follow the agreed payment, preparation, delivery, or joining instructions." },
  completed: { title: "Completed", description: "The order, course, product fulfilment, or session has been marked complete." },
  cancelled: { title: "Cancelled", description: "This request has been cancelled. Contact support with the reference if you need clarification." },
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  await requireUser(`/account/orders/${id}`);
  if (!isSupabaseConfigured()) notFound();
  const order = await getMyOrderById(id);
  if (!order) notFound();
  const shipment = await getShipmentForOrder(id);
  const item = await getCatalogItem(order.item_type as OrderItemType, order.item_slug);
  const status = order.status as OrderStatus;
  const currentIndex = statusOrder.indexOf(status);
  const supportUrl = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(`Hello Manisha ji, I need help with request ${order.id.slice(0, 8)} for ${order.item_title}.`)}`;

  return <section className="relative overflow-hidden bg-ivory pb-24 pt-32 lg:pt-40"><div className="glow-gold pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px]" /><div className="relative mx-auto max-w-5xl px-6 lg:px-10">
    <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-warmgray hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to My Account</Link>
    <header className="mt-8 flex flex-col gap-5 border-b border-parchment pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-gold-dark">{order.item_type} request</p><h1 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">{order.item_title}</h1><p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-warmgray">Reference {order.id.slice(0, 8)}</p></div><span className={`self-start rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${status === "cancelled" ? "bg-ink/10 text-warmgray" : status === "completed" ? "bg-green-100 text-green-700" : status === "confirmed" ? "bg-primary-soft text-primary" : "bg-gold-soft text-gold-deep"}`}>{status}</span></header>

    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_19rem] lg:gap-16"><div>
      {order.item_type === "healing" && order.item_slug === "distance-healing" && order.payment_status === "paid" ? <Link href={`/distance-healing/${order.id}`} className="mb-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 font-semibold text-white">Open Distance Healing portal</Link> : null}
      {status === "cancelled" ? <div className="flex gap-4 rounded-[24px] border border-parchment bg-white p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/10"><X className="h-5 w-5 text-warmgray" /></span><div><h2 className="font-display text-2xl font-bold text-charcoal">{statusCopy.cancelled.title}</h2><p className="mt-2 leading-7 text-warmgray">{statusCopy.cancelled.description}</p></div></div> : <ol className="space-y-0">{statusOrder.map((step, index) => { const complete = index <= currentIndex; const active = index === currentIndex; return <li key={step} className="grid grid-cols-[2.75rem_1fr] gap-5"><div className="flex flex-col items-center"><span className={`flex h-11 w-11 items-center justify-center rounded-full border ${complete ? "border-gold bg-gold text-primary-deeper" : "border-parchment bg-white text-warmgray"}`}>{complete ? <Check className="h-5 w-5" /> : <Clock3 className="h-4 w-4" />}</span>{index < statusOrder.length - 1 ? <span className={`min-h-20 w-px flex-1 ${index < currentIndex ? "bg-gold" : "bg-parchment"}`} /> : null}</div><div className="pb-10"><h2 className={`font-display text-2xl font-bold ${active ? "text-primary" : "text-charcoal"}`}>{statusCopy[step].title}</h2><p className="mt-2 max-w-2xl leading-7 text-warmgray">{statusCopy[step].description}</p></div></li>; })}</ol>}
    </div><aside><div className="rounded-[24px] border border-parchment bg-white p-6"><PackageCheck className="h-6 w-6 text-gold-dark" /><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-warmgray">Payment status</dt><dd className="mt-1 font-semibold capitalize text-charcoal">{order.payment_status ?? "—"}</dd></div><div><dt className="text-warmgray">Fulfilment</dt><dd className="mt-1 font-semibold capitalize text-charcoal">{order.fulfillment_status ?? "—"}</dd></div><div><dt className="text-warmgray">Created</dt><dd className="mt-1 font-semibold text-charcoal">{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd></div><div><dt className="text-warmgray">Amount</dt><dd className="mt-1 font-semibold text-charcoal">{order.amount ? formatINR(order.amount) : "Confirmed separately"}</dd></div><div><dt className="text-warmgray">Currency</dt><dd className="mt-1 font-semibold text-charcoal">{order.currency}</dd></div></dl>{item ? <Link href={item.href} className="mt-6 inline-flex text-sm font-semibold text-primary underline underline-offset-4">View offering</Link> : null}</div>
      {shipment ? <div className="mt-4 rounded-[24px] border border-parchment bg-white p-6"><Truck className="h-6 w-6 text-gold-dark" /><div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="font-display text-lg font-bold text-charcoal">Tracking</p><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">{shipment.status.replace("_", " ")}</span></div><dl className="mt-4 space-y-3 text-sm">{shipment.carrier ? <div><dt className="text-warmgray">Carrier</dt><dd className="mt-1 font-semibold text-charcoal">{shipment.carrier}</dd></div> : null}{shipment.tracking_number ? <div><dt className="text-warmgray">Tracking number</dt><dd className="mt-1 font-mono text-xs font-semibold text-charcoal">{shipment.tracking_number}</dd></div> : null}</dl>{shipment.tracking_url ? <a href={shipment.tracking_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:brightness-110">Track your parcel</a> : null}</div> : null}
      <a href={supportUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" />Get support</a><Link href="/refund-cancellation-policy" className="mt-4 block text-center text-xs text-warmgray hover:text-primary">Refund &amp; cancellation policy</Link><RefundRequestForm orderId={order.id} /></aside></div>
  </div></section>;
}
