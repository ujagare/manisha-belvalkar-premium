"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";

interface Props {
  applicationId: string;
  applicantName: string;
  phone: string | null;
  reference: string;
  initialStatus: string;
}

function directWhatsAppHref(phone: string | null, name: string, reference: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  const greeting = `Namaste ${name}, thank you for requesting an invitation to Dr. Manisha Belvalkar's Magic Community (Ref: ${reference}). Here are the membership details to join the circle:`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(greeting)}`;
}

export default function CommunityApplicationStatusForm({
  applicationId,
  applicantName,
  phone,
  reference,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const waHref = directWhatsAppHref(phone, applicantName, reference);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/admin/community/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => null);
      setMessage(response.ok ? "Status updated." : data?.error?.message ?? "Update failed.");
      if (response.ok) window.location.reload();
    });
  }

  return (
    <div className="mt-5 space-y-3 border-t border-parchment pt-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          aria-label="Application status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-xl border border-parchment bg-white px-3 text-sm text-charcoal"
        >
          <option value="pending">Pending review</option>
          <option value="approved">Approved / Invited</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="declined">Declined</option>
        </select>

        <button
          type="button"
          onClick={save}
          disabled={pending || status === initialStatus}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-55"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          <span>Save status</span>
        </button>

        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-gold/55 bg-ivory px-4 text-xs font-semibold text-charcoal transition hover:border-gold hover:bg-gold/15"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>Send invite on WhatsApp</span>
          </a>
        ) : null}
      </div>

      {message ? <p className="text-xs text-primary">{message}</p> : null}
    </div>
  );
}
