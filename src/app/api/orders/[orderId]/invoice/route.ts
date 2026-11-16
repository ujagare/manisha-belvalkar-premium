import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";
import { constantTimeEqualHex } from "@/lib/security";
import { escapeHtml, formatINR } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ orderId: string }>;
}

/**
 * Signed link token for a guest invoice.
 *
 * A guest order has no session to authenticate with, so the invoice URL carries
 * an HMAC over the order id. Dummy values keep every order id producing the
 * same token shape even when the secret is missing.
 */
export function invoiceToken(orderId: string): string | null {
  const secret = serverEnv.invoiceLinkSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`invoice:${orderId}`).digest("hex").slice(0, 32);
}

function tokenMatches(orderId: string, provided: string | null): boolean {
  const expected = invoiceToken(orderId);
  if (!expected || !provided) return false;
  return constantTimeEqualHex(expected, provided);
}

export async function GET(request: Request, { params }: Params) {
  const { orderId } = await params;
  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) {
    return new Response("Invalid order ID", { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select("*, addresses(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    return new Response("Invoice not found", { status: 404 });
  }

  // Authorisation:
  //  - the signed-in owner may always open their own invoice;
  //  - a guest order may only be opened with the signed link token that was
  //    emailed to the customer. Knowing the order id is NOT sufficient, because
  //    the invoice exposes the customer's name, email and postal address.
  const isOwner = Boolean(user && order.user_id === user.id);
  const providedToken = new URL(request.url).searchParams.get("token");
  const isSignedGuest = !order.user_id && Boolean(order.guest_email) && tokenMatches(order.id, providedToken);
  if (!isOwner && !isSignedGuest) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  const address = (order as { addresses?: Record<string, string | null> | null }).addresses ?? null;
  const invoiceNumber = order.invoice_number ?? `INV-PENDING-${order.id.slice(0, 8).toUpperCase()}`;
  const invoiceDate = new Date(order.invoice_date ?? order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const customerName = order.guest_name ?? user?.user_metadata?.name ?? order.guest_email?.split("@")[0] ?? "Valued Customer";
  const customerEmail = order.guest_email ?? user?.email ?? "—";
  const placeOfSupply = address?.state ? `${address.state} (India)` : "Maharashtra (27)";

  const subtotal = order.subtotal_subunits != null ? order.subtotal_subunits / 100 : (order.amount ?? 0);
  const cgst = (order.cgst_subunits ?? 0) / 100;
  const sgst = (order.sgst_subunits ?? 0) / 100;
  const igst = (order.igst_subunits ?? 0) / 100;
  const grandTotal = order.amount_subunits != null ? order.amount_subunits / 100 : (order.amount ?? 0);
  const gstin = serverEnv.sellerGstin();

  // Every value below that originates from a customer is escaped. Unescaped
  // interpolation here would be stored XSS: names and addresses are accepted at
  // checkout and rendered straight back into this document.
  const rows = (items ?? []).map((item, index) => {
    const unitRate = item.unit_amount_subunits ? item.unit_amount_subunits / 100 : 0;
    const qty = item.quantity || 1;
    const itemTax = (item.tax_subunits ?? 0) / 100;
    const lineTotal = unitRate * qty;
    const taxable = lineTotal - itemTax;
    return `<tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(item.title)}</strong><br><span style="font-size: 11px; color: #64748b;">${escapeHtml(item.item_slug)}</span></td>
            <td>${escapeHtml(item.hsn_sac_code ?? "999799")}</td>
            <td class="text-right">${qty}</td>
            <td class="text-right">${formatINR(unitRate)}</td>
            <td class="text-right">${formatINR(taxable)}</td>
            <td class="text-right">${escapeHtml(item.tax_rate ?? 18)}%</td>
            <td class="text-right"><strong>${formatINR(lineTotal)}</strong></td>
          </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>Tax Invoice - ${escapeHtml(invoiceNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #1e293b; line-height: 1.5; background: #fff; }
    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ca8a04; padding-bottom: 20px; margin-bottom: 20px; }
    .brand-title { font-size: 24px; font-weight: 700; color: #854d0e; margin: 0; }
    .invoice-title { font-size: 20px; font-weight: 700; color: #0f172a; text-align: right; margin: 0; text-transform: uppercase; }
    .meta-details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
    .section-title { font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 12px; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 12px 10px; text-align: left; font-size: 13px; font-weight: 600; color: #475569; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .text-right { text-align: right; }
    .summary-table { width: 320px; margin-left: auto; margin-bottom: 30px; }
    .summary-table td { padding: 6px 10px; }
    .total-row { font-weight: 700; font-size: 16px; border-top: 2px solid #ca8a04; color: #0f172a; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    @media print {
      body { padding: 0; }
      .invoice-box { border: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="no-print" style="text-align: right; margin-bottom: 20px;">
      <button onclick="window.print()" style="background: #ca8a04; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
    </div>
    <div class="header">
      <div>
        <h1 class="brand-title">Dr. Manisha S. Belvalkar</h1>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Spiritual Mentorship &amp; Sacred Products</div>
        <div style="font-size: 12px; color: #64748b;">Pune &amp; Mumbai, Maharashtra, India</div>
        <div style="font-size: 12px; color: #64748b;">State: Maharashtra | State Code: 27</div>
        ${gstin ? `<div style="font-size: 12px; color: #64748b;">GSTIN: ${escapeHtml(gstin)}</div>` : ""}
      </div>
      <div>
        <h2 class="invoice-title">Tax Invoice</h2>
        <div style="font-size: 14px; font-weight: 600; margin-top: 6px;">${escapeHtml(invoiceNumber)}</div>
        <div style="font-size: 13px; color: #64748b;">Date: ${escapeHtml(invoiceDate)}</div>
        <div style="font-size: 12px; color: #64748b;">Place of Supply: ${escapeHtml(placeOfSupply)}</div>
      </div>
    </div>

    <div class="meta-details">
      <div>
        <div class="section-title">Billed To</div>
        <div style="font-weight: 600;">${escapeHtml(customerName)}</div>
        <div>Email: ${escapeHtml(customerEmail)}</div>
        ${address ? `<div>${escapeHtml(address.line1)}${address.line2 ? `, ${escapeHtml(address.line2)}` : ""}</div>
        <div>${escapeHtml(address.city)}, ${escapeHtml(address.state)} - ${escapeHtml(address.postal_code)}</div>` : ""}
      </div>
      <div style="text-align: right;">
        <div class="section-title">Order Reference</div>
        <div>Order ID: ${escapeHtml(order.id.slice(0, 8).toUpperCase())}</div>
        <div>Payment Status: <strong style="color: #16a34a; text-transform: uppercase;">${escapeHtml(order.payment_status)}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th>HSN / SAC</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit Rate</th>
          <th class="text-right">Taxable Amt</th>
          <th class="text-right">GST %</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <table class="summary-table">
      <tr>
        <td>Taxable Amount:</td>
        <td class="text-right">${formatINR(subtotal)}</td>
      </tr>
      ${cgst > 0 ? `<tr>
        <td>CGST:</td>
        <td class="text-right">${formatINR(cgst)}</td>
      </tr>` : ""}
      ${sgst > 0 ? `<tr>
        <td>SGST:</td>
        <td class="text-right">${formatINR(sgst)}</td>
      </tr>` : ""}
      ${igst > 0 ? `<tr>
        <td>IGST:</td>
        <td class="text-right">${formatINR(igst)}</td>
      </tr>` : ""}
      <tr class="total-row">
        <td>Total Paid:</td>
        <td class="text-right">${formatINR(grandTotal)}</td>
      </tr>
    </table>

    <div class="footer">
      This is a computer-generated tax invoice. No signature is required.<br>
      Thank you for your trust in our sacred offerings and mentorship.
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Never let a shared or CDN cache hold one customer's invoice.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
