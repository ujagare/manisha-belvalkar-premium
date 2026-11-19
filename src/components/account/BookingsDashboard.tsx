"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Loader2, MapPin, Pencil, Video, X } from "lucide-react";
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
  online: "Online (Daily.co)",
  mumbai: "Mumbai",
  pune: "Pune",
  other: "Other",
};

type OpenSlot = { id: string; starts_at: string; format: string };

export default function BookingsDashboard({ bookings }: { bookings: BookingRow[] }) {
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [reschedulingFormat, setReschedulingFormat] = useState<string>("online");
  const [openSlots, setOpenSlots] = useState<OpenSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    if (!reschedulingId) return;
    const controller = new AbortController();
    fetch(`/api/bookings?format=${encodeURIComponent(reschedulingFormat)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setOpenSlots(data?.slots ?? []))
      .catch(() => setOpenSlots([]))
      .finally(() => setLoadingSlots(false));
    return () => controller.abort();
  }, [reschedulingId, reschedulingFormat]);

  return (
    <div className="mt-6 sm:mt-8 space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-2xl sm:rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-4 sm:p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg sm:text-xl font-bold capitalize text-charcoal">{b.offering_type} · {b.offering_slug.replace(/-/g, " ")}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-warmgray">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{formatLabel[b.format] ?? b.format}</span>
                {b.requested_start ? <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{new Date(b.requested_start).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</span> : null}
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyleOf(statusStyle, b.status)}`}>{b.status.replace("_", " ")}</span>
          </div>

          {b.notes ? <p className="mt-3 text-sm text-warmgray">Notes: {b.notes}</p> : null}

          {b.status === "confirmed" && b.format === "online" ? (
            <Link
              href={`/account/bookings/${b.id}/room`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:brightness-110"
            >
              <Video className="h-4 w-4" /> Enter Private Video Room
            </Link>
          ) : null}

          {["requested", "payment_pending", "confirmed"].includes(b.status) ? (
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 border-t border-parchment pt-4">
              {["requested", "confirmed"].includes(b.status) ? (
                <button
                  type="button"
                  onClick={() => {
                    if (reschedulingId === b.id) {
                      setReschedulingId(null);
                      setLoadingSlots(false);
                    } else {
                      setLoadingSlots(true);
                      setOpenSlots([]);
                      setReschedulingId(b.id);
                      setReschedulingFormat(b.format);
                      setSelectedSlotId("");
                    }
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-parchment px-4 py-2 text-sm font-semibold text-warmgray hover:text-primary"
                >
                  <Pencil className="h-4 w-4" /> Reschedule
                </button>
              ) : null}
              <form action={cancelBookingAction}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" onClick={(e) => { if (!window.confirm("Booking cancel karni hai? (24 hours se pehle cancel karne par slot release ho jayega)")) e.preventDefault(); }} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-parchment px-4 py-2 text-sm font-semibold text-primary hover:border-primary">
                  <X className="h-4 w-4" /> Cancel
                </button>
              </form>
              <span className="ml-auto text-[11px] text-warmgray">Free reschedule/cancel up to 24h before start</span>
            </div>
          ) : null}

          {reschedulingId === b.id ? (
            <form action={rescheduleBookingAction} className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-ivory p-4">
              <input type="hidden" name="id" value={b.id} />
              <div className="min-w-[240px] flex-1">
                <label className="mb-1 block text-xs font-semibold text-charcoal">Choose an open available slot (IST)</label>
                {loadingSlots ? (
                  <p className="inline-flex items-center gap-2 py-2 text-xs text-warmgray"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live slots…</p>
                ) : openSlots.length ? (
                  <select
                    name="slot_id"
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-parchment bg-white px-3 text-sm text-charcoal"
                  >
                    <option value="">Select a new slot</option>
                    {openSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {new Date(slot.starts_at).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        IST
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="py-2 text-xs text-warmgray">No open slots currently available. Contact support on WhatsApp.</p>
                )}
              </div>
              <button type="submit" disabled={!selectedSlotId} className="min-h-10 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">Confirm new slot</button>
              <button type="button" onClick={() => setReschedulingId(null)} className="min-h-10 rounded-full border border-parchment px-4 py-2.5 text-sm text-warmgray">Close</button>
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
