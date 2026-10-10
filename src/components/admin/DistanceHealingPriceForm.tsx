"use client";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function DistanceHealingPriceForm({ initialPrice }: { initialPrice: number | null }) {
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  function save() { setMessage(null); startTransition(async () => { const value = Number(price); const response = await fetch("/api/admin/distance-healing/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ price: value }) }); const data = await response.json().catch(() => null); setMessage(response.ok ? "Price saved. Online payment is enabled." : data?.error?.message ?? "Price could not be saved."); }); }
  return <section className="mt-8 rounded-3xl border border-gold/35 bg-white p-6"><h2 className="font-display text-2xl font-semibold text-charcoal">Booking price</h2><p className="mt-2 text-sm text-warmgray">Bookings stay closed until a fixed full-payment price is saved.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="flex h-12 flex-1 items-center rounded-xl border border-parchment bg-white px-4"><span className="mr-2 font-semibold text-warmgray">₹</span><input type="number" min="1" step="1" value={price} onChange={(event) => setPrice(event.target.value)} className="w-full outline-none" placeholder="Enter amount" /></label><button type="button" onClick={save} disabled={pending} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save price</button></div>{message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}</section>;
}
