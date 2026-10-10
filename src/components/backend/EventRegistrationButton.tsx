"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, TicketCheck } from "lucide-react";
import { eventWhatsAppMessage, manualReference, whatsappUrl } from "@/lib/manual-flow";

export default function EventRegistrationButton({ slug, title, manualMode = false }: { slug: string; title: string; manualMode?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function prepareWhatsApp(reference: string, saved: boolean) {
    window.open(whatsappUrl(eventWhatsAppMessage(title, reference)), "_blank", "noopener,noreferrer");
    setMessage(saved
      ? `Interest saved · ${reference}. Send the prepared WhatsApp message to continue.`
      : `Interest prepared · ${reference}. It is not saved online; send it on WhatsApp.`);
  }

  function register() {
    startTransition(async () => {
      if (manualMode) {
        prepareWhatsApp(manualReference("EVENT"), false);
        return;
      }
      try {
        const response = await fetch("/api/events/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
        if (response.status === 401) {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        const data = await response.json().catch(() => null);
        if (response.ok && data?.registration?.id) {
          prepareWhatsApp(data.registration.id.slice(0, 8).toUpperCase(), true);
          return;
        }
        prepareWhatsApp(manualReference("EVENT"), false);
      } catch {
        prepareWhatsApp(manualReference("EVENT"), false);
      }
    });
  }

  return <div className="mt-4"><button type="button" disabled={pending} onClick={register} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/50 px-5 py-3 font-semibold text-gold-light disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TicketCheck className="h-4 w-4" />}{pending ? "Preparing…" : "Register interest"}</button>{message ? <p className="mt-3 text-xs leading-5 text-gold-light" role="status">{message}</p> : null}</div>;
}
