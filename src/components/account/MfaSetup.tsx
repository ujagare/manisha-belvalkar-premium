"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/redirects";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function MfaSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get("next") ?? "/account");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => setVerified(data?.currentLevel === "aal2"));
  }, []);

  function enroll() {
    setMessage(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Manisha Belvalkar account" });
      if (error) { setMessage(error.message); return; }
      setFactorId(data.id); setQrCode(data.totp.qr_code); setSecret(data.totp.secret);
    });
  }

  function verify(event: React.FormEvent) {
    event.preventDefault();
    if (!factorId) return;
    setMessage(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) { setMessage(error.message); return; }
      setVerified(true); setMessage("Two-step verification is active for this session.");
      router.refresh(); window.setTimeout(() => router.push(next), 700);
    });
  }

  if (verified) return <div className="rounded-[28px] border border-green-200 bg-white p-8 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-green-600" /><h2 className="mt-4 font-display text-3xl font-bold text-charcoal">Two-step verification active</h2><button type="button" onClick={() => router.push(next)} className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white">Continue securely</button></div>;

  return <div className="rounded-[28px] border border-parchment bg-white p-8">
    <KeyRound className="h-9 w-9 text-gold-dark" /><h2 className="mt-4 font-display text-3xl font-bold text-charcoal">Protect your account</h2><p className="mt-3 leading-7 text-warmgray">Use Google Authenticator, Microsoft Authenticator or another TOTP app. Staff accounts must verify a code before opening operations.</p>
    {!qrCode ? <button type="button" onClick={enroll} disabled={pending} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Set up authenticator</button> : <form onSubmit={verify} className="mt-7 space-y-5"><div className="grid gap-6 sm:grid-cols-[12rem_1fr] sm:items-center"><Image src={qrCode} alt="Authenticator QR code" width={192} height={192} unoptimized className="h-48 w-48 rounded-xl border border-parchment" /><div><p className="text-sm text-warmgray">Scan the QR code. If scanning fails, enter this setup key:</p><code className="mt-3 block break-all rounded-xl bg-ivory p-3 text-xs text-charcoal">{secret}</code></div></div><label className="block text-sm font-medium text-charcoal">Six-digit code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-2 w-full rounded-xl border border-parchment px-4 py-3 text-lg tracking-[0.35em]" /></label><button disabled={pending || code.length !== 6} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Verify and continue</button></form>}
    {message ? <p className="mt-5 rounded-xl bg-gold-soft p-3 text-sm text-gold-deep" role="status">{message}</p> : null}
  </div>;
}
