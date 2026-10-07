"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";

export default function LeadCaptureForm({ kind, source }: { kind: "waitlist" | "community"; source?: string }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [intention, setIntention] = useState(""); const [consent, setConsent] = useState(false); const [result, setResult] = useState<string | null>(null); const [pending, startTransition] = useTransition();
  return <form onSubmit={(event) => { event.preventDefault(); startTransition(async () => { const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, source, name, email, phone, intention, consent }) }); const data = await response.json().catch(() => null); setResult(response.ok ? data.alreadyRegistered ? "You are already on the list." : `Thank you · ${data.reference}` : data?.error?.message ?? "Could not save your request."); }); }} className="mt-8 space-y-4 rounded-[26px] border border-parchment bg-white p-7 text-charcoal">
    <h2 className="font-display text-2xl font-bold">{kind === "community" ? "Apply to join" : "Join the early access list"}</h2>
    {kind === "community" ? <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-parchment px-4 py-3" /> : null}
    <div className="grid gap-4 sm:grid-cols-2"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="rounded-xl border border-parchment px-4 py-3" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-xl border border-parchment px-4 py-3" /></div>
    {kind === "community" ? <textarea value={intention} onChange={(e) => setIntention(e.target.value)} maxLength={1500} rows={3} placeholder="What brings you to this community?" className="w-full rounded-xl border border-parchment px-4 py-3" /> : null}
    <label className="flex items-start gap-3 text-xs leading-5 text-warmgray"><input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />I consent to being contacted about this request. I can opt out at any time.</label>
    {result ? <p className="rounded-xl bg-gold-soft p-3 text-sm text-gold-deep" role="status">{result}</p> : null}<button disabled={pending || !consent || (!email && !phone)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{pending ? "Sending…" : "Submit"}</button>
  </form>;
}
