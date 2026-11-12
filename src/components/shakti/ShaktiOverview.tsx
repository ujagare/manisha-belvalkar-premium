import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ViewportVideo from "@/components/ui/ViewportVideo";
import { appFeatures, transformationProgram } from "@/lib/data";

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
              <Link href="/contact" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/22 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:border-gold/60 hover:bg-white/[0.08] sm:px-7 sm:py-3.5">
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
  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-20 lg:px-10 lg:py-28" aria-labelledby="oracle-collection-title">
      <div className="absolute -right-44 top-0 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24">
        <Reveal direction="right" className="relative min-h-[20rem] sm:min-h-[34rem] lg:min-h-[42rem]">
          <div className="absolute inset-[8%_5%_2%_14%] rounded-[45%_45%_2rem_2rem] bg-[#6f100d] shadow-[0_42px_100px_-45px_rgba(91,20,13,0.75)]" />
          <Image src="/images/shakti-goddess-oracle-book.png" alt="Shakti Symbols and Guidance book by Dr. Manisha Belvalkar" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain drop-shadow-[0_32px_38px_rgba(80,20,12,0.26)]" />
          <div className="absolute bottom-3 left-2 border border-gold/30 bg-[#fffaf2]/92 px-4 py-3 shadow-xl backdrop-blur-md sm:bottom-4 sm:left-5 sm:px-5 sm:py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-gold-deep">Shakti Book</p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-primary sm:mt-1 sm:text-3xl">₹2,799</p>
          </div>
        </Reveal>

        <Reveal direction="left">
          <p className="font-serif text-lg italic text-primary sm:text-xl">Symbols, stories and sacred guidance</p>
          <h2 id="oracle-collection-title" className="mt-3 text-balance font-display text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.03em] text-charcoal sm:mt-4 sm:text-5xl lg:text-6xl">
            Meet the Goddesses through the <span className="text-crimson-gradient">Shakti Book.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-warmgray sm:mt-7 sm:text-base sm:leading-8">
            Shakti: Symbols &amp; Guidance brings together 52 Goddess illustrations inspired by the sacred 51 Shakti Peethas. Created by Dr. Manisha S. Belvalkar, it offers meaningful guidance for reflection, spiritual practice and a deeper connection with the divine feminine.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "52 beautifully illustrated Goddesses",
              "Symbols and guidance for reflection",
              "Inspired by the 51 Shakti Peethas",
              "Daily wisdom and spiritual insight",
              "Created by Dr. Manisha S. Belvalkar",
              "A meaningful book for sacred practice",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-charcoal/78">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft text-primary"><Check className="h-3 w-3" strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/checkout/product/shakti-deck-guidebook" className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(107,11,11,0.7)] transition duration-300 hover:-translate-y-1 hover:bg-primary-dark">
              Buy the Shakti Book<ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/products/shakti-deck-guidebook" className="text-sm font-semibold text-primary underline decoration-gold/45 underline-offset-8 hover:decoration-primary">View book details</Link>
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
          <Link href="/contact" className="inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#3b0b08] transition duration-300 hover:-translate-y-1 hover:bg-gold-light sm:px-7 sm:py-3.5">Enquire about the journey<ArrowUpRight className="h-4 w-4" /></Link>
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
