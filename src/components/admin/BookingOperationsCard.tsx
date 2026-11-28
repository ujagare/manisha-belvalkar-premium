"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail, Save, Sparkles, Video } from "lucide-react";

interface BookingOperationsCardProps {
  bookingId: string;
  offeringTitle: string;
  clientName: string;
  clientEmail: string | null;
  format: string;
  startsAtIso: string | null;
  initialStatus: string;
  clientIntention: string | null;
  initialAftercareNotes: string | null;
  aftercareSentAt: string | null;
  clientJoinedAt: string | null;
  hostJoinedAt: string | null;
}

export default function BookingOperationsCard({
  bookingId,
  offeringTitle,
  clientName,
  clientEmail,
  format,
  startsAtIso,
  initialStatus,
  clientIntention,
  initialAftercareNotes,
  aftercareSentAt,
  clientJoinedAt,
  hostJoinedAt,
}: BookingOperationsCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [aftercareNotes, setAftercareNotes] = useState(initialAftercareNotes ?? "");
  const [sendEmailFlag, setSendEmailFlag] = useState(!aftercareSentAt);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const startsLabel = startsAtIso
    ? `${new Date(startsAtIso).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })} IST`
    : "Flexible / Unscheduled";

  function saveUpdate() {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          aftercareNotes,
          sendAftercareEmail: sendEmailFlag && aftercareNotes.trim().length > 0,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setFeedback({
          ok: false,
          text: data?.error?.message ?? "Could not save booking update.",
        });
        return;
      }
      setFeedback({
        ok: true,
        text: data?.emailSent
          ? "Saved & aftercare guidance emailed to client."
          : "Session status & aftercare notes saved.",
      });
    });
  }

  return (
    <article className="rounded-2xl border border-parchment bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-warmgray">
            Ref #{bookingId.slice(0, 8).toUpperCase()} · {startsLabel}
          </p>
          <h2 className="mt-1.5 font-display text-xl font-semibold text-charcoal">
            {offeringTitle}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-warmgray">
            <span className="font-semibold text-charcoal">{clientName}</span>
            {clientEmail ? (
              <a href={`mailto:${clientEmail}`} className="underline hover:text-primary">
                {clientEmail}
              </a>
            ) : null}
            <span className="rounded-full bg-ivory px-2.5 py-0.5 font-medium capitalize text-charcoal">
              {format === "online" ? "Online (Daily.co)" : format}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {status.replace("_", " ")}
        </span>
      </div>

      {clientJoinedAt || hostJoinedAt ? (
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-green-800">
          {hostJoinedAt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Host joined{" "}
              {new Date(hostJoinedAt).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              IST
            </span>
          ) : null}
          {clientJoinedAt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Client joined{" "}
              {new Date(clientJoinedAt).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              IST
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl bg-ivory/75 p-3.5 text-sm leading-6 text-charcoal">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-warmgray">
          Client Intention / Pre-Session Note
        </span>
        <p className="mt-1">{clientIntention || "No pre-session note shared."}</p>
      </div>

      {format === "online" && status === "confirmed" ? (
        <div className="mt-4">
          <Link
            href={`/account/bookings/${bookingId}/room`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 sm:w-auto"
          >
            <Video className="h-4 w-4" /> Join Private Video Room as Host
          </Link>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3.5 border-t border-parchment pt-5">
        <div>
          <label
            htmlFor={`status-${bookingId}`}
            className="mb-1.5 block text-xs font-semibold text-charcoal"
          >
            Session Status
          </label>
          <select
            id={`status-${bookingId}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 w-full rounded-xl border border-parchment bg-white px-3 text-sm text-charcoal"
          >
            <option value="requested">Requested</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`aftercare-${bookingId}`}
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-charcoal"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-deep" /> Post-Session Remedies &amp; Aftercare Note
          </label>
          <textarea
            id={`aftercare-${bookingId}`}
            rows={4}
            maxLength={3000}
            value={aftercareNotes}
            onChange={(e) => setAftercareNotes(e.target.value)}
            placeholder="Write personalized remedies, mantra practice, or gentle aftercare steps for the client…"
            className="w-full rounded-xl border border-parchment bg-white px-3.5 py-2.5 text-sm leading-6 text-charcoal outline-none focus:border-gold-dark"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-warmgray">
              <input
                type="checkbox"
                checked={sendEmailFlag}
                onChange={(e) => setSendEmailFlag(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              <Mail className="h-3.5 w-3.5 text-gold-deep" /> Email this aftercare note to client
            </label>
            <span className="text-[11px] tabular-nums text-warmgray">
              {aftercareNotes.length}/3000
            </span>
          </div>
        </div>

        {feedback ? (
          <p
            className={`rounded-xl px-3 py-2 text-xs font-medium ${
              feedback.ok ? "bg-green-50 text-green-800" : "bg-primary-soft text-primary"
            }`}
          >
            {feedback.text}
          </p>
        ) : null}

        <button
          type="button"
          onClick={saveUpdate}
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {pending ? "Saving…" : "Save Session & Aftercare"}
        </button>
      </div>
    </article>
  );
}
