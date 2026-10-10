"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { leadWhatsAppMessage, manualReference, whatsappUrl } from "@/lib/manual-flow";

interface LeadCaptureFormProps {
  kind: "waitlist" | "community";
  source?: string;
  manualMode?: boolean;
}

export default function LeadCaptureForm({ kind, source, manualMode = false }: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intention, setIntention] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function prepareWhatsApp(reference: string, saved: boolean) {
    window.open(whatsappUrl(leadWhatsAppMessage({ reference, kind, source, name, email, phone, intention })), "_blank", "noopener,noreferrer");
    setResult(saved
      ? `Request saved · ${reference}. Please send the WhatsApp message to complete it.`
      : `Request prepared · ${reference}. It is not saved online; please send it on WhatsApp.`);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      if (manualMode) {
        prepareWhatsApp(manualReference(kind === "community" ? "COMMUNITY" : "WAITLIST"), false);
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

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 rounded-[26px] border border-parchment bg-white p-7 text-charcoal">
      <h2 className="font-display text-2xl font-bold">{kind === "community" ? "Apply to join" : "Join the early access list"}</h2>
      {kind === "community" ? <input aria-label="Full name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full rounded-xl border border-parchment px-4 py-3" /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <input aria-label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="rounded-xl border border-parchment px-4 py-3" />
        <input aria-label="Phone number" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="rounded-xl border border-parchment px-4 py-3" />
      </div>
      {kind === "community" ? <textarea aria-label="Your intention" value={intention} onChange={(event) => setIntention(event.target.value)} maxLength={1500} rows={3} placeholder="What brings you to this community?" className="w-full rounded-xl border border-parchment px-4 py-3" /> : null}
      <label className="flex items-start gap-3 text-xs leading-5 text-warmgray"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" /><span>I consent to being contacted about this request. I can opt out at any time.</span></label>
      {result ? <p className="rounded-xl bg-gold-soft p-3 text-sm text-gold-deep" role="status">{result}</p> : null}
      <button disabled={pending || !consent || (!email && !phone)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}{pending ? "Preparing…" : "Prepare WhatsApp request"}</button>
    </form>
  );
}
