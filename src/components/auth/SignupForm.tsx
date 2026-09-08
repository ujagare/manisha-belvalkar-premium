"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import GoogleButton from "./GoogleButton";

/**
 * Premium sign-up form — name + email/password (+ Google OAuth).
 * On success redirects to ?next= (default /account).
 */
export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!configured) {
      setError("Supabase setup pending — AUTH_SETUP.md dekhein.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Email confirmation enabled → user must verify.
      if (!data.session) {
        setMessage(
          "Almost there! We sent a confirmation link to your email. Click it to activate your account.",
        );
        return;
      }

      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray/70" />
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-parchment bg-white py-3 pl-11 pr-4 text-sm text-charcoal outline-none transition-colors placeholder:text-warmgray/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-charcoal">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray/70" />
            <input
              id="signup-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-parchment bg-white py-3 pl-11 pr-4 text-sm text-charcoal outline-none transition-colors placeholder:text-warmgray/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-charcoal">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray/70" />
            <input
              id="signup-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-parchment bg-white py-3 pl-11 pr-4 text-sm text-charcoal outline-none transition-colors placeholder:text-warmgray/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-deep">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300",
            "bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-parchment" />
        <span className="text-xs uppercase tracking-widest text-warmgray/70">
          or sign up with
        </span>
        <span className="h-px flex-1 bg-parchment" />
      </div>

      <GoogleButton redirectTo={next} />

      <p className="mt-8 text-center text-sm text-warmgray">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}