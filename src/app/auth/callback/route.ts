import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/redirects";

/**
 * OAuth / email-link redirect target.
 * Exchanges the code/token for a session, then sends the user back
 * to ?next= (defaults to /account).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      // Local development runs over plain HTTP. Forcing HTTPS here makes the
      // OAuth callback land on https://localhost:3000 and causes
      // ERR_SSL_PROTOCOL_ERROR. Only use the forwarded host in production,
      // where the public deployment is served over HTTPS.
      const base = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  // No code / exchange failed → drop back to sign-in.
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
