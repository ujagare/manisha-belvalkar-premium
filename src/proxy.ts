import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicKey, isSupabaseConfigured } from "@/lib/supabase/config";
import { isPaymentsConfigured } from "@/lib/env";

/**
 * Proxy (Next 16 name for middleware).
 *
 * - Generates a fresh per-request nonce and sets a strict
 *   Content-Security-Policy (script-src 'nonce-...' 'strict-dynamic',
 *   no 'unsafe-inline'). Next.js reads the CSP from the request headers
 *   during SSR and applies the nonce to framework/inline scripts.
 * - Refreshes the Supabase session cookie on every matching request.
 * - Redirects unauthenticated visitors away from protected areas
 *   (/checkout, /account, /admin) to /login with a ?next= return path.
 * - Redirects authenticated users away from /login and /signup.
 *
 * When Supabase is not configured yet (placeholder .env.local) every
 * request still gets the CSP and passes through untouched otherwise.
 */

function buildCspHeaders(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  // style-src keeps 'unsafe-inline' on purpose: framer-motion/gsap and
  // React style attributes rely on it; style-based XSS risk is minimal.
  // script-src is the hardened part: nonce + strict-dynamic, no unsafe-inline.
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  return { requestHeaders, cspHeader };
}

export default async function proxy(request: NextRequest) {
  const { requestHeaders, cspHeader } = buildCspHeaders(request);

  if (!isSupabaseConfigured()) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: nothing between createServerClient and getUser may throw.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Protected: require authentication -------------------------------
  // During the pre-Razorpay phase, every checkout stays public and hands off
  // to WhatsApp. Once payments are configured, paid checkout requires auth.
  const protectedCheckout = isPaymentsConfigured() && pathname.startsWith("/checkout") && !pathname.startsWith("/checkout/product/");
  if (!user && (protectedCheckout || pathname.startsWith("/account") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // --- Auth pages: logged-in users go to their account -----------------
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  supabaseResponse.headers.set("Content-Security-Policy", cspHeader);
  return supabaseResponse;
}

export const config = {
  // Run on pages + API that touch auth, but skip static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};