# Premium Red-Gold Design Reference

> Design system reference for the Manisha Belvalkar site — inspired by premium
> Indian jewellery/wellness brands (reference: Kirtilals, www.kirtilals.com).
> "Sacred Luxury": deep crimson + antique gold + warm neutrals.

---

## 1. Reference Analysis — Kirtilals (www.kirtilals.com)

Live site analysis (fetched + OCR of `red.jpg` desktop screenshot):

### Extracted color palette
| Hex | Role |
|---|---|
| `#982225` | Brand deep crimson/maroon (primary CTA, links, accents) |
| `#a30000` | Darker red (hover / footer / depth) |
| `#7a1340` | Deep plum-maroon (gradient depth) |
| `#c87f44` | Antique gold / bronze (luxury accents, badges) |
| `#20232A` | Near-black (primary text) |
| `#333740` | Charcoal (secondary text / dark sections) |
| `#FFFFFF` / `#ECECEC` | Clean white / light backgrounds |

### Typography (Google Fonts)
| Font | Use |
|---|---|
| **Source Serif Pro** | Elegant serif display — headlines, brand voice |
| **Inter** | Clean modern sans — body, UI, navigation |
| **Montserrat** | Geometric sans — buttons, labels, small caps |

### Premium patterns observed
- **Mega-menu navigation** — rich category flyouts (Shop by Style / Metal / Occasion / Gender) with icon tiles
- **Hero banner** — large serif headline + subheading + gold CTA on red/dark backdrop
- **Category icon tiles** — product images inside rounded tiles with labels
- **Gold coin / badge elements** — heritage marks (Lakshmi gold coin motif)
- **High-contrast CTAs** — red buttons with white text, gold hover states
- **Light gallery sections** — white/`#ECECEC` bands alternating with dark/red bands

---

## 2. Our Site Theme (already red-gold) — mapping

Our `globals.css` `@theme` already implements "Sacred Luxury":

| Token | Value | Kirtilals equivalent |
|---|---|---|
| `--color-primary` | `#b41414` | ≈ `#982225` |
| `--color-primary-dark` | `#8b0f0f` | ≈ `#a30000` |
| `--color-primary-deeper` | `#6b0b0b` | ≈ `#7a1340` |
| `--color-gold` | `#ddb829` | ≈ `#c87f44` (brighter gold) |
| `--color-gold-deep` | `#a8871a` | ≈ `#c87f44` |
| `--color-charcoal` | `#1c1917` | ≈ `#20232A` |
| `--color-warmgray` | `#57534e` | ≈ `#333740` |
| `--color-cream` | `#fdf8f0` | ≈ `#FFFFFF` |
| `--color-ivory` | `#f7f0e3` | ≈ `#ECECEC` |

**Conclusion:** our palette already matches the premium red-gold language.
The gap vs the reference is mostly *patterns*, not colors.

---

## 3. Premium Red-Gold Design Language (apply these)

### Color usage rules
1. **One red, one gold, one neutral** — crimson for action/emphasis, gold for
   luxury accents/headlines, cream/charcoal for structure. Never both at full
   volume.
2. Red CTA on light, gold CTA on dark. Keep gold for *shimmer* headings and
   hairlines only.
3. Use `text-gold-shimmer` (already in `globals.css`) for hero highlight words.
4. Deep sections (`bg-charcoal`) pair with gold eyebrow labels + gold CTAs.

### Typography
- **Playfair Display** — hero + section H2 (we have it)
- **Cormorant Garamond italic** — names, pull-quotes, testimonials (we have it)
- **Inter** — body/UI (we have it)
- Contrast rule: serif for *voice*, sans for *utility*.

### Premium patterns to add (priority order)
1. **Gold marquee ticker** — scrolling band ("Tarot • Soul Purpose • Space
   Clearing • Chakra Therapy •") between hero and about.
2. **Numbered/labeled section eyebrows** — "01 / Services" style eyebrows.
3. **Gold ornament dividers** (`✦` + hairlines — already present).
4. **Hover glow cards** — cards with gold border glow on hover (ServiceCard has
   partial).
5. **Mega/rich nav** — keep simple nav but add gold active pill + shadow (done).
6. **Badge chips** — "Best Seller / New / By Appointment" (present in data,
   ensure gold styling).
7. **Trust/stat band** — "30+ years / PhD / 1500+ clients" as a dark band.

### Gold vs crimson usage map
| Element | Color |
|---|---|
| Primary buttons (light bg) | Crimson `bg-primary` white text |
| Primary buttons (dark bg) | Gold `bg-gold` deep-red text |
| Headline highlight | `text-gold-shimmer` |
| Eyebrows / labels | `text-gold-dark` uppercase letterspaced |
| Section dividers | Gold hairline `hairline-gold` |
| Card borders / focus | `ring` / gold hover border |
| Body text | `text-ink` / `text-warmgray` |

---

## 4. Accessibility & quality gates

- Text on red: always white, weight ≥ 500.
- Text on gold: always `--color-primary-deeper` (#6b0b0b) — never white.
- Gold-on-cream text must be `--color-gold-deep` for contrast.
- Keep `prefers-reduced-motion` handling (already in `globals.css`).
- Every interactive element has `:focus-visible` gold outline (present).

---

## 5. Quick wins (small, high-impact)

- [ ] Add gold marquee band under the hero
- [ ] Style price as `font-display` + crimson with gold suffix
- [ ] Add gold glow to CTA buttons on hover
- [ ] Use `text-gold-shimmer` on "Guidance For the Soul" (done in slider)
- [ ] Add stat band (dark) above footer CTA
