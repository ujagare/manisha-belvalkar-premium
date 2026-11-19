"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { leadWhatsAppMessage, manualReference, whatsappUrl } from "@/lib/manual-flow";
import { cn } from "@/lib/utils";

interface LeadCaptureFormProps {
  kind: "waitlist" | "community";
  source?: string;
  manualMode?: boolean;
  hideHeading?: boolean;
  className?: string;
}

export default function LeadCaptureForm({
  kind,
  source,
  manualMode = false,
  hideHeading = false,
  className,
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intention, setIntention] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function prepareWhatsApp(reference: string, saved: boolean) {
    window.open(
      whatsappUrl(
        leadWhatsAppMessage({ reference, kind, source, name, email, phone, intention }),
      ),
      "_blank",
      "noopener,noreferrer",
    );
    setResult(
      saved
        ? `Request saved · ${reference}. Please send the WhatsApp message to complete it.`
        : `Request prepared · ${reference}. It is not saved online; please send it on WhatsApp.`,
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      if (manualMode) {
        prepareWhatsApp(
          manualReference(kind === "community" ? "COMMUNITY" : "WAITLIST"),
          false,
        );
        return;
      }
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, source, name, email, phone, intention, consent }),
        });
        const data = await response.json().catch(() => null);
        if (response.ok) {
          prepareWhatsApp(data?.reference ?? manualReference("REQUEST"), true);
          return;
        }
        prepareWhatsApp(manualReference("REQUEST"), false);
      } catch {
        prepareWhatsApp(manualReference("REQUEST"), false);
      }
    });
  }

  const fieldClasses =
    "w-full rounded-xl border border-gold/30 bg-cream/65 px-4 py-3 text-sm text-charcoal placeholder:text-warmgray/65 transition-all duration-200 hover:border-gold/55 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/25";

  return (
    <form
      onSubmit={submit}
      className={cn(
        "mt-8 space-y-4 rounded-[24px] border border-gold/30 bg-white/95 p-6 text-left text-charcoal shadow-[0_24px_60px_-34px_rgba(78,14,10,0.22)] backdrop-blur-sm sm:p-8",
        className,
      )}
    >
      {!hideHeading ? (
        <h3 className="font-display text-2xl font-semibold text-charcoal">
          {kind === "community" ? "Apply to join" : "Join the early access list"}
        </h3>
      ) : null}

      {kind === "community" ? (
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-warmgray">
            Full name
          </label>
          <input
            aria-label="Full name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            className={fieldClasses}
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-warmgray">
            Email address
          </label>
          <input
            aria-label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={fieldClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-warmgray">
            Phone / WhatsApp
          </label>
          <input
            aria-label="Phone number"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91 98XXX XXXXX"
            className={fieldClasses}
          />
        </div>
      </div>

      {kind === "community" ? (
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-warmgray">
            Your intention
          </label>
          <textarea
            aria-label="Your intention"
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            maxLength={1500}
            rows={3}
            placeholder="What brings you to this community?"
            className={fieldClasses}
          />
        </div>
      ) : null}

      <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-warmgray">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-primary)]"
        />
        <span>
          I consent to being contacted about this request. I can opt out at any time.
        </span>
      </label>

      {result ? (
        <p
          className="rounded-xl border border-gold/40 bg-gold-soft/80 px-4 py-3 text-sm leading-6 text-charcoal"
          role="status"
        >
          {result}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !consent || (!email && !phone)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_-14px_rgba(107,11,11,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:w-auto sm:px-7"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Preparing…" : "Prepare WhatsApp request"}
      </button>
    </form>
  );
}
