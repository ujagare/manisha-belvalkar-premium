# SEO Audit Report — manishabelvalkar.com

**Date:** 28 November 2026
**Scope:** Full website (production `https://www.manishabelvalkar.com`) + Next.js 16 App Router source
**Method:** Live HTTP checks of all 64 sitemap URLs, metadata/schema/header inspection, source-code review
**Site type:** Personal brand / spiritual mentor — services, courses, products, content, local (Mumbai + Pune)

---

## 1. Executive summary (Hinglish)

Site ka SEO **technical foundation strong** hai — har page pe title, description, canonical, OG/Twitter tags, JSON-LD, secure headers, sitemap aur robots.txt maujood hain. 64/64 sitemap URLs 200 return karte hain, duplicate titles nahi hain (sirf 2 exceptions), aur images ab poori tarah WebP + compact hain.

Lekin **5 high-priority issues** hain jo rankings aur crawler efficiency ko hurt kar sakte hain:

1. **2 soft-404 pages sitemap me hain** — HTTP 200 ke saath "Shop item not found" dikhate hain.
2. **Non-www aur HTTP versions 200 return karte hain** — proper 301 canonical redirect nahi hai.
3. **Sitemap `lastmod` sab jagah 2026-10-16** — stale signal, 6 weeks purana.
4. **Above-the-fold LCP image lazy load ho rahi hai** — LCP score impact.
5. **`/app` ("SHAKTI App Coming Soon") indexable orphan** — no canonical, no noindex, sitemap me nahi.

Overall estimate: **~76/100** (technical SEO strong, par kuch cleanup aur content opportunities pending).

---

## 2. Scorecard

| Category | Status | Notes |
|---|---|---|
| Crawlability / indexing | ⚠️ Good with gaps | robots.txt + sitemap OK; soft-404s, non-www canonicalization aur `/app` orphan gap |
| Metadata (title/description/canonical) | ✅ Strong | 64/64 pages me title + description + canonical; 1 duplicate pair |
| Structured data | ✅ Strong, 1 gap | Person, ProfessionalService, WebSite, Product, Service, Course, Article, FAQPage, BreadcrumbList; Event schema missing |
| Social / OG | ✅ Good | OG + Twitter tags har page pe; lekin OG image zyadatar pages pe same |
| Headings | ⚠️ Mostly good | 61/64 me exactly 1 H1; 3 pages me H1 missing |
| Images | ✅ Improved | 178 me se 173 raster WebP; 5 SVG (intentional); 44 empty alts (zyadatar decorative) |
| Performance signals | ⚠️ Needs work | LCP image lazy, koi `fetchpriority="high"` nahi; HTML 245–345 KB |
| Security headers | ✅ Excellent | HSTS, CSP, nosniff, referrer-policy, permissions-policy |
| Local SEO | ✅ Good | Address + phone + areaServed in schema; Google Business profile verify karna baaki |
| Content depth | ⚠️ Opportunity | 4 insight articles only; service/course pages conversion-focused, blog hive thin |

---

## 3. Strengths (evidence ke saath)

- **Metadata coverage:** 64 sitemap URLs — sab me `<title>`, `meta description`, `rel=canonical`, `og:title`, `og:image`, `twitter:card` maujood. Canonical mismatch: **0**.
- **Single H1:** 61/64 pages me exactly 1 H1. Duplicate H1: **0**.
- **Structured data global + page-level:**
  - Har page: `Person`, `ProfessionalService`, `WebSite`
  - Product detail: `Product`, `Offer`, `Brand`, `BreadcrumbList`
  - Course detail: `Course`, `Offer`, `BreadcrumbList`
  - Service detail: `Service`, `Offer`, `BreadcrumbList`
  - Insights: `Article`, `BreadcrumbList`
  - `/faq` aur `/contact`: `FAQPage`
- **robots.txt:** `Allow: /`, blocks `/api/`, `/account/`, `/checkout/`, `/login`, `/signup`, `/app/`; sitemap declared. Private pages (`/admin`, `/account`, checkout) me `meta robots = noindex`.
- **404 handling:** random URL → proper **404** status + custom not-found page.
- **Security:** `strict-transport-security: max-age=63072000; includeSubDomains; preload`, CSP with nonce + strict-dynamic, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, Brotli compression.
- **Images:** saare raster assets `.webp`, total conversion se ~81% size reduction; 426 images sampled me se koi bhi `<img>` without `alt` attribute nahi mila.
- **Source-level hygiene:** saare images `next/image` (0 raw `<img>`), 0 `<Image>` bina `alt` prop; `next.config.ts:7-10` me AVIF + WEBP formats aur 30-day image cache configured. Internal links sab `<Link>`, `nofollow` = 0, aur `target="_blank"` wale links pe hamesha `rel` maujood. Keyword stuffing, cloaking/hidden text aur broken internal links: 0 (`next.config.ts:18-19` se `/books` → `/products` 308 redirect valid).
- **Clean URLs:** trailing slash / non-canonical variants canonical tag se www version pe point karte hain.

---

## 4. Issues (priority order)

### 🔴 HIGH

#### H1. Sitemap me 2 soft-404 product URLs (HTTP 200)
- `https://www.manishabelvalkar.com/products/shakti-combo-pack`
- `https://www.manishabelvalkar.com/products/whatsapp-workshops`

**Evidence:** dono URL **200** return karte hain, title = `Shop item not found | Manisha Belvalkar`, H1 = 0, description = generic site description. `getProductBySlug()` null return karta hai (DB me inactive/missing) aur `notFound()` throw hone ke bawajud streamed response 200 chala jata hai. `shakti-combo-pack` `/shakti` page se internally linked bhi hai (`src/components/shakti/ShaktiOverview.tsx:286`), aur `whatsapp-workshops` static catalog (`src/lib/data.ts:829`) me hai.

**Impact:** Google inhe valid product pages samajh kar index karega → thin/duplicate content, canonical confusion, crawl budget waste.

**Fix:** In slug ko `getProducts()`/sitemap se exclude karein ya actual product pages banayein. Agar intentionally unavailable hain to `generateMetadata` me `robots: { index: false }` aur sitemap se hataayein; internal link bhi hataayein ya available product pe redirect karein.

#### H2. Non-www aur HTTP versions par 301 redirect nahi
**Evidence:**
- `http://manishabelvalkar.com/` → **200** (no redirect)
- `https://manishabelvalkar.com/about` → **200** (no redirect), canonical = `https://www.manishabelvalkar.com/about`
- `https://www.manishabelvalkar.com/about/` → **200** (trailing slash variant bhi alive)

**Impact:** ek hi content 3–4 URLs pe available hai. Canonical tag mitigation hai, lekin Google non-www/http ko index kar sakta hai aur signals split ho sakte hain.

**Fix:** Vercel project me `redirects()` config ya edge middleware se `http/non-www` → `https://www` par **308/301** redirect enforce karein; trailing slash ko canonical path pe redirect karein.

#### H3. Sitemap `lastmod` stale aur static
**Evidence:** sitemap ki **64/64** entries ka `lastmod = 2026-10-16T00:00:00.000Z` — aaj se ~6 weeks purana. `src/app/sitemap.ts:12` me `SITE_UPDATED` constant hardcode hai aur `:19-93` tak sab pages usi ko use karte hain; sirf insights (`:97`) real `article.dateModified` use karte hain. DB `updated_at` kahin nahi aa raha.

**Impact:** Google ko freshness signal nahi milta; recently updated services/courses/products pages "old" lagte hain.

**Fix:** DB rows ke `updated_at` ko `lastModified` me use karein; static pages ke liye real deploy/build time ya git commit timestamp.

#### H4. Above-the-fold LCP image lazy
**Evidence:** homepage par `devi-chakra-mandala.webp` include hone wali image `loading="lazy"` hai aur poore page par `fetchpriority="high"` count = **0**. Dev server ne bhi is image ko LCP bataya tha.

**Impact:** LCP delay → Core Web Vitals score kam, especially mobile.

**Fix:** Hero/LCP image ke `next/image` me `priority` (ya `fetchPriority="high"` + `loading="eager"`) add karein. Navbar logo bhi lazy hai — usse bhi priority dein.

#### H5. `/app` indexable thin orphan page
**Evidence:** `https://www.manishabelvalkar.com/app` → **200**, title `SHAKTI App Coming Soon`, `robots: index, follow`, **canonical nahi**, sitemap me nahi. Code: `src/app/app/page.tsx:11-14` me title/description hai lekin `alternates.canonical` ya `robots: {index:false}` nahi. `src/app/robots.ts:9` sirf `/app/` disallow karta hai, `/app` nahi.

**Impact:** "Coming Soon" content thin hai aur canonical ke bina index ho sakta hai; robots.txt aur meta robots ka conflict crawler ko confuse karta hai.

**Fix:** `/app` pe `robots: { index: false, follow: true }` + canonical add karein, ya `robots.ts` me `/app` (slash ke saath/sab ke liye) disallow karein.

---

### 🟡 MEDIUM

#### M1. Sitemap me thin/low-value URLs
`/events`, `/media`, `/live`, `/collections/*`, `/track-order` jaise utility pages sitemap me hain. Ye indexable ho sakte hain lekin inka search demand kam hai. Agar ye thin content hain to `noindex` ya sitemap se removal consider karein (traffic data se decide karein — GSC access nahi hai).

#### M2. OG image zyadatar pages pe same
64 me se 60+ pages ka `og:image = manisha-courses-mentor.webp`. Sirf `/shakti` ka alag hai. Code me root `src/app/layout.tsx:51-73` OG title/description/url aur twitter tags homepage ke liye hardcode hain; jin pages ne khud override nahi kiya (`faq`, `services`, `products`, `insights` etc.) unhe wahi homepage tags inherit hote hain. Social sharing pe har service/course/product ka apna visual nahi dikhta → CTR opportunity loss.

**Fix:** `generateMetadata` me har page ka apna `openGraph.images` + `url` set karein (product/service/course images already available hain).

#### M3. Event pages me `Event` structured data nahi
`/events/online-guidance-session` aur `/events/live-online-workshop` me sirf global schema + BreadcrumbList hai. `Event` schema add karne se event-rich results ka chance milta hai (date/location/online flag ke saath).

#### M4. Empty alt par content image
Sampled pages me 44 empty-alt images maujood hain. Zyadatar decorative ya inactive slider slides hain (theek hai), lekin `/services` par `tarot.webp` ka `alt=""` content image lagta hai — descriptive alt dena chahiye.

#### M5. Global schema har page pe duplicate
`Person`, `ProfessionalService`, `WebSite` har page pe repeat ho rahe hain. Ye invalid nahi hai, lekin `@id` referenced canonical nodes use karna better practice hai (ek hi node, sab pages se reference). Current implementation harmless but less elegant.

#### M6. `/live` aur `/events` near-duplicate indexable pages
Dono alag titles/canonicals ke saath same 2 online offerings cover karte hain (`src/app/live/page.tsx:10-15` + `src/lib/data.ts:1500-1513`; `src/app/events/page.tsx:8` + `src/lib/phase-two-data.ts:38-63`). Ye keyword cannibalization create kar sakte hain. GSC data dekh kar ek ko canonical/merge karna ya alag intent dena chahiye.

#### M7. ~21 generic (title-only) alt texts
`alt={product.title}` jaise generic alts kai jagah hain (e.g. `src/app/products/page.tsx:82,104,113`, `src/components/courses/CourseCatalogExplorer.tsx:303`, `src/components/cart/CartPageClient.tsx:230,355,594`). Ye valid hain lekin descriptive alts image SEO aur accessibility ke liye better honge.

---

### 🟢 LOW / FYI

- 5 SVG files (`next.svg`, `globe.svg`, `file.svg`, `window.svg`, `vercel.svg`) intentionally SVG rakhi gayi — unhe raster me convert nahi kiya (sahi decision).
- HTML size: `/shakti` 345 KB, `/` 245 KB — acceptable, lekin `/shakti` me 68 images (66 lazy) hai; above-fold ko chhod kar lazy sahi hai.
- `hreflang` nahi hai — site single-language (`en-IN`) hai, isliye zarurat nahi.
- `x-robots-tag` header nahi hai — meta robots + robots.txt kaafi hai.
- `src/components/home/Hero.tsx:187` me `href="#about"` hai par repo me `id="about"` nahi — component unused hai, phir bhi cleanup karein.
- Homepage H1 state-dependent hai ("SHAKTI", `ShaktiCardReading.tsx:366-368`); `/shakti` ka H1 `sr-only` hai (`src/app/shakti/page.tsx:33-35`) — valid but brand-only/visually hidden.
- `src/app/layout.tsx:34-39` verification tags env-driven hain aur `.env.example:7-8` khaali hain → empty meta tags emit ho sakte hain. `WebSite` schema me `SearchAction` nahi hai aur `ProfessionalService.sameAs` commented hai (`:135`). `<html lang="en">` (`:153`) vs OG locale `en_IN` — minor mismatch.
- `login`/`signup` pages `robots: index:false, follow:true` rakhte hain jabki `robots.ts:9` dono ko disallow karta hai — consistent karein.
- FAQ JSON-LD raw `JSON.stringify` se inject hota hai (`src/app/faq/page.tsx:14`, `src/components/home/HomeFAQ.tsx:45-47`); `JsonLd.tsx:10` `<` escape karta hai — wahi pattern yahan bhi apnaayein.
- Footer me ek plain `<a href="/contact">` (`Footer.tsx:166-172`) — `<Link>` se replace karna consistent rahega.

---

## 5. Content & keyword observations

- **Strong topical coverage:** Tarot consultation, soul purpose reading, energy healing, chakra therapy, Goddess attunement, mentoring, courses, products — clear service/course/product silos.
- **Titles well-targeted:** `Tarot Consultation in Mumbai & Pune`, `Energy Healing in Mumbai & Pune`, `Spiritual Mentor in Mumbai — 30+ Years` — local + intent keywords present.
- **Thin content area:** sirf 4 insight articles (`/insights/*`). Spiritual guidance niche me informational content ranking ke liye ye kam hai. Service pages conversion-focused hain, explanatory blog depth kam hai.
- **E-E-A-T signals:** 30+ years experience, real address, phone, email, testimonials page, editorial policy, disclaimer, refund/shipping policies — sab maujood hain. Google ke liye positive.
- **Internal linking:** navbar + footer + category links + related products/courses — crawl paths healthy. Broken internal links: 0 (64/64 URLs 200).

---

## 6. Prioritized action plan

| # | Action | Priority | Effort | Expected gain |
|---|---|---|---|---|
| 1 | 2 soft-404 product URLs ko sitemap + internal links se hataayein ya real pages banayein; 404/410 ensure karein | P0 | Low | Index bloat remove, quality signals clean |
| 2 | `http` + non-www + trailing-slash ke liye 301/308 redirect enforce karein | P0 | Low | Consolidated ranking signals |
| 3 | `/app` pe `noindex` + canonical, aur `robots.ts` me `/app` disallow | P0 | Low | Thin orphan index se bachat |
| 4 | `sitemap.ts` me real `updated_at`/commit timestamp se `lastmod` | P1 | Low | Freshness signal improve |
| 5 | Hero/LCP image ko `priority` dena (navbar logo bhi) | P1 | Low | LCP/CWV improve |
| 6 | Har page ka unique `og:image` + `og:url` set karein | P1 | Medium | Social CTR improve |
| 7 | `/events` pages pe `Event` schema | P2 | Low | Rich result eligibility |
| 8 | `/live` vs `/events` canonical/intent consolidate karein | P2 | Medium | Cannibalization remove |
| 9 | Generic alt texts ko descriptive banayein (especially `/services`) | P2 | Low | Accessibility + image SEO |
| 10 | Insights section me 6–10 informational articles add karein (search-intent based) | P2 | High | Organic traffic growth |
| 11 | `@id` se global schema nodes dedupe karein | P3 | Low | Cleaner structured data |
| 12 | `Hero.tsx` ka unused `#about` hash link aur empty verification tags cleanup | P3 | Low | Hygiene |

---

## 7. Verification summary (numbers)

| Check | Result |
|---|---|
| Sitemap URLs checked | 64 |
| HTTP 200 | 64 (including 2 soft-404s) |
| Missing title / description | 0 / 0 |
| Duplicate title pairs | 1 (the 2 soft-404s) |
| Canonical mismatches among sitemap URLs | 0 |
| Canonical missing outside sitemap | 1 (`/app` — indexable orphan) |
| Pages with 0 H1 | 3 (`/collections/book`, 2 soft-404s) |
| `<img>` without `alt` attribute | 0 |
| Empty `alt=""` | 44 (mostly decorative/inactive slides) |
| Missing OG / Twitter tags | 0 / 0 |
| `robots.txt` + sitemap declared | ✅ |
| Security headers | HSTS ✅, CSP ✅, nosniff ✅, referrer-policy ✅ |

---

## 8. Limitations

Ye audit **on-page + technical** hai. Neeche wale data sources available nahi the, isliye unke conclusions nahi nikale gaye:

- Google Search Console (impressions, CTR, index coverage, manual actions)
- Google Analytics 4 real-user engagement / conversions
- Field Core Web Vitals (CrUX / PageSpeed Insights lab-vs-field)
- Backlink profile aur domain authority
- Google Business Profile performance (local pack rankings)
- Keyword difficulty / search volume tools

In ke liye GSC/GA access ya public tools se cross-check recommended hai.

---

## 9. Bottom line

Website ka SEO **structurally healthy** hai — metadata, schema, sitemap, robots, security aur images achhe state me hain. Sabse zyada turant fayda **soft-404 cleanup + canonical redirects + `/app` noindex + LCP fix** se milega. Uske baad content depth, unique OG images aur `/live` vs `/events` consolidation growth le jayenge.

---

## 10. Fix log — 28 Nov 2026 (same day)

Sab upar wale high/medium issues code me fix ho chuke hain:

| Issue | Fix |
|---|---|
| H1 — soft-404 product URLs | `next.config.ts` me dono slugs ke liye server-side **308 redirect** → `/products`; sitemap se exclude; `/shakti` ka internal link bhi `/products` pe bhej diya |
| H2 — http/non-www | `vercel.json` me host + `x-forwarded-proto` based **308 redirects**; `next.config.ts` me `trailingSlash: false` (local me `/about/` → 308 verify) |
| H3 — stale `lastmod` | `src/app/sitemap.ts` me hardcoded `SITE_UPDATED` hata kar deploy-time `new Date()`; insights apni real `dateModified` rakhte hain |
| H4 — LCP image lazy | `ShaktiCardReading.tsx` me mandala image ko `priority` (HTML me `fetchpriority`) |
| H5 — `/app` orphan | `noindex, follow` + canonical; `robots.ts` me `/app` aur `/app/` dono disallow |
| M1/M6 — `/live` duplicate | `noindex, follow` + canonical `/events`; sitemap se hataaya |
| M2 — same OG image | `src/lib/seo.ts` me `socialMeta()` helper; 15 indexable pages ko apna title/description/canonical/hero image |
| M3 — Event schema | Event detail pages pe `Event` JSON-LD (online attendance mode + virtual location) |
| M4/M7 — alt text | 14 generic alts descriptive kiye (product/course/cart/media/services/mentoring) |
| Images lazy loading | 33 files me 64 non-priority `<Image>` ko explicit `loading="lazy"`; priority/preload wale images skip |
| Low issues | `#about` hash → `/about`; footer `<a>` → `<Link>`; login/signup `follow:false`; JSON-LD escaped via `JsonLd`; `@id` schema nodes; `lang="en-IN"`; empty verification tags removed |
| Hygiene | Pre-existing lint errors bhi fix (`invoice.ts` any, `AddressForm` unused import) — `tsc`, `eslint`, `npm test` (40/40) aur `npm run build` sab pass |

**Verified locally:** 308 redirects (`/books`, soft-404 slugs, `/about/`), `/app` + `/live` noindex, unique OG tags, sitemap 61 URLs (clean), Event schema, `fetchpriority` on LCP image, 64 explicit lazy images.

*Report generated from live production checks + source review on 28 Nov 2026. Fix log added same day.*


