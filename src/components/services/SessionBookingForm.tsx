"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { manualReference, sessionWhatsAppMessage, whatsappUrl } from "@/lib/manual-flow";
import type { OrderItemType } from "@/lib/supabase/database.types";

const FORMATS = [
  { value: "online", label: "Online", detail: "Private video call", icon: Video },
  { value: "mumbai", label: "Mumbai", detail: "In-person session", icon: MapPin },
  { value: "pune", label: "Pune", detail: "In-person session", icon: MapPin },
  { value: "other", label: "Other", detail: "Discuss with the team", icon: MessageCircle },
] as const;

const TIME_SLOTS = ["09:30", "11:00", "12:30", "15:00", "16:30", "18:00"];
const STEPS = ["Format", "Time", "Intention", "Review"];

interface SessionBookingFormProps {
  type: OrderItemType;
  slug: string;
  title: string;
  manualMode?: boolean;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", options ?? { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );
}

export default function SessionBookingForm({ type, slug, title, manualMode = false }: SessionBookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [format, setFormat] = useState("online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; manual: boolean } | null>(null);
  const [pending, startTransition] = useTransition();
  const draftHydrated = useRef(false);

  const dates = useMemo(() => {
    const result: string[] = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    while (result.length < 7) {
      cursor.setDate(cursor.getDate() + 1);
      if (cursor.getDay() !== 0) result.push(toDateValue(cursor));
    }
    return result;
  }, []);

  const selectedFormat = FORMATS.find((item) => item.value === format) ?? FORMATS[0];
  const storageKey = `session-request:${type}:${slug}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.sessionStorage.getItem(storageKey);
        if (!saved) {
          draftHydrated.current = true;
          return;
        }
        const value = JSON.parse(saved) as { format?: string; date?: string; time?: string; notes?: string; step?: number };
        draftHydrated.current = true;
        if (FORMATS.some((item) => item.value === value.format)) setFormat(value.format ?? "online");
        if (typeof value.date === "string") setDate(value.date);
        if (typeof value.time === "string") setTime(value.time);
        if (typeof value.notes === "string") setNotes(value.notes.slice(0, 1500));
        if (typeof value.step === "number") setStep(Math.max(0, Math.min(value.step, STEPS.length - 1)));
      } catch {
        draftHydrated.current = true;
        window.sessionStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (success || !draftHydrated.current) return;
    window.sessionStorage.setItem(storageKey, JSON.stringify({ format, date, time, notes, step }));
  }, [date, format, notes, step, storageKey, success, time]);

  function continueFlow() {
    setError(null);
    if (step === 1 && (!date || !time)) {
      setError("Please choose a preferred date and time.");
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function requestBooking() {
    setError(null);
    if (!date || !time) {
      setStep(1);
      setError("Please choose a preferred date and time.");
      return;
    }
    if (!privacyAccepted) {
      setError("Please confirm the privacy acknowledgement before continuing.");
      return;
    }

    if (manualMode) {
      setSuccess({ id: `MANUAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, manual: true });
      window.sessionStorage.removeItem(storageKey);
      return;
    }

    // The booking calendar is explicitly shown in IST, independent of the visitor's device timezone.
    const requestedStart = new Date(`${date}T${time}:00+05:30`).toISOString();
    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, slug, format, requestedStart, notes, timezone: "Asia/Kolkata" }),
        });
        if (res.status === 401) {
          router.push(`/login?next=${encodeURIComponent(window.location.pathname)}%23book-session`);
          return;
        }
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.booking?.id) {
          setSuccess({ id: manualReference("BOOKING"), manual: true });
          window.sessionStorage.removeItem(storageKey);
          return;
        }
        setSuccess({ ...data.booking, manual: false });
        window.sessionStorage.removeItem(storageKey);
      } catch {
        setSuccess({ id: manualReference("BOOKING"), manual: true });
        window.sessionStorage.removeItem(storageKey);
      }
    });
  }

  if (success) {
    const reference = success.manual ? success.id : success.id.slice(0, 8).toUpperCase();
    const wa = whatsappUrl(sessionWhatsAppMessage({ title, date: displayDate(date), time, format: selectedFormat.label, reference }));
    return (
      <div className="overflow-hidden rounded-[2rem] bg-charcoal text-white shadow-[0_35px_90px_-45px_rgba(62,38,25,0.75)]">
        <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />
        <div className="p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/35">
            <ShieldCheck className="h-8 w-8 text-gold" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">{success.manual ? "Request prepared" : "Request received"} · {reference}</p>
          <h3 className="mt-3 font-display text-3xl font-semibold">{success.manual ? "Your request is ready to send." : "Your healing time is being held."}</h3>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-white/65">
            {success.manual ? "Send this request on WhatsApp so the team can record it and confirm availability." : `We've recorded ${displayDate(date)} at ${time} IST as your preferred time. The team will verify availability and confirm it on WhatsApp.`}
          </p>
          <div className="mx-auto mt-7 flex max-w-md items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-4 text-left ring-1 ring-white/10">
            <div><p className="text-xs text-white/45">Session</p><p className="mt-1 text-sm font-medium">{title}</p></div>
            <div className="text-right"><p className="text-xs text-white/45">Format</p><p className="mt-1 text-sm font-medium">{selectedFormat.label}</p></div>
          </div>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-primary-deeper transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
            <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
          </a>
          {!success.manual ? <button type="button" onClick={() => router.push("/account/bookings")} className="mt-4 block w-full text-sm text-white/55 transition hover:text-gold">View this request in My bookings</button> : <p className="mt-4 text-xs leading-5 text-white/50">Manual requests appear in My bookings only after the future database setup is connected.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_-48px_rgba(62,38,25,0.5)] ring-1 ring-parchment">
      <header className="border-b border-parchment bg-[radial-gradient(circle_at_90%_0%,rgba(221,184,41,0.15),transparent_35%)] px-6 py-7 sm:px-9">
        <div className="grid min-w-0 gap-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep"><Sparkles className="h-3.5 w-3.5" /> Private booking</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-semibold leading-tight text-charcoal">Reserve your session</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-warmgray">Choose a preferred time in a few steps. No payment is taken until availability and the session fee are confirmed.</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-white/70 px-4 py-3 text-left ring-1 ring-parchment/80">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-warmgray">Booking for</p>
            <p className="mt-1 [overflow-wrap:anywhere] font-serif text-sm italic leading-5 text-primary sm:text-base">{title}</p>
          </div>
        </div>

        <ol className="mt-7 grid grid-cols-4 gap-2" aria-label="Booking progress">
          {STEPS.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined}>
              <div className={`h-1 rounded-full transition-colors ${index <= step ? "bg-primary" : "bg-parchment"}`} />
              <span className={`mt-2 hidden text-[10px] font-semibold uppercase tracking-[0.14em] sm:block ${index === step ? "text-primary" : "text-warmgray/65"}`}>{index + 1}. {label}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="min-h-[28rem] px-6 py-8 sm:px-9">
        {step === 0 ? (
          <section aria-labelledby="format-heading">
            <p className="text-xs font-semibold text-gold-deep">Step 1 of 4</p>
            <h3 id="format-heading" className="mt-2 font-display text-2xl font-semibold text-charcoal">How would you like to meet?</h3>
            <p className="mt-2 text-sm text-warmgray">You can discuss or adjust this with the team before confirmation.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {FORMATS.map(({ value, label, detail, icon: Icon }) => {
                const active = format === value;
                return (
                  <button key={value} type="button" onClick={() => setFormat(value)} className={`group flex items-center gap-4 rounded-2xl p-4 text-left ring-1 transition-all duration-200 active:scale-[0.99] ${active ? "bg-primary text-white ring-primary shadow-lg shadow-primary/15" : "bg-ivory/45 text-charcoal ring-parchment hover:bg-cream hover:ring-gold/60"}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${active ? "bg-white/12" : "bg-white text-primary shadow-sm"}`}><Icon className="h-5 w-5" /></span>
                    <span className="flex-1"><span className="block text-sm font-semibold">{label}</span><span className={`mt-0.5 block text-xs ${active ? "text-white/65" : "text-warmgray"}`}>{detail}</span></span>
                    {active ? <Check className="h-5 w-5 text-gold-light" /> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section aria-labelledby="time-heading">
            <p className="text-xs font-semibold text-gold-deep">Step 2 of 4 · Times shown in IST</p>
            <h3 id="time-heading" className="mt-2 font-display text-2xl font-semibold text-charcoal">Choose your preferred time</h3>
            <p className="mt-2 text-sm text-warmgray">These are preferred windows. Your exact appointment is confirmed personally by the team.</p>
            <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-7">
              {dates.map((value) => {
                const active = date === value;
                return <button key={value} type="button" onClick={() => { setDate(value); setTime(""); setError(null); }} className={`rounded-2xl px-2 py-3 text-center ring-1 transition ${active ? "bg-charcoal text-white ring-charcoal" : "bg-ivory/50 text-charcoal ring-parchment hover:ring-gold"}`}><span className={`block text-[10px] uppercase tracking-wider ${active ? "text-gold-light" : "text-warmgray"}`}>{displayDate(value, { weekday: "short" })}</span><span className="mt-1 block font-display text-xl font-semibold">{displayDate(value, { day: "numeric" })}</span><span className={`block text-[10px] ${active ? "text-white/55" : "text-warmgray"}`}>{displayDate(value, { month: "short" })}</span></button>;
              })}
            </div>
            <div className={`mt-7 transition-opacity ${date ? "opacity-100" : "pointer-events-none opacity-35"}`}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-warmgray"><Clock3 className="h-4 w-4" /> Preferred start time</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIME_SLOTS.map((value) => <button key={value} type="button" onClick={() => { setTime(value); setError(null); }} className={`rounded-xl px-4 py-3 text-sm font-semibold tabular-nums ring-1 transition ${time === value ? "bg-primary text-white ring-primary" : "bg-white text-charcoal ring-parchment hover:ring-gold"}`}>{value} <span className="text-[10px] font-normal opacity-65">IST</span></button>)}
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section aria-labelledby="intention-heading">
            <p className="text-xs font-semibold text-gold-deep">Step 3 of 4</p>
            <h3 id="intention-heading" className="mt-2 font-display text-2xl font-semibold text-charcoal">What would you like support with?</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-warmgray">A short note helps Manisha prepare with care. Share only what feels comfortable; you can speak in detail during the session.</p>
            <label htmlFor="booking-intention" className="mt-7 block text-xs font-semibold uppercase tracking-[0.16em] text-warmgray">Your intention <span className="normal-case tracking-normal text-warmgray/60">(optional)</span></label>
            <textarea id="booking-intention" value={notes} onChange={(event) => setNotes(event.target.value)} rows={7} maxLength={1500} placeholder="For example: I would like support with recurring stress, emotional balance, or a transition I am navigating…" className="mt-2 w-full resize-none rounded-2xl bg-ivory/45 px-5 py-4 text-sm leading-6 text-charcoal outline-none ring-1 ring-parchment transition placeholder:text-warmgray/50 focus:bg-white focus:ring-2 focus:ring-gold" />
            <div className="mt-2 flex justify-between text-[11px] text-warmgray/65"><span>Your note stays attached to this private request.</span><span className="tabular-nums">{notes.length}/1500</span></div>
          </section>
        ) : null}

        {step === 3 ? (
          <section aria-labelledby="review-heading">
            <p className="text-xs font-semibold text-gold-deep">Step 4 of 4</p>
            <h3 id="review-heading" className="mt-2 font-display text-2xl font-semibold text-charcoal">Review your request</h3>
            <p className="mt-2 text-sm text-warmgray">Nothing is charged today. The team will confirm availability, fee, and next steps personally.</p>
            <dl className="mt-7 divide-y divide-parchment overflow-hidden rounded-2xl bg-ivory/45 px-5 ring-1 ring-parchment">
              <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-warmgray">Session</dt><dd className="text-right text-sm font-semibold text-charcoal">{title}</dd></div>
              <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-warmgray">Format</dt><dd className="text-right text-sm font-semibold text-charcoal">{selectedFormat.label} · {selectedFormat.detail}</dd></div>
              <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-warmgray">Preferred time</dt><dd className="text-right text-sm font-semibold text-charcoal">{displayDate(date)} · {time} IST</dd></div>
              <div className="flex items-start justify-between gap-6 py-4"><dt className="text-sm text-warmgray">Intention</dt><dd className="max-w-sm text-right text-sm leading-6 text-charcoal">{notes || "I’ll share during the session"}</dd></div>
            </dl>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gold-soft/50 p-4 text-xs leading-5 text-gold-deep"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><p>Submitting creates a booking request, not a confirmed appointment. The team will contact you before any payment.</p></div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-xs leading-5 text-warmgray ring-1 ring-parchment">
              <input type="checkbox" checked={privacyAccepted} onChange={(event) => { setPrivacyAccepted(event.target.checked); setError(null); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
              <span>I consent to these details being used to respond to my booking request. I understand this is a wellbeing service, not medical or psychological treatment.</span>
            </label>
          </section>
        ) : null}

        {error ? <p role="alert" className="mt-5 rounded-xl bg-primary-soft p-3 text-sm font-medium text-primary">{error}</p> : null}
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-parchment bg-ivory/35 px-6 py-5 sm:px-9">
        <button type="button" onClick={() => { setError(null); setStep((current) => Math.max(current - 1, 0)); }} disabled={step === 0 || pending} className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-warmgray transition hover:text-primary disabled:invisible"><ArrowLeft className="h-4 w-4" /> Back</button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={continueFlow} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0">Continue <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button type="button" onClick={requestBooking} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}{pending ? "Sending request…" : "Request this session"}
          </button>
        )}
      </footer>
    </div>
  );
}
