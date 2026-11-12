"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

export default function SupportTicketForm() {
  const router = useRouter(); const pathname = usePathname();
  const [subject, setSubject] = useState(""); const [message, setMessage] = useState(""); const [result, setResult] = useState<string | null>(null); const [pending, startTransition] = useTransition();
  return <form onSubmit={(event) => { event.preventDefault(); startTransition(async () => { const response = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message }) }); if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(pathname)}`); return; } const data = await response.json().catch(() => null); setResult(response.ok ? `Ticket created · ${data.ticket.id.slice(0, 8).toUpperCase()}` : data?.error?.message ?? "Could not create ticket."); if (response.ok) { setSubject(""); setMessage(""); } }); }} className="mt-8 sm:mt-12 rounded-2xl sm:rounded-[30px] border border-parchment bg-white p-5 sm:p-8 lg:p-10">
    <p className="eyebrow text-gold-dark">Secure support ticket</p><h2 className="mt-3 sm:mt-4 font-display text-2xl sm:text-3xl font-bold text-charcoal">Send your request</h2>
    <div className="mt-4 sm:mt-6 grid gap-3.5 sm:gap-4"><input required maxLength={160} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="rounded-xl border border-parchment px-4 py-3 text-base sm:text-sm" /><textarea required maxLength={4000} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Explain what you need help with" className="rounded-xl border border-parchment px-4 py-3 text-base sm:text-sm" /></div>
    {result ? <p className="mt-4 rounded-xl bg-gold-soft p-3 text-sm text-gold-deep" role="status">{result}</p> : null}<button disabled={pending} className="mt-4 sm:mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{pending ? "Sending…" : "Create support ticket"}</button>
  </form>;
}
