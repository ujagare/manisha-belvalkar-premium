"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Globe, Headphones, Loader2, LockKeyhole, ShieldCheck, Video } from "lucide-react";
import { formatVisitorLocalDateTime, useVisitorTimezone } from "@/lib/timezone";

interface DailySessionRoomProps {
  bookingId: string;
  offeringTitle: string;
  startsAtIso: string | null;
  status: string;
}

export default function DailySessionRoom({
  bookingId,
  offeringTitle,
  startsAtIso,
  status,
}: DailySessionRoomProps) {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opensAt, setOpensAt] = useState<string | null>(null);
  const [session, setSession] = useState<{ roomUrl: string; token: string; isOwner: boolean } | null>(null);
  const visitorTz = useVisitorTimezone();
  const localStart = formatVisitorLocalDateTime(startsAtIso, visitorTz, { includeYear: true });
  const localOpensAt = formatVisitorLocalDateTime(opensAt, visitorTz);

  const formattedStart = startsAtIso
    ? `${new Date(startsAtIso).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })} IST`
    : "Confirmed slot";

  async function enterRoom() {
    setJoining(true);
    setError(null);
    setOpensAt(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/join`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.roomUrl || !data?.token) {
        if (data?.error?.details?.opensAt) setOpensAt(data.error.details.opensAt);
        setError(data?.error?.message ?? "Could not open your private session room right now.");
        return;
      }
      setSession({ roomUrl: data.roomUrl, token: data.token, isOwner: Boolean(data.isOwner) });
    } catch {
      setError("Network error while connecting to your private Daily.co room. Please retry.");
    } finally {
      setJoining(false);
    }
  }

  if (session) {
    const iframeSrc = `${session.roomUrl}?t=${encodeURIComponent(session.token)}`;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-parchment bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
              {session.isOwner ? "Host View · Private Daily.co Room" : "Encrypted 1:1 Video Room"}
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold text-charcoal sm:text-2xl">{offeringTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              <LockKeyhole className="h-3.5 w-3.5" /> Private Token Active
            </span>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="rounded-full border border-parchment px-4 py-2 text-xs font-semibold text-warmgray transition hover:border-primary hover:text-primary"
            >
              Leave Room
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-parchment bg-charcoal shadow-2xl">
          <iframe
            src={iframeSrc}
            title={`${offeringTitle} Private Video Session`}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-[72dvh] min-h-[480px] w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-parchment bg-white p-6 shadow-xl sm:rounded-[28px] sm:p-10">
      <Link
        href="/account/bookings"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-warmgray transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Bookings
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
        <ShieldCheck className="h-4 w-4" /> Private Daily.co Healing Room
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold text-charcoal sm:text-4xl">{offeringTitle}</h1>

      <div className="mt-5 grid gap-3 rounded-2xl bg-ivory p-4 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs text-warmgray">Scheduled Time</p>
            <p className="mt-0.5 font-semibold text-charcoal">{formattedStart}</p>
            {localStart ? (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gold-deep">
                <Globe className="h-3.5 w-3.5 shrink-0" /> Your local time: {localStart}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs text-warmgray">Security</p>
            <p className="mt-0.5 font-semibold text-charcoal">Waiting room · Authenticated token</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-parchment bg-cream/40 p-5 text-sm text-warmgray">
        <p className="font-semibold text-charcoal">Before entering your session:</p>
        <ul className="space-y-2 text-xs leading-6 sm:text-sm">
          <li className="flex items-start gap-2"><Headphones className="mt-1 h-4 w-4 shrink-0 text-gold-deep" /> Sit in a quiet, private space and use headphones if comfortable.</li>
          <li className="flex items-start gap-2"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-gold-deep" /> The private room opens 15 minutes before your scheduled start time.</li>
          <li className="flex items-start gap-2"><Video className="mt-1 h-4 w-4 shrink-0 text-gold-deep" /> Allow browser camera &amp; microphone access when prompted; Dr. Manisha will admit you from the waiting room.</li>
        </ul>
      </div>

      {error ? (
        <div role="alert" className="mt-5 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
          <p>{error}</p>
          {opensAt ? (
            <p className="mt-1 text-xs font-medium text-charcoal">
              Room opens at:{" "}
              {new Date(opensAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              IST{localOpensAt ? ` (${localOpensAt} your time)` : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={enterRoom}
        disabled={joining || status !== "confirmed"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
        {joining ? "Connecting securely…" : status === "confirmed" ? "Enter Private Video Room" : "Session not confirmed yet"}
      </button>
    </div>
  );
}
