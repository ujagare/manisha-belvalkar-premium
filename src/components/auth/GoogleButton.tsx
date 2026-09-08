"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Google OAuth button. Uses Supabase's built-in Google provider —
 * enable it in Supabase dashboard (see AUTH_SETUP.md) with redirect
 * URL pointing to /auth/callback.
 */
export default function GoogleButton({ redirectTo = "/account" }: { redirectTo?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = redirectTo || searchParams.get("next") || "/account";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleGoogle() {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setError(error.message);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isPending}
        className={cn(
          "flex w-full items-center justify-center gap-3 rounded-full border border-parchment bg-white py-3 text-sm font-semibold text-charcoal shadow-sm transition-all duration-300",
          "hover:border-gold/60 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-gold-dark" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
        )}
        {isPending ? "Redirecting…" : "Continue with Google"}
      </button>
      {error ? (
        <p className="mt-3 text-center text-xs text-primary">{error}</p>
      ) : null}
    </div>
  );
}
