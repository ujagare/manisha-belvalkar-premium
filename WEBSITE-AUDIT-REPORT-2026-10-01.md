# Website audit report — 1 October 2026

Website: Manisha Belvalkar — Guidance for the Soul  
Stack reviewed: Next.js 16.3.2, React 19, Tailwind CSS 4, Supabase integration, App Router  
Audit type: source-code, build, route, SEO, UX, accessibility, security and operational-readiness review

## Executive summary

The website has moved well beyond a basic brochure site. Its visual system is distinctive, its offering pages are detailed, and the legal, support, events, account, testimonials and insights layers added in Phases 1–3 materially improve trust and discoverability.

The public-information portion is close to launch quality. The transaction and account portion is not yet fully operational because the current local Supabase values are placeholders and checkout records an order before handing the visitor to WhatsApp; it does not collect or verify payment. Security hardening, accessibility refinements and asset optimisation should be completed before paid traffic is sent to the website.

**Overall readiness score: 7.5/10**

| Area | Score | Assessment |
|---|---:|---|
| Visual design and branding | 8.8/10 | Premium, consistent and recognisable |
| Information architecture | 8.3/10 | Broad coverage; some important flows remain outside the primary navigation |
| Content and trust | 8.4/10 | Strong legal, FAQ, testimonial and editorial layers; owner approval is still required |
| SEO foundation | 7.8/10 | Metadata, sitemap, robots and article schema exist; commerce schema and accurate modification dates are missing |
| Accessibility | 7.0/10 | Focus styles and reduced-motion support exist; skip navigation and some interaction semantics need work |
| Performance | 6.8/10 | Next Image is used well, but several source assets are unusually large |
| Security and privacy | 6.2/10 | RLS and server-side user checks are good; redirect validation, headers and rate limiting are missing |
| Commerce and operations | 5.7/10 | Catalogue and order model exist; payment, fulfilment tooling and production configuration remain incomplete |

## What is working well

1. **Brand and interface:** Playfair/Cormorant/Inter typography, warm cream/crimson/gold palette, image-led heroes and restrained motion create a coherent premium identity. Layouts use sensible max-widths and responsive grids.
2. **Offering architecture:** Services, mentoring, healing, courses, products and Shakti have both listing and detail experiences. Related content and back-navigation reduce dead ends.
3. **Trust layer:** Privacy, terms, refund/cancellation, shipping, disclaimer, grievance, FAQ, support, testimonials and editorial-policy pages are present and linked from the footer.
4. **Content authority:** The Insights hub provides four focused articles with author attribution, cautious health boundaries, canonical URLs and Article JSON-LD.
5. **SEO fundamentals:** Root metadata, per-page metadata on major routes, canonical links, robots.txt, sitemap.xml, Person/ProfessionalService/WebSite schemas and FAQ/article structured data are implemented.
6. **Authentication design:** Supabase SSR clients, session refresh, protected account/checkout routes and RLS policies use a sound basic structure. Order-detail queries are scoped by both RLS and `user_id`.
7. **Resilience:** A branded 404 and many route-level skeletons are present. Reduced-motion preferences and visible global focus styles are respected.
8. **Route integrity:** The production build generated 82 pages. All 56 public URLs currently listed in the sitemap returned HTTP 200 on the local production server. The custom 404 returned HTTP 404.

## Critical findings — complete before public commerce launch

### P0 — Production backend is not configured

The local `.env.local` contains placeholder Supabase URL/key values. Consequently, public content works, but signup, login, protected checkout and account/order functionality are not production-ready.

**Required action:** create/link the production Supabase project, run and verify `supabase/schema.sql`, configure email/OAuth redirects for the production domain, set deployment environment variables, and perform end-to-end signup/reset/login/order tests.

### P0 — Checkout is an enquiry/order-recording flow, not payment checkout

The current flow creates a `pending` database order and then opens WhatsApp. It explicitly takes no payment. There is no payment intent, webhook verification, receipt, tax invoice, payment success/failure state or automatic reconciliation. Repeated clicks/sessions can create duplicate pending orders.

**Required action:** either rename the flow everywhere to “Request booking/order” and keep it manual, or integrate a payment provider with server-created orders, idempotency, signed webhooks and verified status updates.

### P0 — Redirect destinations are not allow-listed

The `next` query parameter is consumed by login/signup and appended in auth callback/confirmation redirects without a central internal-path validator. This creates open-redirect and malformed-redirect risk.

**Required action:** accept only paths beginning with a single `/`, reject protocol-relative paths such as `//domain`, and fall back to `/account`.

### P0 — API abuse controls are missing

`POST /api/orders` authenticates the user and validates the catalogue item, which is good, but has no rate limit, request-size guard, idempotency key or duplicate-order window.

**Required action:** add per-user/IP rate limiting, limit JSON body size, implement idempotency and log suspicious repeated requests. Apply equivalent protection to contact or assessment endpoints if those later become server-backed.

## High-priority findings

### Security headers

`next.config.ts` does not define a Content Security Policy, HSTS, frame protection, Referrer-Policy or Permissions-Policy. Add and test appropriate response headers before deployment. CSP must account for Supabase, Google OAuth and any future payment/analytics providers.

### Media optimisation

The largest current source assets include a 7.84 MB course image, a 5.5 MB video, many oracle-card PNGs around 2.5–2.9 MB each, and page heroes around 2.6 MB. Next Image reduces delivery cost for rendered images, but large sources still increase storage, transformation work and cache misses.

**Required action:** convert photographic PNGs to AVIF/WebP, right-size card images, provide a video poster, compress the MP4 or stream it, and verify LCP/CLS/INP on a deployed preview using mobile throttling.

### Missing error boundaries

Loading states exist for many routes, but there is no route-level `error.tsx` or root `global-error.tsx`. A runtime data failure can fall through to a generic framework error.

**Required action:** add branded retryable error states at root, shop/account and content-route levels.

### Accessibility gaps

- There is no skip-to-content link, even though every page repeats a large header/navigation block.
- The root content target is `id="top"` rather than a dedicated `main-content` skip target.
- The editorial policy page renders its own `<main>` inside the root layout `<main>`, creating nested main landmarks.
- Chakra answer buttons visually express selection but should expose `aria-pressed` or radio-group semantics.
- Form errors and success messages should consistently use `aria-live`/`role="alert"` and move focus when appropriate.
- Custom cursor and animated sections need keyboard and screen-reader testing in a real browser, not only linting.

WCAG 2.2 expects a mechanism to bypass repeated blocks and a logical focus order. Reference: [W3C Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks) and [W3C Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html).

### Chakra assessment positioning and privacy

The assessment says “higher = more healing needed.” That wording can sound diagnostic even though the broader site includes disclaimers. The entered name/email and scores are assembled into a WhatsApp message rather than stored by the website.

**Required action:** label it clearly as a non-clinical self-reflection tool, explain exactly that submission opens WhatsApp before collecting details, and avoid diagnostic-sounding score labels.

## SEO and content findings

### Strengths

- Canonicals, sitemap, robots and descriptive page metadata are in place on primary routes.
- Public account, API, checkout and auth routes are excluded in robots.txt.
- Insights use Article JSON-LD, and FAQ uses FAQ structured data.
- Internal product/service/category links are crawlable links rather than JavaScript-only navigation.

### Improvements required

1. Add `Product`/`Offer` structured data with actual price, currency and availability on product detail pages. Google explicitly recommends Product structured data for richer product understanding and search eligibility: [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product).
2. Add BreadcrumbList schema to deep service, healing, mentoring, course, product, event and insight pages.
3. Add real `datePublished` and `dateModified` values to insights only after an actual editorial date is recorded. Do not invent or automatically refresh dates.
4. The sitemap currently assigns the current build time to every URL. Replace this with real content modification dates; legal/static pages should not look newly modified on every build.
5. `/books` and `/books/[slug]` use temporary redirects. Use permanent redirects after confirming the migration is final.
6. Add a real square logo to Organization schema and verified social-profile `sameAs` URLs when the owner supplies them.
7. Generate a deliberate 1200×630 social-sharing image; the current global portrait is 1200×1800 and may crop unpredictably.
8. Register the live domain in Google Search Console and validate JSON-LD with Rich Results Test. Google recommends accurate, visible structured data and post-deployment validation: [Google structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
9. Keep future Insights people-first and based on demonstrated expertise; avoid publishing volume merely for search freshness: [Google helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## UX and conversion findings

1. **Primary navigation is crowded but incomplete:** it exposes eight destinations, while About, Services, Insights, Events and FAQ rely on footer/internal links. A grouped desktop navigation or compact “Explore” menu would make high-intent paths easier to find without adding more individual links.
2. **CTA terminology varies:** “Book,” “Confirm booking,” “Order,” “Continue on WhatsApp,” and “Send Message” represent different commitment levels. Use a controlled vocabulary: “Enquire,” “Request booking,” “Pay securely,” and “Confirmed.”
3. **Contact flow is transparent but not a true submission:** the form opens WhatsApp and does not save or email the enquiry. “Send on WhatsApp” would be a more precise button label.
4. **Events have no actual schedule:** “next date on enquiry” avoids fake dates, but conversion will improve only when verified date, timezone, duration, capacity and registration deadline are displayed.
5. **Testimonials need governance:** retain written publication consent, verify displayed names/roles and do not add aggregate ratings unless the evidence is documented.
6. **Operational statuses are manual:** account order progress depends on staff updating Supabase. Staff need a reliable private workflow and notification process.

## Pages still required

### Required for the chosen commercial model

| Page/flow | Why it is required | Priority |
|---|---|---:|
| Booking / schedule page | Lets users select offering, timezone, date and availability without an unstructured chat | P0 |
| Payment success page | Shows verified reference, amount, next step and receipt after payment | P0 if online payment is added |
| Payment failed/cancelled page | Provides recovery without duplicate charges/orders | P0 if online payment is added |
| Account profile & contact details | Lets users correct name, phone and delivery/contact information | P1 |
| Staff order/booking operations view | Enables confirmation, cancellation, fulfilment and audit history | P1; private, not public |
| Course library / lesson access | Required if courses are sold and delivered digitally through this website | P1 if applicable |
| Event registration confirmation | Gives date, timezone, joining instructions and cancellation link | P1 when dated events launch |

### Recommended, not immediately mandatory

| Page/flow | Condition |
|---|---|
| Accessibility statement | Recommended after keyboard/screen-reader audit and publishing a contact route for accessibility issues |
| Cookie preferences | Required when optional analytics, advertising or non-essential tracking is introduced; not needed for necessary auth cookies alone |
| Media/press detail pages | Useful when verified interviews, dates and source URLs are available |
| Site-wide search | Useful only as the content/article library grows significantly |
| Hindi/Marathi versions | Valuable if the business can maintain accurate translations and customer support in those languages |

## Legal and privacy review

The legal suite is unusually complete for a site at this stage, but it is still a business draft, not legal advice. The owner/legal reviewer must confirm cancellation windows, return eligibility, shipping timelines, contact/address details, grievance-officer designation and actual data-processing vendors.

Before collecting data in production, create a data inventory covering Supabase, hosting, WhatsApp, email, OAuth, payment, analytics and support tools. Ensure the privacy notice matches real practice and provides a workable withdrawal/grievance path. India’s DPDP framework requires clear notice and consent handling; official references include the [Digital Personal Data Protection Act, 2023](https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf) and [DPDP Rules, 2025 Gazette notification](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf).

## Engineering quality

- Production build: passed; 82 pages generated.
- Public sitemap runtime test: 56/56 URLs returned HTTP 200.
- ESLint: 0 errors, 20 warnings. Most warnings are unused imports/variables and should be cleared before a strict CI gate is enabled.
- Custom 404: present and returns HTTP 404.
- Route-level loading UI: broad coverage.
- Error boundaries: absent.
- Automated tests: no unit, integration or end-to-end test suite is configured.
- CI/CD checks: no repository workflow was found for lint/build/test enforcement.
- Next configuration: effectively empty; security headers and the reported workspace root warning remain unresolved.

## Recommended Phase 4 plan

### Phase 4A — launch blockers

1. Configure and test production Supabase.
2. Validate all `next` redirects as internal paths.
3. Decide manual-enquiry versus online-payment checkout and make wording/flow consistent.
4. Add order API rate limiting, idempotency and duplicate protection.
5. Add security headers and branded error boundaries.
6. Complete owner/legal approval of policies and testimonial permissions.

### Phase 4B — conversion and operations

1. Build booking/schedule selection.
2. Add profile/contact management and staff order operations.
3. Add verified event schedules and confirmation flows.
4. Add payment success/failure pages if a gateway is integrated.

### Phase 4C — quality and growth

1. Compress/convert heavy assets and measure Core Web Vitals on a deployed preview.
2. Complete keyboard, screen-reader and contrast audit; add skip navigation and interaction semantics.
3. Add Product and Breadcrumb structured data plus a dedicated social image.
4. Replace synthetic sitemap timestamps with real modification data.
5. Add automated tests and CI checks.

## Final verdict

The website is strong enough for stakeholder review and for launching its public informational content after owner approval. It should not yet be marketed as a fully automated shop, booking system or member platform. Complete Phase 4A before accepting production accounts/orders, and complete the relevant parts of Phase 4B before enabling online payments or digital-course delivery.

No application code was changed during this audit; this report is the only new artifact.
