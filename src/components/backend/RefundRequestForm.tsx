"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function RefundRequestForm({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false); const [reason, setReason] = useState(""); const [result, setResult] = useState<string | null>(null); const [pending, startTransition] = useTransition();
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="mt-4 block w-full text-center text-xs font-semibold text-primary underline underline-offset-4">Request a refund</button>;
  return <form onSubmit={(event) => { event.preventDefault(); startTransition(async () => { const response = await fetch("/api/refunds/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, reason }) }); const data = await response.json().catch(() => null); setResult(response.ok ? `Refund request received · ${data.refund.id.slice(0, 8).toUpperCase()}` : data?.error?.message ?? "Could not request refund."); }); }} className="mt-5 rounded-2xl border border-parchment bg-white p-4"><textarea required maxLength={1500} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for your request" className="w-full rounded-xl border border-parchment px-3 py-2 text-sm" />{result ? <p className="mt-3 text-xs text-primary" role="status">{result}</p> : null}<button disabled={pending} className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}{pending ? "Sending…" : "Submit request"}</button></form>;
}
