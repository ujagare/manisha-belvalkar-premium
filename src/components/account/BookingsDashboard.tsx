"use client";

import { useState } from "react";
import { CalendarDays, Clock3, MapPin, Pencil, Video, X } from "lucide-react";
import { cancelBookingAction, rescheduleBookingAction } from "@/app/account/bookings/actions";
import type { BookingRow } from "@/lib/supabase/database.types";

const statusStyle: Record<string, string> = {
  requested: "bg-gold-soft text-gold-deep",
  payment_pending: "bg-primary-soft text-primary",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-ink/10 text-warmgray",
  cancelled: "bg-ink/10 text-warmgray",
  reschedule_requested: "bg-primary-soft text-primary",
};

const formatLabel: Record<string, string> = {
  online: "Online",
  mumbai: "Mumbai",
  pune: "Pune",
  other: "Other",
};

export default function BookingsDashboard({ bookings }: { bookings: BookingRow[] }) {
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState("");

  return (
    <div className="mt-8 space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-bold capitalize text-charcoal">{b.offering_type} · {b.offering_slug.replace(/-/g, " ")}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-warmgray">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{formatLabel[b.format] ?? b.format}</span>
                {b.requested_start ? <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{new Date(b.requested_start).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span> : null}
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyleOf(statusStyle, b.status)}`}>{b.status.replace("_", " ")}</span>
          </div>

          {b.notes ? <p className="mt-3 text-sm text-warmgray">Notes: {b.notes}</p> : null}

          {b.status === "confirmed" && b.meeting_url ? (
            <a href={b.meeting_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">
              <Video className="h-4 w-4" /> Join session
            </a>
          ) : null}

          {["requested", "payment_pending", "confirmed"].includes(b.status) ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-parchment pt-4">
              <button type="button" onClick={() => { setReschedulingId(reschedulingId === b.id ? null : b.id); setNewTime(""); }} className="inline-flex items-center gap-1.5 rounded-full border border-parchment px-4 py-2 text-sm font-semibold text-warmgray hover:text-primary">
                <Pencil className="h-4 w-4" /> Reschedule
              </button>
              <form action={cancelBookingAction}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" onClick={(e) => { if (!window.confirm("Booking cancel karni hai?")) e.preventDefault(); }} className="inline-flex items-center gap-1.5 rounded-full border border-parchment px-4 py-2 text-sm font-semibold text-primary hover:border-primary">
                  <X className="h-4 w-4" /> Cancel
                </button>
              </form>
            </div>
          ) : null}

          {reschedulingId === b.id ? (
            <form action={rescheduleBookingAction} className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-ivory p-4">
              <input type="hidden" name="id" value={b.id} />
              <div>
                <label className="mb-1 block text-xs font-semibold text-charcoal">New preferred date &amp; time (IST)</label>
                <input type="datetime-local" value={newTime} onChange={(e) => setNewTime(e.target.value)} name="requested_start" required className="rounded-xl border border-parchment bg-white px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">Request reschedule</button>
              <button type="button" onClick={() => setReschedulingId(null)} className="rounded-full border border-parchment px-4 py-2.5 text-sm text-warmgray">Cancel</button>
            </form>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function statusStyleOf(map: Record<string, string>, status: string) {
  return map[status] ?? "bg-ink/10 text-warmgray";
}
