"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import GoogleButton from "./GoogleButton";
import { safeInternalPath } from "@/lib/redirects";

/**
 * Premium login form — email/password + Google OAuth.
 * On success redirects to ?next= (default /account).
 */
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!configured) {
      setError("Supabase setup pending — AUTH_SETUP.md dekhein.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full">
      {next !== "/account" ? (
        <div className="mb-6 border-l-2 border-gold bg-gold-soft/70 px-4 py-3 text-sm leading-6 text-gold-deep">
          You were headed to {next.startsWith("/checkout/") ? "complete a booking or place an order" : "a members-only page"}. Sign in below and we&apos;ll take you right back — you won&apos;t lose your place.
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-gold-deep" aria-hidden="true" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-13 w-full rounded-xl border border-parchment bg-white/85 pl-11 pr-4 text-sm text-charcoal shadow-[0_1px_0_rgba(28,25,23,0.03)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-warmgray/50 hover:border-gold/60 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-gold-deep" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-13 w-full rounded-xl border border-parchment bg-white/85 pl-11 pr-12 text-sm text-charcoal shadow-[0_1px_0_rgba(28,25,23,0.03)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-warmgray/50 hover:border-gold/60 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-warmgray transition-colors hover:bg-gold-soft hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-5 text-primary">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "group flex h-13 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold text-white shadow-[0_10px_24px_rgba(139,15,15,0.16)] transition-[background-color,transform,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "bg-primary hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_28px_rgba(139,15,15,0.22)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" role="separator">
        <span className="h-px flex-1 bg-parchment" />
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-warmgray/60">
          Or
        </span>
        <span className="h-px flex-1 bg-parchment" />
      </div>

      <GoogleButton redirectTo={next} />

      <p className="mt-7 text-center text-sm text-warmgray">
        New to the community?{" "}
        <Link
          href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
