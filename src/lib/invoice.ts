import "server-only";
import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentFinancialYear } from "@/lib/gst";
import { serverEnv } from "@/lib/env";

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Signed link token for a guest invoice.
 * A guest order has no session to authenticate with, so the invoice URL carries
 * an HMAC over the order id.
 */
export function orderInvoiceToken(orderId: string): string | null {
  const secret = serverEnv.invoiceLinkSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`invoice:${orderId}`).digest("hex").slice(0, 32);
}


/**
 * Generates and assigns a sequential Tax Invoice number for a confirmed order.
 * Format: INV/2026-27/00001
 */
export async function assignOrderInvoiceNumber(
  admin: AdminClient,
  orderId: string
): Promise<string | null> {
  // Check if invoice already generated
  const { data: existing } = await admin
    .from("orders")
    .select("invoice_number,invoice_date")
    .eq("id", orderId)
    .maybeSingle();

  if (existing?.invoice_number) {
    return existing.invoice_number;
  }

  const fy = getCurrentFinancialYear();
  let invoiceNumber: string | null = null;

  try {
    // Attempt atomic Postgres RPC
    const { data, error } = await (admin.rpc as any)("next_invoice_number", { fy });
    if (!error && typeof data === "string") {
      invoiceNumber = data;
    }
  } catch (err) {
    console.warn("[invoice] next_invoice_number RPC unavailable, using fallback:", err);
  }

  // Fallback if RPC is not available in local mock
  if (!invoiceNumber) {
    const { data: seqRow } = await admin
      .from("invoice_sequences")
      .select("last_number")
      .eq("financial_year", fy)
      .maybeSingle();

    const nextSeq = (seqRow?.last_number ?? 0) + 1;
    await admin.from("invoice_sequences").upsert({
      financial_year: fy,
      last_number: nextSeq,
      updated_at: new Date().toISOString(),
    });

    invoiceNumber = `INV/${fy}/${String(nextSeq).padStart(5, "0")}`;
  }

  const invoiceDate = new Date().toISOString();

  await admin
    .from("orders")
    .update({
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      updated_at: invoiceDate,
    })
    .eq("id", orderId);

  return invoiceNumber;
}
