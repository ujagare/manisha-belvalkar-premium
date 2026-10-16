"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { manualReference, sendManualConfirmation } from "@/lib/manual-flow";

/** Contact form with email acknowledgements for the visitor and the team. */
export default function ContactForm({ manualMode = false }: { manualMode?: boolean }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setReference(null);
    setIsSubmitting(true);
    try {
      if (manualMode) {
        const nextReference = manualReference("ENQUIRY");
        const response = await sendManualConfirmation({
          name: form.name,
          email: form.email,
          reference: nextReference,
          requestType: "contact enquiry",
          summary: `${form.message}\nPhone: ${form.phone}`,
        });
        if (!response?.ok) throw new Error("EMAIL_FAILED");
        setReference(nextReference);
      } else {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "enquiry", ...form, consent, sourcePath: window.location.pathname }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error?.message ?? "SUBMIT_FAILED");
        setReference(result.reference);
        if (!result.emailed) {
          setError("Your enquiry was saved, but the confirmation email could not be sent. Our team will still contact you.");
        }
      }
    } catch {
      setError("Your message could not be sent. Please try again or use the separate WhatsApp button on this page.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClasses =
    "w-full rounded-2xl border border-parchment bg-white px-4 py-3.5 text-sm text-ink shadow-[inset_0_1px_2px_rgba(28,25,23,0.04)] placeholder:text-warmgray/50 transition-all duration-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Name</label>
          <input id="name" type="text" required placeholder="Your name" className={fieldClasses} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Phone</label>
          <input id="phone" type="tel" required placeholder="+91 9XXXXXXXXX" className={fieldClasses} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Email</label>
        <input id="email" type="email" required placeholder="your@email.com" className={fieldClasses} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray">Message</label>
        <textarea id="message" rows={4} required placeholder="How can Manisha help you on your journey?" className={`${fieldClasses} resize-none`} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
      </div>
      <label className="flex items-start gap-3 text-xs leading-5 text-warmgray">
        <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />
        <span>I consent to my details being stored and used to respond to this enquiry.</span>
      </label>
      {error ? <p role="alert" className="text-sm text-primary">{error}</p> : null}
      {reference ? <p role="status" className="text-sm text-green-700">Message sent. Email confirmation sent. Reference: {reference}</p> : null}
      <button type="submit" disabled={isSubmitting || !consent} className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
        <Heart className="h-4 w-4 text-gold-light transition-transform duration-300 group-hover:scale-110" />
        {isSubmitting ? "Sending..." : "Send enquiry"}
      </button>
      <p className="text-center text-xs text-warmgray/70">Your enquiry is sent securely and a confirmation is emailed to you.</p>
      <p className="text-center text-xs leading-5 text-warmgray/60">
        Your details are used to respond to this enquiry. Read our{" "}
        <Link href="/privacy-policy" className="font-medium text-primary hover:underline">Privacy policy</Link>.
      </p>
    </form>
  );
}
