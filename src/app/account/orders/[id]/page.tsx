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
import ShipmentTracker from "@/components/shipping/ShipmentTracker";
import { mapShiprocketStatus, normalizeTrackingScans, shiprocketTrackingUrl } from "@/lib/shiprocket-utils";

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
  const orderRef = order.id.slice(0, 8).toUpperCase();
  const supportUrl = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(`Hello Manisha ji, I need help with order ${orderRef} for ${order.item_title}.`)}`;

  const showShipmentTracker = order.item_type === "product" || Boolean(shipment);
  const shipmentMapped = shipment
    ? mapShiprocketStatus(shipment.current_status_id, shipment.current_status ?? shipment.status)
    : mapShiprocketStatus(null, status === "cancelled" ? "cancelled" : "pending");

  const activeAwb = shipment?.awb_code ?? shipment?.tracking_number ?? null;

  return (
    <section className="relative overflow-hidden bg-ivory pb-24 pt-20 sm:pt-32 lg:pt-40">
      <div className="glow-gold pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <Link href="/account" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-warmgray hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to My Account
        </Link>

        <header className="mt-5 sm:mt-8 flex flex-col gap-4 sm:gap-5 border-b border-parchment pb-6 sm:pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold-dark">{order.item_type} order</p>
            <h1 className="mt-2 sm:mt-3 font-display text-2xl font-bold text-charcoal sm:text-5xl">{order.item_title}</h1>
            <p className="mt-2 sm:mt-3 font-mono text-xs uppercase tracking-[0.15em] text-warmgray">Reference {orderRef}</p>
          </div>
          <span className={`self-start rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${status === "cancelled" ? "bg-ink/10 text-warmgray" : status === "completed" ? "bg-green-100 text-green-700" : status === "confirmed" ? "bg-primary-soft text-primary" : "bg-gold-soft text-gold-deep"}`}>
            {status}
          </span>
        </header>

        <div className="mt-7 sm:mt-10 grid gap-8 sm:gap-10 lg:grid-cols-[1fr_19rem] lg:gap-12">
          <div className="space-y-8">
            {order.item_type === "healing" && order.item_slug === "distance-healing" && order.payment_status === "paid" ? (
              <Link href={`/distance-healing/${order.id}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-white">
                Open Distance Healing portal
              </Link>
            ) : null}

            {showShipmentTracker ? (
              <ShipmentTracker
                shipment={{
                  orderRef,
                  itemTitle: order.item_title,
                  status: shipment?.status ?? (status === "cancelled" ? "cancelled" : "pending"),
                  statusLabel: shipmentMapped.label,
                  currentStatus: shipment?.current_status ?? (order.payment_status === "paid" ? "Order Confirmed — Preparing Dispatch" : "Awaiting Confirmation"),
                  carrier: shipment?.carrier ?? null,
                  awbCode: activeAwb,
                  trackingUrl: shipment?.tracking_url ?? shiprocketTrackingUrl(activeAwb),
                  etd: shipment?.etd ?? null,
                  shippedAt: shipment?.shipped_at ?? null,
                  deliveredAt: shipment?.delivered_at ?? null,
                  pickupScheduledDate: shipment?.pickup_scheduled_date ?? null,
                  lastLocation: shipment?.last_location ?? null,
                  lastSyncedAt: shipment?.last_synced_at ?? null,
                  rtoReason: shipment?.rto_reason ?? null,
                  scans: normalizeTrackingScans(shipment?.tracking_events),
                }}
              />
            ) : status === "cancelled" ? (
              <div className="flex gap-4 rounded-2xl sm:rounded-[24px] border border-parchment bg-white p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/10">
                  <X className="h-5 w-5 text-warmgray" />
                </span>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal">{statusCopy.cancelled.title}</h2>
                  <p className="mt-2 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">{statusCopy.cancelled.description}</p>
                </div>
              </div>
            ) : (
              <ol className="space-y-0">
                {statusOrder.map((step, index) => {
                  const complete = index <= currentIndex;
                  const active = index === currentIndex;
                  return (
                    <li key={step} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.75rem_1fr] gap-4 sm:gap-5">
                      <div className="flex flex-col items-center">
                        <span className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border ${complete ? "border-gold bg-gold text-primary-deeper" : "border-parchment bg-white text-warmgray"}`}>
                          {complete ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Clock3 className="h-4 w-4" />}
                        </span>
                        {index < statusOrder.length - 1 ? <span className={`min-h-14 sm:min-h-20 w-px flex-1 ${index < currentIndex ? "bg-gold" : "bg-parchment"}`} /> : null}
                      </div>
                      <div className="pb-7 sm:pb-10">
                        <h2 className={`font-display text-xl sm:text-2xl font-bold ${active ? "text-primary" : "text-charcoal"}`}>{statusCopy[step].title}</h2>
                        <p className="mt-1.5 sm:mt-2 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">{statusCopy[step].description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <aside>
            <div className="rounded-2xl sm:rounded-[24px] border border-parchment bg-white p-5 sm:p-6">
              <PackageCheck className="h-6 w-6 text-gold-dark" />
              <dl className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-sm">
                <div>
                  <dt className="text-warmgray">Payment status</dt>
                  <dd className="mt-1 font-semibold capitalize text-charcoal">{order.payment_status ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-warmgray">Fulfilment</dt>
                  <dd className="mt-1 font-semibold capitalize text-charcoal">{order.fulfillment_status ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-warmgray">Created</dt>
                  <dd className="mt-1 font-semibold text-charcoal">
                    {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </dd>
                </div>
                <div>
                  <dt className="text-warmgray">Amount</dt>
                  <dd className="mt-1 font-semibold text-charcoal">{order.amount ? formatINR(order.amount) : "Confirmed separately"}</dd>
                </div>
                <div>
                  <dt className="text-warmgray">Currency</dt>
                  <dd className="mt-1 font-semibold text-charcoal">{order.currency}</dd>
                </div>
              </dl>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                {item ? (
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-sm font-semibold text-primary underline underline-offset-4">
                    View offering
                  </Link>
                ) : null}
                {order.payment_status === "paid" ? (
                  <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-sm font-semibold text-gold-deep underline underline-offset-4">
                    Tax invoice
                  </a>
                ) : null}
              </div>
            </div>

            {showShipmentTracker ? (
              <Link
                href={activeAwb ? `/track-order?awb=${encodeURIComponent(activeAwb)}` : `/track-order?order=${encodeURIComponent(orderRef)}`}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold-soft/70 px-5 py-3 text-sm font-semibold text-gold-deep transition hover:bg-gold-soft"
              >
                <Truck className="h-4 w-4" />
                Open Public Tracking Page
              </Link>
            ) : null}

            <a href={supportUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
              <MessageCircle className="h-4 w-4" />
              Get support
            </a>
            <Link href="/refund-cancellation-policy" className="mt-4 block py-1 text-center text-xs text-warmgray hover:text-primary">
              Refund &amp; cancellation policy
            </Link>
            <RefundRequestForm orderId={order.id} />
          </aside>
        </div>
      </div>
    </section>
  );
}
