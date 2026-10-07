"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarPlus, Loader2 } from "lucide-react";

export default function BookingRequestForm({ type, slug }: { type: "service" | "healing" | "mentoring"; slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [format, setFormat] = useState("online");
  const [requestedStart, setRequestedStart] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, slug, format, requestedStart: requestedStart || null, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, notes }) });
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(pathname)}`); return; }
      const data = await response.json().catch(() => null);
      setMessage(response.ok ? `Request received · ${data.booking.id.slice(0, 8).toUpperCase()}` : data?.error?.message ?? "Could not submit your request.");
    });
  }

  return <form onSubmit={submit} className="mt-8 space-y-4 rounded-[24px] border border-parchment bg-white p-6">
    <h2 className="font-display text-2xl font-bold text-charcoal">Request a preferred time</h2>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-charcoal">Format<select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 w-full rounded-xl border border-parchment bg-white px-4 py-3"><option value="online">Online</option><option value="mumbai">Mumbai</option><option value="pune">Pune</option></select></label><label className="text-sm font-medium text-charcoal">Preferred date and time<input type="datetime-local" value={requestedStart} onChange={(e) => setRequestedStart(e.target.value)} className="mt-2 w-full rounded-xl border border-parchment px-4 py-3" /></label></div>
    <label className="block text-sm font-medium text-charcoal">Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1500} rows={3} className="mt-2 w-full rounded-xl border border-parchment px-4 py-3" placeholder="Share anything helpful for scheduling." /></label>
    {message ? <p className="rounded-xl bg-gold-soft p-3 text-sm text-gold-deep" role="status">{message}</p> : null}
    <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}{pending ? "Sending…" : "Request booking"}</button>
  </form>;
}
