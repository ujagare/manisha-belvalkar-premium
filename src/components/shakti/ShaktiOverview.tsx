import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ViewportVideo from "@/components/ui/ViewportVideo";
import { appFeatures, products, transformationProgram } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import styles from "@/app/shakti/shakti.module.css";

const shaktiChapters = [
  { number: "01", label: "Oracle Reading", href: "#oracle-reading" },
  { number: "02", label: "The Shakti Book", href: "#shakti-book" },
  { number: "03", label: "Sacred Programs", href: "#shakti-programs" },
  { number: "04", label: "Four Pillars", href: "#shakti-nurtures" },
  { number: "05", label: "Stay Close", href: "#shakti-waitlist" },
] as const;

export function ShaktiChapterNav() {
  return (
    <nav
      aria-label="Shakti page sections"
      className="relative border-y border-gold/22 bg-[#1c0807] text-cream/85"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto px-4 py-3.5 hide-scrollbar sm:px-6 lg:justify-center lg:gap-10 lg:px-10">
        {shaktiChapters.map((chapter, index) => (
          <div key={chapter.href} className="flex shrink-0 items-center gap-3 lg:gap-10">
            <a
              href={chapter.href}
              className="group inline-flex min-h-9 items-center gap-2 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-cream/72 transition-colors duration-300 hover:text-gold-light focus-visible:text-gold-light"
            >
              <span className="font-serif text-[0.72rem] italic text-gold/80 tabular-nums transition-colors group-hover:text-gold-light">
                {chapter.number}
              </span>
              <span className="uppercase">{chapter.label}</span>
            </a>
            {index < shaktiChapters.length - 1 ? (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 border border-gold/45 bg-gold/15"
              />
            ) : null}
          </div>
        ))}
      </div>
    </nav>
  );
}

const pathways = [
  {
    number: "01",
    title: "Oracle wisdom",
    copy: "Receive an intuitive message through 52 illustrated cards inspired by the sacred 51 Shakti Peethas.",
    href: "#oracle-reading",
    link: "Experience a reading",
  },
  {
    number: "02",
    title: "Sacred practice",
    copy: "Build a living relationship with Goddess energy through mantra, ritual, devotion and daily inner listening.",
    href: "#shakti-programs",
    link: "Explore the sadhana",
  },
  {
    number: "03",
    title: "Deep transformation",
    copy: "Move through self-discovery, healing and empowerment in a guided six-month journey with Manisha.",
    href: "#transformation-map",
    link: "See the journey",
  },
] as const;

export function ShaktiIntro() {
  return (
    <section className="relative overflow-hidden bg-[#210806] text-white">
      <div className="pointer-events-none absolute -left-52 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-[90rem] lg:min-h-[38rem] lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="flex h-full items-center px-4 py-12 sm:px-10 sm:py-20 lg:px-12 lg:py-20 xl:px-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-gold-light/80 sm:gap-4">
              <span className="h-px w-8 bg-gold/70 sm:w-10" />
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]">The divine feminine within</p>
            </div>
            <h2 className="mt-4 text-balance font-display text-[2.4rem] font-semibold leading-[0.9] tracking-[-0.045em] sm:mt-7 sm:text-[clamp(3.5rem,6vw,6.5rem)] sm:tracking-[-0.06em]">
              Shakti<span className="text-gold-shimmer">.</span>
            </h2>
            <p className="mt-4 text-pretty font-serif text-xl italic leading-relaxed text-white/82 sm:mt-7 sm:text-3xl">
              The sacred force of creation, courage, intuition and transformation that lives within us all.
            </p>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-7 text-white/62 sm:mt-7 sm:text-base sm:leading-8">
              Through mentoring, healing, Goddess wisdom and sacred practice, Dr. Manisha Belvalkar helps seekers reclaim their power, honour their journey and return to their fullest self.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Link href="#oracle-reading" className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#3b0b08] transition duration-300 hover:-translate-y-1 hover:bg-gold-light sm:px-7 sm:py-3.5">
                Draw your Shakti card
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Link>
              <Link href="/mentoring" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/22 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:border-gold/60 hover:bg-white/[0.08] sm:px-7 sm:py-3.5">
                Speak with Manisha
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.12} className="relative min-h-[18rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[38rem]">
          <div className="absolute inset-0 bg-[#5d120d]">
            <ViewportVideo
              src="/videos/shakti-video.mp4"
              className="h-full w-full object-cover"
              poster="/images/page-heroes/shakti-hero.webp"
              ariaLabel="Shakti divine feminine visual"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#210806] to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-3 border border-gold/25" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ShaktiPathways() {
  return (
    <section className="bg-[#f8f0e4] px-4 py-12 sm:px-6 sm:py-20 lg:px-10 lg:py-28" aria-labelledby="shakti-pathways-title">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-4 border-b border-[#b88c55]/35 pb-6 sm:gap-8 sm:pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <p className="font-serif text-lg italic text-primary sm:text-xl">One energy, many doorways</p>
            <h2 id="shakti-pathways-title" className="max-w-4xl text-balance font-display text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.03em] text-charcoal sm:text-5xl lg:text-7xl">
              Meet Shakti in the way you need <span className="text-crimson-gradient">right now.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-3 divide-y divide-[#b88c55]/28 sm:mt-5">
          {pathways.map((path, index) => (
            <Reveal key={path.title} delay={index * 0.08}>
              <article className="group grid gap-3 py-5 transition-colors sm:gap-5 sm:py-8 md:grid-cols-[5rem_0.7fr_1.3fr_auto] md:items-center md:gap-8 lg:py-9">
                <p className="font-serif text-xl italic text-gold-deep sm:text-2xl">{path.number}</p>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.025em] text-charcoal sm:text-3xl lg:text-4xl">{path.title}</h3>
                <p className="max-w-xl text-sm leading-6 text-warmgray sm:text-base sm:leading-7">{path.copy}</p>
                <Link href={path.href} className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
                  {path.link}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShaktiOracleCollection() {
  const shaktiBook = products.find((p) => p.slug === "shakti-deck-guidebook");
  const shaktiCombo = products.find((p) => p.slug === "shakti-combo-pack");
  const bookPrice = formatINR(shaktiBook?.price ?? 1999);
  const comboPrice = formatINR(shaktiCombo?.price ?? 2993);

  return (
    <section
      id="shakti-book"
      className="relative scroll-mt-20 overflow-hidden bg-cream px-4 py-8 sm:px-6 sm:py-24 lg:px-10 lg:py-32"
      aria-labelledby="oracle-collection-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none hidden sm:block absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-gold/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden sm:block absolute -left-32 bottom-10 h-[26rem] w-[26rem] rounded-full bg-primary/[0.045] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-5 sm:gap-14 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-20">
        <Reveal direction="right" className="relative mx-auto w-full max-w-[268px] min-h-[15.5rem] sm:mx-0 sm:max-w-none sm:min-h-[34rem] lg:min-h-[42rem]">
          {/* Subtle sacred orbital geometry behind the arch */}
          <svg
            aria-hidden="true"
            viewBox="0 0 360 360"
            fill="none"
            stroke="currentColor"
            className="pointer-events-none absolute -right-3 -top-3 h-36 w-36 text-gold/30 sm:-right-6 sm:-top-6 sm:h-72 sm:w-72"
          >
            <circle cx="180" cy="180" r="168" strokeWidth="0.7" strokeDasharray="3 7" />
            <circle cx="180" cy="180" r="132" strokeWidth="0.6" />
            <circle cx="180" cy="180" r="88" strokeWidth="0.5" strokeOpacity="0.6" />
          </svg>

          {/* Sacred temple arch plinth */}
          <div className={`${styles.archHalo} absolute inset-[7%_4%_3%_12%] overflow-hidden rounded-[46%_46%_1.25rem_1.25rem] border border-gold/35 sm:rounded-[46%_46%_1.75rem_1.75rem]`}>
            <div className="pointer-events-none absolute inset-2 rounded-[44%_44%_1rem_1rem] border border-gold/18 sm:inset-3 sm:rounded-[44%_44%_1.35rem_1.35rem]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent sm:h-28" />
          </div>

          <div className={`${styles.mediaZoomFrame} relative h-full min-h-[15.5rem] sm:min-h-[34rem] lg:min-h-[42rem]`}>
            <Image
              src="/images/shakti-goddess-oracle-book.webp"
              alt="Shakti Symbols and Guidance book by Dr. Manisha Belvalkar"
              fill
              sizes="(max-width: 640px) 268px, (max-width: 1024px) 100vw, 48vw"
              className={`${styles.mediaZoom} object-contain drop-shadow-[0_22px_30px_rgba(68,14,10,0.3)] sm:drop-shadow-[0_34px_42px_rgba(68,14,10,0.34)]`}
            />
          </div>

          {/* Artisanal collector's price plaque */}
          <div className={`${styles.plaqueGlass} absolute bottom-2 left-0 rounded-xl border border-gold/40 px-3 py-2 sm:bottom-5 sm:left-4 sm:rounded-2xl sm:px-6 sm:py-4`}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-gold-deep" aria-hidden="true" />
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-[0.6rem] sm:tracking-[0.26em]">
                Shakti Companion Book
              </p>
            </div>
            <div className="mt-0.5 flex items-baseline gap-2 sm:mt-1 sm:gap-2.5">
              <p className="font-display text-lg font-semibold text-primary tabular-nums sm:text-3xl">
                {bookPrice}
              </p>
              <span className="text-[0.62rem] font-medium text-warmgray sm:text-[0.68rem]">
                52 Goddesses
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left">
          <span className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary-dark sm:gap-3 sm:text-xs sm:tracking-[0.24em]">
            <span className="h-px w-5 bg-primary/70 sm:w-8" aria-hidden="true" />
            Symbols, stories &amp; sacred guidance
          </span>
          <h2
            id="oracle-collection-title"
            className="mt-2.5 text-balance font-display text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.02em] text-charcoal sm:mt-5 sm:text-5xl sm:leading-[1.06] lg:text-[3.5rem]"
          >
            Meet the Goddesses through the <span className="text-crimson-gradient">Shakti Book.</span>
          </h2>
          <p className="mt-3 max-w-[62ch] text-pretty text-[13.5px] leading-6 text-warmgray sm:mt-6 sm:text-base sm:leading-8">
            Shakti: Symbols &amp; Guidance brings together 52 Goddess illustrations inspired by the sacred 51 Shakti Peethas. Created by Dr. Manisha S. Belvalkar, it offers meaningful guidance for reflection, spiritual practice and a deeper connection with the divine feminine.
          </p>

          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-gold/25 py-3.5 sm:mt-8 sm:gap-x-6 sm:gap-y-3 sm:py-6">
            {[
              "52 beautifully illustrated Goddesses",
              "Symbols and guidance for reflection",
              "Inspired by the 51 Shakti Peethas",
              "Daily wisdom and spiritual insight",
              "Created by Dr. Manisha S. Belvalkar",
              "A meaningful book for sacred practice",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11.5px] leading-[1.45] text-charcoal/85 sm:gap-3 sm:text-sm sm:leading-6">
                <span className="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border border-gold/55 bg-gold-soft/80 text-primary sm:mt-1 sm:h-4 sm:w-4">
                  <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-8 sm:justify-start sm:gap-6">
            <Link
              href="/checkout/product/shakti-deck-guidebook"
              className={`${styles.tactileButton} group inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-[0_18px_38px_-16px_rgba(107,11,11,0.72)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_22px_42px_-16px_rgba(107,11,11,0.82)] sm:min-h-12 sm:gap-3 sm:px-7 sm:py-3.5 sm:text-sm`}
            >
              Buy the Shakti Book
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/products/shakti-deck-guidebook"
              className="group inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary underline decoration-gold/60 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary sm:min-h-11 sm:gap-1.5 sm:text-sm sm:underline-offset-8"
            >
              View book details
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/25 bg-ivory/80 px-3.5 py-2.5 text-[11.5px] leading-snug text-warmgray sm:mt-6 sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm">
            <span>
              Want both the 52-card deck &amp; book together?{" "}
              <strong className="font-semibold text-charcoal tabular-nums">
                Sacred Combo · {comboPrice}
              </strong>
            </span>
            <Link
              href="/products/shakti-combo-pack"
              className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Explore combo
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ShaktiTransformationMap() {
  return (
    <section id="transformation-map" className="relative overflow-hidden bg-[#240907] px-4 py-12 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28" aria-labelledby="transformation-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(157,39,24,0.52),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-serif text-lg italic text-gold-light sm:text-xl">Journey from a woman to Goddess</p>
              <h2 id="transformation-title" className="mt-3 max-w-4xl text-balance font-display text-[1.85rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:mt-4 sm:text-5xl lg:text-7xl">
                Six months. Six inner <span className="text-gold-shimmer">thresholds.</span>
              </h2>
            </div>
            <p className="max-w-xl text-pretty text-sm leading-7 text-white/62 sm:text-base sm:leading-8 lg:justify-self-end">{transformationProgram.description}</p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-gold/18 bg-gold/15 sm:mt-14 sm:rounded-[2rem] md:grid-cols-2 lg:grid-cols-3">
          {transformationProgram.months.map((month, index) => (
            <Reveal key={month.month} delay={index * 0.05} className="h-full">
              <article className="group relative h-full overflow-hidden bg-[#2d0d0a] p-5 transition-colors duration-500 hover:bg-[#3a100c] sm:min-h-64 sm:p-8 lg:p-9">
                <p className="font-serif text-base italic text-gold-light/72 sm:text-lg">Month {month.month}</p>
                <p className="pointer-events-none absolute -right-2 -top-6 font-display text-[6.5rem] leading-none text-gold/[0.045] sm:-top-8 sm:text-[9rem]">{month.month}</p>
                <h3 className="relative mt-4 font-display text-2xl font-semibold text-white sm:mt-9 sm:text-3xl">{month.title}</h3>
                <p className="relative mt-2.5 text-sm leading-6 text-white/58 sm:mt-4 sm:leading-7">{month.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-col gap-4 border-t border-gold/18 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-8">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold-light/65">Personalised guided programme</p>
            <p className="mt-1.5 font-serif text-xl italic text-white/88 sm:mt-2 sm:text-2xl">Availability and investment shared by consultation.</p>
          </div>
          <Link href="/courses/personalized-wellbeing" className="inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#3b0b08] transition duration-300 hover:-translate-y-1 hover:bg-gold-light sm:px-7 sm:py-3.5">Explore the journey<ArrowUpRight className="h-4 w-4" /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ShaktiEveryday() {
  return (
    <section className="bg-[#f8f0e4] px-4 py-12 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
        <Reveal>
          <Sparkles className="h-6 w-6 text-gold-deep sm:h-7 sm:w-7" />
          <p className="mt-4 font-serif text-lg italic text-primary sm:mt-6 sm:text-xl">Shakti, beyond a single session</p>
          <h2 className="mt-3 text-balance font-display text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.03em] text-charcoal sm:mt-4 sm:text-5xl lg:text-6xl">Carry the practice into <span className="text-crimson-gradient">every day.</span></h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-warmgray sm:mt-7 sm:text-base sm:leading-8">The SHAKTI App is your spiritual companion for guidance, healing and wisdom in your pocket.</p>
          <Link href="/app" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary sm:mt-8">Discover the SHAKTI App<ArrowUpRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-gold/22 bg-gold/20 sm:grid-cols-2 sm:rounded-[1.75rem]">
          {appFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.07} className="h-full">
              <article className="h-full bg-white/75 p-5 backdrop-blur-sm sm:p-8 lg:p-10">
                <p className="font-serif text-base italic text-gold-deep sm:text-lg">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-charcoal sm:mt-8 sm:text-3xl">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-warmgray sm:mt-3 sm:leading-7">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
