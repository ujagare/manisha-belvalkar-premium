"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Sets a new password for the recovery session created by the reset email,
 * then signs out and sends the user to /login.
 */
export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      await supabase.auth.signOut();
      setMessage("Password updated. Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 900);
    });
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-charcoal">
            New password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray/70" />
            <input
              id="new-password"
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
            <KeyRound className="h-4 w-4" />
          )}
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-warmgray">
        <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary-dark">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
