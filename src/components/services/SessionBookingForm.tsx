"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Loader2, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { brand } from "@/lib/data";
import type { OrderItemType } from "@/lib/supabase/database.types";

const FORMATS = [
  { value: "online", label: "Online (video call)" },
  { value: "mumbai", label: "In person — Mumbai" },
  { value: "pune", label: "In person — Pune" },
  { value: "other", label: "Other location" },
];

interface SessionBookingFormProps {
  type: OrderItemType; // 'healing' | 'mentoring'
  slug: string;
  title: string;
}

export default function SessionBookingForm({ type, slug, title }: SessionBookingFormProps) {
  const router = useRouter();
  const [format, setFormat] = useState("online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function requestBooking() {
    setError(null);
    const requestedStart = date && time ? new Date(`${date}T${time}:00`).toISOString() : null;
    if (!requestedStart) {
      setError("Kripya date aur time choose karein.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug, format, requestedStart, notes, timezone: "Asia/Kolkata" }),
      });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.booking?.id) {
        setError(data?.error?.message ?? "Booking request nahi ban paya. Kripya dobara try karein.");
        return;
      }
      setSuccess(data.booking);
    });
  }

  if (success) {
    const wa = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(
      `Namaste Manisha ji, I have requested a booking:\n\nSession: ${title}\nDate/Time: ${date} ${time} (IST)\nFormat: ${FORMATS.find((f) => f.value === format)?.label ?? format}\nBooking ref: ${success.id.slice(0, 8)}\n\nPlease confirm.`,
    )}`;
    return (
      <div className="rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 text-center shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)]">
        <ShieldCheck className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 font-display text-2xl font-bold text-charcoal">Booking request sent</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-warmgray">
          Aapki booking request {date} {time} (IST) ke liye record ho gayi hai. Manisha ki team WhatsApp par confirm karegi. Reference: <span className="font-mono text-charcoal">{success.id.slice(0, 8)}</span>
        </p>
        <a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:brightness-110">
          <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
        </a>
        <button type="button" onClick={() => router.push("/account")} className="mt-3 block w-full text-center text-sm text-warmgray hover:text-primary">
          View my bookings
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-parchment bg-white p-7 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] sm:p-8">
      <p className="flex items-center gap-2 font-display text-xl font-bold text-charcoal">
        <CalendarDays className="h-5 w-5 text-gold-dark" /> Book this session
      </p>
      <p className="mt-2 text-sm text-warmgray">Format aur preferred date/time select karein. Aapki request team ke paas jayegi aur WhatsApp par confirm hogi.</p>

      {/* Format */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-warmgray">Session format</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {FORMATS.map((f) => (
          <label key={f.value} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${format === f.value ? "border-gold bg-gold-soft/40 text-charcoal" : "border-parchment bg-ivory/50 text-warmgray hover:border-gold"}`}>
            <input type="radio" name="format" value={f.value} checked={format === f.value} onChange={() => setFormat(f.value)} className="h-4 w-4 accent-[var(--color-primary)]" />
            <MapPin className="h-4 w-4 shrink-0" /> {f.label}
          </label>
        ))}
      </div>

      {/* Date & time */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Preferred date</label>
          <div className="relative">
            <input id="bk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-parchment bg-ivory/50 px-4 py-2.5 text-charcoal outline-none focus:border-gold" />
          </div>
        </div>
        <div>
          <label htmlFor="bk-time" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray-700">Preferred time (IST)</label>
          <div className="relative">
            <input id="bk-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-parchment bg-ivory/50 px-4 py-2.5 text-charcoal outline-none focus:border-gold" />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-5">
        <label htmlFor="bk-notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Notes (optional)</label>
        <textarea id="bk-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Kuch batana ho toh — question ya intent" className="w-full rounded-xl border border-parchment bg-ivory/50 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-gold" />
      </div>

      {error ? <p role="alert" className="mt-4 rounded-xl bg-primary-soft p-3 text-sm text-primary">{error}</p> : null}

      <button
        type="button"
        onClick={requestBooking}
        disabled={pending || !date || !time}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}
        {pending ? "Sending…" : "Request booking"}
      </button>
      <p className="mt-3 text-center text-[11px] text-warmgray">Login required. Confirmation via WhatsApp.</p>
    </div>
  );
}
