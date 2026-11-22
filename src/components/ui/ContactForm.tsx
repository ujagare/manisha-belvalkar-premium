"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import {
  contactWhatsAppMessage,
  manualReference,
  sendManualConfirmation,
  whatsappUrl,
} from "@/lib/manual-flow";

type FieldName = "name" | "phone" | "email" | "message";

const TOPICS = [
  "Tarot consultation",
  "Energy healing",
  "Courses & lineage",
  "Shakti & products",
  "General question",
] as const;

function validateField(field: FieldName, value: string): string | null {
  const trimmed = value.trim();
  if (field === "name") {
    if (!trimmed) return "Please enter your name.";
    if (trimmed.length < 2) return "Name should be at least 2 characters.";
  }
  if (field === "phone") {
    if (!trimmed) return "Please enter a phone or WhatsApp number.";
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 7) return "Please enter a valid contact number.";
  }
  if (field === "email") {
    if (!trimmed) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Please enter a valid email address.";
    }
  }
  if (field === "message") {
    if (!trimmed) return "Please share a brief note about your enquiry.";
    if (trimmed.length < 10) return "A short sentence helps us guide you better.";
  }
  return null;
}

/** Contact form with inline validation and email acknowledgements. */
export default function ContactForm({ manualMode = false }: { manualMode?: boolean }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [topic, setTopic] = useState<string>("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string | null>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    name: string;
    phone: string;
    email: string;
    message: string;
  } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
  };

  const handleChange = (field: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const nextErrors: Record<FieldName, string | null> = {
      name: validateField("name", form.name),
      phone: validateField("phone", form.phone),
      email: validateField("email", form.email),
      message: validateField("message", form.message),
    };
    setTouched({ name: true, phone: true, email: true, message: true });
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setReference(null);
    setIsSubmitting(true);
    const honeypot = honeypotRef.current?.value ?? "";
    const composedMessage = topic ? `[${topic}]\n${form.message.trim()}` : form.message.trim();

    try {
      if (manualMode) {
        const nextReference = manualReference("ENQUIRY");
        const response = await sendManualConfirmation({
          name: form.name.trim(),
          email: form.email.trim(),
          reference: nextReference,
          requestType: "contact enquiry",
          summary: `${composedMessage}\nPhone: ${form.phone.trim()}`,
        });
        if (!response?.ok) throw new Error("EMAIL_FAILED");
        setReference(nextReference);
        setSubmittedSnapshot({ ...form, message: composedMessage });
      } else {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "enquiry",
            ...form,
            message: composedMessage,
            consent,
            sourcePath: window.location.pathname,
            company_website: honeypot,
          }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error?.message ?? "SUBMIT_FAILED");
        setReference(result.reference);
        setSubmittedSnapshot({ ...form, message: composedMessage });
        if (!result.emailed) {
          setError("Your enquiry was saved, though the confirmation email could not be sent. Our team will still reach out.");
        }
      }
    } catch {
      setError("We could not send your enquiry right now. Please try again or reach us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", message: "" });
    setTopic("");
    setConsent(false);
    setTouched({});
    setFieldErrors({});
    setError(null);
    setReference(null);
    setSubmittedSnapshot(null);
  };

  const getFieldClasses = (field: FieldName) => {
    const hasError = touched[field] && Boolean(fieldErrors[field]);
    return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warmgray/60 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 ${
      hasError
        ? "border-primary bg-primary-soft/35 focus:border-primary focus:ring-primary/15"
        : "border-charcoal/12 bg-ivory/40 focus:border-charcoal/40 focus:ring-charcoal/10"
    }`;
  };

  if (reference && submittedSnapshot) {
    const whatsappHref = whatsappUrl(
      contactWhatsAppMessage({
        reference,
        name: submittedSnapshot.name,
        phone: submittedSnapshot.phone,
        email: submittedSnapshot.email,
        message: submittedSnapshot.message,
      }),
    );

    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-6 rounded-xl border border-charcoal/10 bg-ivory p-6"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-charcoal/10 bg-white text-[#16a34a]">
            <Check className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-medium text-charcoal">
              Enquiry received
            </p>
            <p className="mt-2 text-sm leading-6 text-warmgray">
              A confirmation email has been sent to{" "}
              <span className="font-medium text-charcoal">{submittedSnapshot.email}</span>.
              Dr. Manisha&apos;s desk responds personally within 24 hours.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-charcoal/10 bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-charcoal">
              <span className="text-warmgray">Reference</span>
              <span>{reference}</span>
            </div>
            {error ? (
              <p role="alert" className="mt-3 text-sm text-primary">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                <span>Share on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-11 items-center rounded-lg border border-charcoal/12 bg-white px-4 text-sm font-medium text-charcoal transition-colors duration-150 hover:bg-ivory"
              >
                Write another note
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
      {/* Honeypot trap — invisible to humans, filled by bots. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, overflow: "hidden" }}
      >
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      {/* Optional topic selector */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-charcoal">
          Area of interest <span className="font-normal text-warmgray">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((item) => {
            const active = topic === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setTopic(active ? "" : item)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors duration-150 active:scale-[0.98] ${
                  active
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-charcoal/12 bg-ivory/50 text-charcoal hover:border-charcoal/30 hover:bg-white"
                }`}
              >
                {active ? <Check className="h-3.5 w-3.5" strokeWidth={1.75} /> : null}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Asha Kulkarni"
            aria-invalid={Boolean(touched.name && fieldErrors.name)}
            aria-describedby={touched.name && fieldErrors.name ? "name-error" : undefined}
            className={`${getFieldClasses("name")} h-11`}
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {touched.name && fieldErrors.name ? (
            <p id="name-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone or WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+91 98200 12345"
            aria-invalid={Boolean(touched.phone && fieldErrors.phone)}
            aria-describedby={touched.phone && fieldErrors.phone ? "phone-error" : undefined}
            className={`${getFieldClasses("phone")} h-11 font-mono tabular-nums`}
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          {touched.phone && fieldErrors.phone ? (
            <p id="phone-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="asha@example.com"
          aria-invalid={Boolean(touched.email && fieldErrors.email)}
          aria-describedby={touched.email && fieldErrors.email ? "email-error" : undefined}
          className={`${getFieldClasses("email")} h-11`}
          value={form.email}
          onChange={(event) => handleChange("email", event.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && fieldErrors.email ? (
          <p id="email-error" className="mt-1.5 text-xs font-medium text-primary">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Your question and preferred city or online slot"
          aria-invalid={Boolean(touched.message && fieldErrors.message)}
          aria-describedby={touched.message && fieldErrors.message ? "message-error" : "message-hint"}
          className={`${getFieldClasses("message")} resize-y`}
          value={form.message}
          onChange={(event) => handleChange("message", event.target.value)}
          onBlur={() => handleBlur("message")}
        />
        {touched.message && fieldErrors.message ? (
          <p id="message-error" className="mt-1.5 text-xs font-medium text-primary">
            {fieldErrors.message}
          </p>
        ) : (
          <p id="message-hint" className="mt-1.5 text-xs text-warmgray">
            Preferred days or city help us suggest the earliest suitable slot.
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-warmgray">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-charcoal/20 accent-[var(--color-primary)]"
        />
        <span>
          I consent to my details being stored and used solely to respond to this enquiry.
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary"
        >
          {error}
        </p>
      ) : null}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting || !consent}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <span>{isSubmitting ? "Sending enquiry" : "Send enquiry"}</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-warmgray">
          Handled confidentially. Read our{" "}
          <Link href="/privacy-policy" className="font-medium text-charcoal underline underline-offset-4 hover:text-primary">
            privacy policy
          </Link>
        </p>
      </div>
    </form>
  );
}
