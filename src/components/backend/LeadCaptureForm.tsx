"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { leadWhatsAppMessage, manualReference, whatsappUrl } from "@/lib/manual-flow";
import { cn } from "@/lib/utils";

interface LeadCaptureFormProps {
  kind: "waitlist" | "community";
  source?: string;
  manualMode?: boolean;
  hideHeading?: boolean;
  className?: string;
}

interface SubmissionState {
  reference: string;
  message: string;
  whatsappHref: string;
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
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState | null>(null);
  const [pending, startTransition] = useTransition();

  function prepareWhatsApp(reference: string, saved: boolean, emailed = false) {
    const href = whatsappUrl(
      leadWhatsAppMessage({ reference, kind, source, name, email, phone, intention }),
    );
    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      // Fallback link is rendered below when mobile/Safari blocks async popups.
    }
    const emailNote = emailed ? " A confirmation copy has also been sent to your email." : "";
    setSubmission({
      reference,
      whatsappHref: href,
      message: saved
        ? `Request saved (${reference}).${emailNote} Send the prepared WhatsApp message so Dr. Manisha's team can share membership details personally.`
        : `Request prepared (${reference}). Tap below to open WhatsApp and confirm with Dr. Manisha's team.`,
    });
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
          body: JSON.stringify({
            kind,
            source,
            name,
            email,
            phone,
            intention,
            consent,
            company_website: companyWebsite,
          }),
        });
        const data = await response.json().catch(() => null);
        if (response.ok) {
          prepareWhatsApp(
            data?.reference ?? manualReference("REQUEST"),
            true,
            Boolean(data?.emailed),
          );
          return;
        }
        prepareWhatsApp(manualReference("REQUEST"), false);
      } catch {
        prepareWhatsApp(manualReference("REQUEST"), false);
      }
    });
  }

  const fieldClasses =
    "w-full rounded-lg border border-charcoal/12 bg-ivory/45 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warmgray/60 transition-colors duration-150 hover:border-charcoal/25 focus:border-charcoal/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/10";

  return (
    <form
      onSubmit={submit}
      className={cn(
        "mt-6 space-y-4 rounded-xl border border-charcoal/10 bg-white p-4 text-left text-charcoal shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:mt-8 sm:space-y-5 sm:rounded-2xl sm:p-8",
        className,
      )}
    >
      {!hideHeading ? (
        <div className="border-b border-charcoal/10 pb-4">
          <h3 className="font-display text-2xl font-medium text-charcoal">
            {kind === "community" ? "Request membership" : "Join the early access list"}
          </h3>
          <p className="mt-1 text-sm text-warmgray">
            {kind === "community"
              ? "Share your contact details and what draws you to the circle."
              : "Leave your email or WhatsApp number for launch updates."}
          </p>
        </div>
      ) : null}

      {kind === "community" ? (
        <div>
          <label htmlFor={`lead-name-${kind}`} className="mb-1.5 block text-sm font-medium text-charcoal">
            Full name
          </label>
          <input
            id={`lead-name-${kind}`}
            aria-label="Full name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Asha Kulkarni"
            className={`${fieldClasses} h-11`}
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`lead-email-${kind}`} className="mb-1.5 block text-sm font-medium text-charcoal">
            Email address
          </label>
          <input
            id={`lead-email-${kind}`}
            aria-label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={`${fieldClasses} h-11`}
          />
        </div>
        <div>
          <label htmlFor={`lead-phone-${kind}`} className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone or WhatsApp
          </label>
          <input
            id={`lead-phone-${kind}`}
            aria-label="Phone number"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91 98200 12345"
            className={`${fieldClasses} h-11 font-mono tabular-nums`}
          />
        </div>
      </div>

      {kind === "community" ? (
        <div>
          <label htmlFor={`lead-intention-${kind}`} className="mb-1.5 block text-sm font-medium text-charcoal">
            Your intention
          </label>
          <textarea
            id={`lead-intention-${kind}`}
            aria-label="Your intention"
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            maxLength={1500}
            rows={3}
            placeholder="What brings you to this circle"
            className={fieldClasses}
          />
        </div>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`lead-website-${kind}`}>Website</label>
        <input
          id={`lead-website-${kind}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={companyWebsite}
          onChange={(event) => setCompanyWebsite(event.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-warmgray">
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

      {submission ? (
        <div
          className="space-y-3 rounded-xl border border-primary/20 bg-ivory p-4 text-sm leading-6 text-charcoal"
          role="status"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            <p>{submission.message}</p>
          </div>
          <a
            href={submission.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-white px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
            <span>Open WhatsApp if it didn&apos;t open automatically</span>
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending || !consent || (!email && !phone)}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        )}
        {pending ? "Preparing request" : "Continue on WhatsApp"}
      </button>
    </form>
  );
}
