# Manisha Belvalkar Premium — Audit Review & Action Plan

Date: 2026-10-09
Project: `C:\Users\ujaga\OneDrive\Desktop\manisha-belvalkar-premium`
Dev server: http://localhost:3000 (verified running, HTTP 200)

This document = (A) the audit summary, (B) independent re-verification of every claim
against the live code/server, (C) corrections found, (D) phased fix plan, (E) what you
must do yourself.

---

## A. Audit ka summary (verdict)

| Area | Score | Reality |
|---|---|---|
| Production readiness | ~55–60% | Backend keys missing, not deployed |
| UI / design | 8/10 | Strong, genuinely premium |
| Product purchase | 5/10 | Works but not atomic, no inventory |
| Session booking | 6.5/10 | Slots fake (hard-coded) |
| Course purchase/access | 4/10 | Courses literally not buyable online (price: null) |
| Security foundation | 7/10 | Good primitives, some gaps |
| Operational readiness | 3/10 | No email, no monitoring, no admin workflows |

Audit's own honesty note is correct: no real payment/booking was submitted (placeholder
keys). All findings are based on rendered pages, API logic, migrations, failure paths.

---

## B. Verification results (maine khud check kiya)

### Critical 1 — Live domain pe Next.js deploy nahi hai → TRUE

| Check | Result |
|---|---|
| `https://www.manishabelvalkar.com/` | HTTP 200, `<title>Home</title>` |
| Wix markers in HTML | `wix` ×1766, `parastorage` ×666, `Wix` ×405 |
| `_next/static` assets on live domain | 0 (absent) |

Verdict: live site purani **Wix** site hai. Yeh Next.js project public pe live nahi hai.
Isliye local improvements (booking/checkout/course) customers ko dikh hi nahi rahe.

### Critical 2 — Backend configured nahi → TRUE

`.env.local` me sirf 2 keys hain:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Missing: Supabase service-role/secret key, Razorpay key id, Razorpay secret,
Razorpay webhook secret.

Runtime proof (abhi, live server pe):
```
GET /api/readyz  -> 503
{"error":{"code":"INTERNAL_ERROR","message":"Service is not configured."}}
```

Consequence: booking DB me save nahi hoti, order create nahi hota, Razorpay modal nahi
khulta, webhook process nahi hota, course entitlement grant nahi hoti, admin dashboard
khaali. **Yeh saare "flow" gaps ek hi root cause se hain.**

### Critical 3 — Guest checkout internally contradictory → TRUE (with nuance)

Code confirm kiya:
- `src/proxy.ts:52` — `/checkout/*` (except `/checkout/product/*`) unauthenticated user ko
  `/login?next=...` pe bhejta hai.
- `src/app/api/payments/verify/route.ts:16-17` — user nahi to `401 UNAUTHORIZED`.
- `src/app/api/checkout/create-order/route.ts:24` + `src/app/api/orders/route.ts:37` —
  guest checkout code likha hua hai.
- Product page: "Sign in required at checkout".

Nuance (important): `src/proxy.ts:17` pe guard hai —
`if (!isSupabaseConfigured()) return NextResponse.next();`
Matlab jab Supabase placeholder hai, proxy poora no-op hai. Isi wajah se mera live test
`GET /checkout/session/x -> 200` (redirect nahi) aa raha hai. **Jin asli keys daalte hi
yeh redirect turant active ho jayega.** To audit bilkul sahi hai: guest fields maujood
hain par guest journey end-to-end complete nahi ho sakti.

Decision chahiye (ek chunna hai, dono nahi):
- **Option A**: Guest checkout poori tarah support karo (verify endpoint se user
  requirement hatao, thank-you page public karo, guest order lookup email+OTP se).
- **Option B** (asaaan + safe): guest UI/API code hata do, saaf-saaf "account required"
  checkout rakho.

### Product purchase — audit claims verified

Sahi hai (good): server-side price re-resolve, browser price trust nahi hoti, Razorpay
order server-side, idempotency key, address ownership check, HMAC + remote amount/currency
verify, terms/privacy/refund checkbox, PIN/phone/email validation, failure page + refund
request.

Confirmed gaps:
| # | Finding | Evidence |
|---|---|---|
| 1 | Zero automated tests | `package.json` scripts = dev/build/start/lint only; no `*.test.*`, no playwright config |
| 2 | Order creation non-atomic | `create-order/route.ts:156` — address→order→items→razorpay→update→payment, koi transaction nahi |
| 3 | Inventory tables exist, checkout use nahi karta | grep `stock_on_hand\|reserved_stock\|inventory` in `api/checkout/` + `lib/` = 0 hits |
| 4 | "Email confirmation" claim, no email code | grep resend/nodemailer/sendgrid = 0 files |
| 5 | Shipping cost upfront nahi | UI "inclusive of all taxes" vs "shipping later" |

### Session booking — verified

Sahi hai: sticky panel, mobile CTA, IST labelled, 4-step flow, auth + rate limit on API,
reschedule/cancel, "instant confirmation nahi" expectation set.

Confirmed gaps:
- Hard-coded slots: `src/components/services/SessionBookingForm.tsx:28`
  `TIME_SLOTS = ["09:30","11:00","12:30","15:00","16:30","18:00"]`
  Dates bhi client-side (next 7 days) → no existing-booking check, no blocked days, no
  capacity, no double-booking prevention, no calendar sync.
- Login sabse aant me, state persist nahi.

### Course purchase — verified, worst flow

`src/lib/checkout.ts:54` — course ka `price: null` hard-coded, `priceLabel: "By consultation"`.
`create-order/route.ts:92` — null price = conflict/confirmation-required.
`CheckoutForm.tsx:201` — fallback: manual enrollment request → WhatsApp.

Matlab: "Enroll Now" kabhi real payment nahi hai. Literally courses online buyable nahi.
Admin workflow bhi nahi (manual confirm karne ka koi UI nahi), manual payment ke baad
entitlement grant karne ka UI nahi, enrollment email nahi, video hosting strategy nahi.

### Security — verified

Good (all real): server-side price, HMAC signature, remote amount/currency check, webhook
signature + dedup, same-origin checks, body size limit, rate limit on create-order,
RLS policies, admin role + AAL2, CSP/HSTS/frame-deny/nosniff, redirect sanitization.

Confirmed issues:
- `/api/orders` pe rate limit **nahi** (sirf `isSameOriginRequest` hai) — create-order pe
  `consumeRateLimit` 2 baar hai. Fallback endpoint spam-able.
- `npm audit` reproduced:
  ```
  0 critical, 5 high, 0 moderate
  braces -> micromatch -> fast-glob -> @next/eslint-plugin-next -> eslint-config-next
  ```
  Note: yeh chain **dev tooling** me hai (eslint), runtime pe nahi. `npm audit fix --force`
  eslint-config-next ko 14.2.35 pe *downgrade* karega = Next 16 ke saath breaking. Isliye
  blindly --force NAHI chalana.
- Invalid bodies kuch routes pe 500 ban sakti hain (400/413/415 chahiye).
- Login abuse: no CAPTCHA, no failed-login alert, no breached-password check.

### Accessibility — verified, audit ke kuch line refs stale hain

Sahi: global `lang="en"` (`layout.tsx:152`) jabki account messages Hinglish; koi automated
axe/Lighthouse suite nahi.

**Corrections:**
1. "Skip to content link nahi hai" → **GALAT**. Link maujood hai:
   `layout.tsx:162` — `<a href="#main-content" ...>Skip to main content</a>` (proper
   sr-only + focus:not-sr-only). Yeh finding drop karein.
2. Nested `<main>` — issue asli hai, par audit ke line refs stale hain. Actual: sirf 2
   jagah `<main>` hai — `layout.tsx:179` (root wrapper) aur
   `components/course/CoursePlayer.tsx:105`. Audit ne healing page L67 / checkout L63 /
   cart L14 cite kiya — un files me `<main>` nahi hai. Fix 1 file me: CoursePlayer ka
   `<main>` → `<div>`.
3. "Sensitive intention notes ke liye explicit consent nahi" → **GALAT / already done**.
   `SessionBookingForm.tsx:58,122,272-273` me consent checkbox hai:
   "I consent to these details being used to respond to my booking request. I understand
   this is a wellbeing service, not medical or psychological treatment." Yeh finding bhi
   drop karein.

### Operations — verified, all TRUE (worst area)

Kuch bhi nahi hai: no transactional email, no WhatsApp/SMS delivery tracking, no Sentry,
no uptime/cert alerting, no payment reconciliation dashboard, admin = counts only, no
inventory UI, no shipping UI, no refund approval workflow, no backup-restore evidence,
no webhook monitoring, no staging env.

---

## C. Real blocker count

Total findings: 3 critical + ~17 high + ~20 medium.

Actually blocking launch — sirf yeh:
1. Supabase production project + migration run
2. Razorpay test-mode keys + webhook secret + endpoint verify
3. Guest vs account checkout decision + implement
4. Course pricing decision (price do, ya "enquiry" ko clearly enquiry bolo)
5. Wix → Next.js domain cutover + post-deploy `/api/readyz` = 200

Baaki sab (tests, inventory, email, booking availability, admin workflows, monitoring)
launch ke baad Phase 2-4 me ho sakta hai — par **real money lene se pehle** #1-#3 aur
inventory reservation zaroori hai.

---

## D. Phased fix plan (effort + who)

### Phase 1 — Launch blockers (aapke keys chahiye)
| Task | Karta kaun | Effort |
|---|---|---|
| Supabase prod project + run `supabase/migrations/20261007083529_backend_foundation.sql` | Aap (account) + main (run/verify) | 30 min |
| `.env.local` me 5 missing keys daalna | **Aap** (keys sirf aapke paas) | 10 min |
| Razorpay test mode: key id + secret + webhook secret | **Aap** | 15 min |
| Webhook endpoint register + test event deliver verify | Main | 30 min |
| Guest vs account decision + code change | Main (aapka 1-line decision) | 2-4 hr |
| Course pricing do ya "enquiry" label badlo | **Aap** (prices aapke) | 15 min |
| `/api/readyz` 200 confirm + product payment test-mode E2E | Main | 1-2 hr |
| DNS/Vercel cutover from Wix | Aap (domain) + main (deploy config) | 1-2 hr |

### Phase 2 — Money & data safety
- Order creation ko transaction / state machine me daalo (orphan orders band).
- Inventory reservation (`stock_on_hand`, `reserved_stock`) checkout me wire karo → no oversell.
- Transactional email (Resend) — order + enrollment + booking confirmations.
- `/api/orders` pe rate limit + idempotency.
- Guest payment verify + guest order lookup (email + OTP) — ya code hata do.
- Payment reconciliation + refund approval admin UI.

### Phase 3 — Booking maturity
- Availability API: real slots, existing bookings, blocked days, capacity, double-booking guard.
- Form state ko sessionStorage me save (login ke baad wapas mile).
- Automated calendar invite / meeting-link workflow.
- Duration + indicative fee booking panel me dikhao.
- Timezone conversion option (IST-only se aage).

### Phase 4 — QA & polish
- Playwright E2E: product checkout, cart checkout, session booking, course enrollment,
  payment success/failure, duplicate callback, webhook retry, guest vs signed-in.
- axe accessibility tests + Lighthouse mobile.
- Nested `<main>` fix (CoursePlayer.tsx:105), `lang` per-route (Hindi pages ke liye).
- Sentry + uptime/cert alerting.
- Dependency chain update *properly* (eslint-config-next downgrade ke bina).

---

## E. Aap ab kya karein (simple steps)

1. **Supabase project banao** (supabase.com → New project). Settings → API se:
   `Project URL`, `anon key`, `service_role key` copy karo.
2. **Razorpay account** (test mode pehle) → Settings → API Keys se `Key ID` + `Key Secret`
   copy karo. Webhooks → New webhook → URL `https://<your-domain>/api/webhooks/razorpay`,
   events: `payment.captured`, `payment.failed`, `refund.processed` → `Webhook Secret` copy karo.
3. Yeh 6 values mujhe bhej do (ya khud `.env.local` me daalo):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   RAZORPAY_WEBHOOK_SECRET=
   ```
4. Do decisions batao (chhote jawab):
   - Guest checkout chahiye, ya login zaroori?
   - Courses ke actual prices kya hain? (ya woh enquiry-only rahenge?)
5. Phir main migration run karke `/api/readyz` 200 kar dunga aur Razorpay test-mode me ek
   real end-to-end payment chala ke dikhata hoon.

Security note: service_role key aur Razorpay secrets **kabhi** git me na jaayein aur
`NEXT_PUBLIC_` prefix ke bina hi rahein (warna browser me leak ho jayenge).

---
---

# ROUND 2 — Re-check after user's changes (2026-10-09 ~17:40)

User ne changes kiye. Maine dobara poora verify kiya. Files ~16:31–16:53 badle
(`.codex-*` logs se lagta hai Codex/session ne kaam kiya). `git diff --stat`:
43 files, +1612 / −804.

## ✅ Naya kya hua — VERIFIED THEEK

| # | Change | Proof |
|---|---|---|
| 1 | **Test harness add hua** (`npm test` script + `tests/critical-flows.test.mjs`) | Maine chalaya: **6 tests, 6 pass, 0 fail** (1110ms). Covers: product order msg, course enrollment vs product, session slot+ref, contact enquiry, cart empty/ready, manual-fallback trigger |
| 2 | **Build clean pass** | `npx next build`: "✓ Compiled successfully in 40s", "Finished TypeScript in 2.4min", **zero errors**. Saare routes prerender (products/services/mentoring SSG) |
| 3 | **Login-before-form fixed** | `SessionBookingForm.tsx:78-103` — `sessionStorage` me `{format,date,time,notes,step}` save/restore. Login ke baad user ka selection wapas milega. Audit ka High #2 band ✔ |
| 4 | **Product guest path khula** | `proxy.ts:52` — ab `/checkout/product/*` exempt hai (login gate se bahar) |
| 5 | **Manual/WhatsApp flow centralise** | Naya `src/lib/manual-flow.ts` — 9 message builders. 8 components use karte hain. WhatsApp number consistent: **919922246111** (3 jagah, sab same) |
| 6 | **"Missing" audit items actually pehle se the** | Skip-to-content (`layout.tsx:162`) ✔, booking consent checkbox (`SessionBookingForm.tsx:272`) ✔, cart page me nested `<main>` nahi hai ✔ |

## ❌ Abhi bhi baaki — VERIFIED ABHI BHI PRESENT

| # | Item | Fresh proof (abhi) |
|---|---|---|
| 1 | **Backend keys nahi** | `.env.local` mtime **Sep 3** (aaj nahi chhua, 8 lines). `GET /api/readyz` → **503 "Service is not configured."** `healthz` → 200. Missing: SUPABASE_SERVICE_ROLE_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET |
| 2 | **Course price abhi bhi null** | `src/lib/checkout.ts:54` → `price: null`, `priceLabel: "By consultation"`. Courses online buyable nahi |
| 3 | **Guest contradiction AADHA reh gaya (naya nuance)** | `create-order/route.ts:24-35` — guest order ab allowed (`guestEmail` required, rate limit `guestEmail` se). Par: `/checkout/course/*` pe `!user` → login redirect (`checkout/[type]/[slug]/page.tsx:44-46`), aur **`payments/verify/route.ts:16` me guestEmail support 0 hits** — `if (!user) return 401`. Matlab guest **paid product** order create kar sakta hai par **verify nahi kar sakta** → paisa leke entitlement stuck. ⚠ |
| 4 | **Inventory wire nahi** | `stock_on_hand\|reserved_stock\|inventory` in `api/checkout/` + `lib/` = **0 hits** |
| 5 | **Email implementation nahi** | resend/nodemailer/sendgrid/postmark/smtp grep = **0 files**. Par UI abhi bhi bolta hai "Your order confirmation will be sent by email" (`checkout/[type]/[slug]/page.tsx:85`) — yeh line ab **misleading** hai |
| 6 | **`/api/orders` pe rate limit/idempotency nahi** | `consumeRateLimit\|idempot` count = **0** |
| 7 | **Webhook guest orphan risk** | `webhooks/razorpay/route.ts` — `course_enrollments.upsert({ user_id: order.user_id, ... })`; guest order me `user_id` null → non-null column pe fail |
| 8 | **Nested `<main>`** | Sirf bacha: `CoursePlayer.tsx:105` (`<main>` → `<div>`) |
| 9 | **Dependency chain** | `npm audit` abhi bhi **5 high** — sab eslint-config-next→fast-glob→micromatch→braces (dev-only). `--force` mat chalao |
| 10 | **Live domain** | www.manishabelvalkar.com → HTTP 200, `<title>Home</title>`, **wix ×2183, `_next/static` ×0**. Abhi bhi Wix |

## Round 2 verdict

Code quality side pe kaafi progress: **tests aa gaye (6/6 pass), build clean, session
persistence fix, manual flow centralise, product guest path khula.**

Par **launch blockers bilkul waise hi hain**: keys nahi (readyz 503), courses
non-buyable, guest verify incomplete, domain Wix pe. Audit ka ~55-60% readiness
score ab shayad **~62-65%** ho — UI/testing me sudhar, par backend/ops me kuch nahi.

**Sabse zaroori naya catch**: guest product checkout ka order create ho jayega par
`payments/verify` 401 dega — yani customer ka paisa katega aur course/product unlock
nahi hoga. Real keys daalne se pehle isse theek karna **must** hai. Do options:
- verify route me `guestEmail` + order ka email match karke verify allow karo, YA
- guest ke liye `/checkout/product/*` ko wapas login-gated kar do (jab tak verify ready na ho).

Aur UI text "email confirmation bheja jayega" se hata do jab tak Resend wire na ho.