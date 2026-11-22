import Link from "next/link";
import { AlertCircle, CheckCircle2, Truck } from "lucide-react";
import { requireStaff } from "@/lib/supabase/staff";
import { createAdminClient } from "@/lib/supabase/admin";
import { isShiprocketConfigured, serverEnv } from "@/lib/env";
import ShipmentControlCard, {
  type AdminOrderShipmentRow,
} from "@/components/admin/ShipmentControlCard";

export const metadata = {
  title: "Shiprocket Dispatch Desk",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireStaff(["owner", "admin", "catalog_manager", "support"]);
  const { filter = "all" } = await searchParams;
  const admin = createAdminClient();
  const shiprocketReady = isShiprocketConfigured();

  const { data: orders } = await admin
    .from("orders")
    .select(
      "id,user_id,item_type,item_title,amount,currency,status,payment_status,address_id,guest_name,guest_email,created_at",
    )
    .eq("item_type", "product")
    .order("created_at", { ascending: false })
    .limit(100);

  const orderIds = (orders ?? []).map((o) => o.id);
  const addressIds = (orders ?? []).map((o) => o.address_id).filter((id): id is string => Boolean(id));

  const [{ data: shipments }, { data: addresses }] = await Promise.all([
    orderIds.length
      ? admin.from("shipments").select("*").in("order_id", orderIds)
      : Promise.resolve({ data: [] }),
    addressIds.length
      ? admin.from("addresses").select("*").in("id", addressIds)
      : Promise.resolve({ data: [] }),
  ]);

  const shipmentByOrder = new Map((shipments ?? []).map((s) => [s.order_id, s]));
  const addressById = new Map((addresses ?? []).map((a) => [a.id, a]));

  const rows: AdminOrderShipmentRow[] = (orders ?? []).map((order) => {
    const s = shipmentByOrder.get(order.id);
    const addr = order.address_id ? addressById.get(order.address_id) : null;
    const addressText = addr
      ? `${addr.recipient_name}, ${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}, ${addr.city}, ${addr.state} — ${addr.postal_code} (${addr.phone})`
      : "";

    return {
      orderId: order.id,
      orderRef: order.id.slice(0, 8).toUpperCase(),
      itemTitle: order.item_title,
      amount: order.amount,
      currency: order.currency,
      paymentStatus: order.payment_status,
      orderStatus: order.status,
      createdAt: order.created_at,
      customerName: addr?.recipient_name ?? order.guest_name ?? "Customer",
      customerEmail: order.guest_email ?? "—",
      addressText,
      pincode: addr?.postal_code ?? null,
      shipment: s
        ? {
            id: s.id,
            status: s.status,
            currentStatus: s.current_status,
            shiprocketOrderId: s.shiprocket_order_id,
            shiprocketShipmentId: s.shiprocket_shipment_id,
            carrier: s.carrier,
            awbCode: s.awb_code ?? s.tracking_number,
            trackingUrl: s.tracking_url,
            pickupLocation: s.pickup_location,
            pickupScheduledDate: s.pickup_scheduled_date,
            etd: s.etd,
            weightKg: Number(s.weight_kg ?? 0.5),
            lengthCm: Number(s.length_cm ?? 20),
            breadthCm: Number(s.breadth_cm ?? 15),
            heightCm: Number(s.height_cm ?? 6),
            labelUrl: s.label_url,
            manifestUrl: s.manifest_url,
            invoiceUrl: s.invoice_url,
            lastLocation: s.last_location,
          }
        : null,
    };
  });

  const filtered = rows.filter((r) => {
    const st = r.shipment?.status ?? "pending";
    if (filter === "pending") return ["pending", "created", "packed"].includes(st);
    if (filter === "pickup") return ["awb_assigned", "pickup_scheduled"].includes(st);
    if (filter === "transit") return ["shipped", "in_transit", "out_for_delivery"].includes(st);
    if (filter === "delivered") return st === "delivered";
    if (filter === "issues") return ["rto_initiated", "returned", "exception", "cancelled"].includes(st);
    return true;
  });

  const tabs = [
    { key: "all", label: `All (${rows.length})` },
    { key: "pending", label: "Pending Dispatch" },
    { key: "pickup", label: "AWB / Pickup" },
    { key: "transit", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
    { key: "issues", label: "RTO / Issues" },
  ];

  return (
    <main className="min-h-[100dvh] bg-ivory px-4 sm:px-6 pb-24 pt-20 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-2 text-gold-deep">
              <Truck className="h-4 w-4" />
              Private operations · Shiprocket Logistics
            </p>
            <h1 className="mt-3 sm:mt-4 font-display text-3xl font-semibold text-charcoal sm:text-5xl">
              Shipping &amp; Dispatch Desk
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="text-sm font-semibold text-gold-deep hover:underline">
              Public tracker ↗
            </Link>
            <Link href="/admin" className="inline-flex min-h-10 items-center text-sm font-semibold text-primary">
              Back to operations
            </Link>
          </div>
        </div>

        {/* Shiprocket Connection Health Banner */}
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-xs sm:text-sm ${
            shiprocketReady
              ? "border-green-200 bg-green-50/70 text-green-900"
              : "border-gold/50 bg-gold-soft/70 text-gold-deep"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {shiprocketReady ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
            )}
            <div>
              {shiprocketReady ? (
                <p>
                  <strong>Shiprocket API Connected</strong> · Pickup:{" "}
                  <code>{serverEnv.shiprocketPickupLocation()}</code> ({serverEnv.shiprocketPickupPincode()}) ·
                  Webhook: <code>/api/webhooks/shiprocket</code>
                </p>
              ) : (
                <p>
                  <strong>Shiprocket credentials pending:</strong> Add <code>SHIPROCKET_EMAIL</code>,{" "}
                  <code>SHIPROCKET_PASSWORD</code>, and <code>SHIPROCKET_WEBHOOK_TOKEN</code> in{" "}
                  <code>.env.local</code> (see <code>SHIPROCKET_SETUP.md</code>). Manual tracking updates remain available below.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/shipments" : `/admin/shipments?filter=${tab.key}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "border border-parchment bg-white text-warmgray hover:border-gold hover:text-charcoal"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Orders List */}
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((row) => (
              <ShipmentControlCard key={row.orderId} row={row} shiprocketReady={shiprocketReady} />
            ))
          ) : (
            <div className="rounded-2xl border border-parchment bg-white p-10 text-center text-sm text-warmgray lg:col-span-2">
              No physical product orders in this filter yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
