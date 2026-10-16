import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicKey, isSupabaseConfigured } from "@/lib/supabase/config";
import { isPaymentsConfigured } from "@/lib/env";

/**
 * Proxy (Next 16 name for middleware).
 *
 * - Refreshes the Supabase session cookie on every matching request.
 * - Redirects unauthenticated visitors away from protected areas
 *   (/checkout, /account) to /login with a ?next= return path.
 * - Redirects authenticated users away from /login and /signup.
 *
 * When Supabase is not configured yet (placeholder .env.local) every
 * request passes through untouched so the public site keeps working.
 */
export default async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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

  return supabaseResponse;
}

export const config = {
  // Run on pages + API that touch auth, but skip static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
