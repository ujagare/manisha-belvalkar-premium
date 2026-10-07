"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, TicketCheck } from "lucide-react";

export default function EventRegistrationButton({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return <div className="mt-4"><button type="button" disabled={pending} onClick={() => startTransition(async () => {
    const response = await fetch("/api/events/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(pathname)}`); return; }
    const data = await response.json().catch(() => null);
    setMessage(response.ok ? `Registration received · ${data.registration.id.slice(0, 8).toUpperCase()}` : data?.error?.message ?? "Registration could not be saved.");
  })} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/50 px-5 py-3 font-semibold text-gold-light disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TicketCheck className="h-4 w-4" />}{pending ? "Registering…" : "Register interest"}</button>{message ? <p className="mt-3 text-xs leading-5 text-gold-light" role="status">{message}</p> : null}</div>;
}
