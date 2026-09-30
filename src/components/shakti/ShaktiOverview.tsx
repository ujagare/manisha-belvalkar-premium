import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
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
          <div className="flex h-full items-center px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-20 xl:px-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 text-gold-light/80">
              <span className="h-px w-10 bg-gold/70" />
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.34em]">The divine feminine within</p>
            </div>
            <h2 className="mt-7 text-balance font-display text-[clamp(3.5rem,6vw,6.5rem)] font-semibold leading-[0.84] tracking-[-0.06em]">
              Shakti<span className="text-gold-shimmer">.</span>
            </h2>
            <p className="mt-7 text-pretty font-serif text-2xl italic leading-relaxed text-white/82 sm:text-3xl">
              The sacred force of creation, courage, intuition and transformation that lives within us all.
            </p>
            <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-white/62">
              Through mentoring, healing, Goddess wisdom and sacred practice, Dr. Manisha Belvalkar helps seekers reclaim their power, honour their journey and return to their fullest self.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="#oracle-reading" className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#3b0b08] transition duration-300 hover:-translate-y-1 hover:bg-gold-light">
                Draw your Shakti card
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-3 rounded-full border border-white/22 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:border-gold/60 hover:bg-white/[0.08]">
                Speak with Manisha
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.12} className="relative min-h-[25rem] overflow-hidden sm:min-h-[34rem] lg:min-h-[38rem]">
          <div className="absolute inset-0 bg-[#5d120d]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/page-heroes/shakti-hero.png"
              aria-label="Shakti divine feminine visual"
            >
              <source src="/videos/shakti-video.mp4" type="video/mp4" />
            </video>
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
    <section className="bg-[#f8f0e4] px-6 py-24 sm:py-32 lg:px-10" aria-labelledby="shakti-pathways-title">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-8 border-b border-[#b88c55]/35 pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <p className="font-serif text-xl italic text-primary">One energy, many doorways</p>
            <h2 id="shakti-pathways-title" className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-7xl">
              Meet Shakti in the way you need <span className="text-crimson-gradient">right now.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-5 divide-y divide-[#b88c55]/28">
          {pathways.map((path, index) => (
            <Reveal key={path.title} delay={index * 0.08}>
              <article className="group grid gap-5 py-9 transition-colors md:grid-cols-[5rem_0.7fr_1.3fr_auto] md:items-center md:gap-8">
                <p className="font-serif text-2xl italic text-gold-deep">{path.number}</p>
                <h3 className="font-display text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">{path.title}</h3>
                <p className="max-w-xl text-sm leading-7 text-warmgray sm:text-base">{path.copy}</p>
                <Link href={path.href} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
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
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-10" aria-labelledby="oracle-collection-title">
      <div className="absolute -right-44 top-0 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24">
        <Reveal direction="right" className="relative min-h-[32rem] sm:min-h-[42rem]">
          <div className="absolute inset-[8%_5%_2%_14%] rounded-[45%_45%_2rem_2rem] bg-[#6f100d] shadow-[0_42px_100px_-45px_rgba(91,20,13,0.75)]" />
          <Image src="/images/shakti-cards-and-book.png" alt="SHAKTI Oracle Deck with its companion guidebook" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain drop-shadow-[0_32px_38px_rgba(80,20,12,0.26)]" />
          <div className="absolute bottom-4 left-0 border border-gold/30 bg-[#fffaf2]/90 px-5 py-4 shadow-xl backdrop-blur-md sm:left-5">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-gold-deep">Complete sacred set</p>
            <p className="mt-1 font-display text-3xl font-semibold text-primary">₹2,993</p>
          </div>
        </Reveal>

        <Reveal direction="left">
          <p className="font-serif text-xl italic text-primary">Created through meditation</p>
          <h2 id="oracle-collection-title" className="mt-4 text-balance font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-charcoal sm:text-6xl">
            Wisdom of the <span className="text-crimson-gradient">51 Shakti Peethas</span>, held in your hands.
          </h2>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-warmgray">
            Born from Dr. Manisha S. Belvalkar&apos;s profound experiences and meditations with the Goddesses, the SHAKTI Oracle is designed for daily guidance, positivity and a more intimate connection with the divine feminine.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "52 beautifully illustrated cards",
              "Companion information guidebook",
              "Sacred box for the complete deck",
              "Daily guidance and spiritual insight",
              "Handcrafted with intention",
              "Gift-ready presentation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-charcoal/78">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft text-primary"><Check className="h-3 w-3" strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/checkout/product/shakti-oracle-deck" className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(107,11,11,0.7)] transition duration-300 hover:-translate-y-1 hover:bg-primary-dark">
              Buy the SHAKTI deck<ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/products/shakti-oracle-deck" className="text-sm font-semibold text-primary underline decoration-gold/45 underline-offset-8 hover:decoration-primary">View complete details</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ShaktiTransformationMap() {
  return (
    <section id="transformation-map" className="relative overflow-hidden bg-[#240907] px-6 py-24 text-white sm:py-32 lg:px-10" aria-labelledby="transformation-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(157,39,24,0.52),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-serif text-xl italic text-gold-light">Journey from a woman to Goddess</p>
              <h2 id="transformation-title" className="mt-4 max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Six months. Six inner <span className="text-gold-shimmer">thresholds.</span>
              </h2>
            </div>
            <p className="max-w-xl text-pretty text-base leading-8 text-white/62 lg:justify-self-end">{transformationProgram.description}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-gold/18 bg-gold/15 md:grid-cols-2 lg:grid-cols-3">
          {transformationProgram.months.map((month, index) => (
            <Reveal key={month.month} delay={index * 0.05} className="h-full">
              <article className="group relative h-full min-h-64 overflow-hidden bg-[#2d0d0a] p-7 transition-colors duration-500 hover:bg-[#3a100c] sm:p-9">
                <p className="font-serif text-lg italic text-gold-light/72">Month {month.month}</p>
                <p className="pointer-events-none absolute -right-2 -top-8 font-display text-[9rem] leading-none text-gold/[0.045]">{month.month}</p>
                <h3 className="relative mt-9 font-display text-3xl font-semibold text-white">{month.title}</h3>
                <p className="relative mt-4 text-sm leading-7 text-white/58">{month.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col gap-6 border-t border-gold/18 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold-light/65">Personalised guided programme</p>
            <p className="mt-2 font-serif text-2xl italic text-white/88">Availability and investment shared by consultation.</p>
          </div>
          <Link href="/contact" className="inline-flex w-fit items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#3b0b08] transition duration-300 hover:-translate-y-1 hover:bg-gold-light">Enquire about the journey<ArrowUpRight className="h-4 w-4" /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ShaktiEveryday() {
  return (
    <section className="bg-[#f8f0e4] px-6 py-24 sm:py-32 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
        <Reveal>
          <Sparkles className="h-7 w-7 text-gold-deep" />
          <p className="mt-6 font-serif text-xl italic text-primary">Shakti, beyond a single session</p>
          <h2 className="mt-4 text-balance font-display text-5xl font-semibold leading-[0.97] tracking-[-0.045em] text-charcoal sm:text-6xl">Carry the practice into <span className="text-crimson-gradient">every day.</span></h2>
          <p className="mt-7 max-w-lg text-base leading-8 text-warmgray">The SHAKTI App is your spiritual companion for guidance, healing and wisdom in your pocket.</p>
          <Link href="/app" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">Discover the SHAKTI App<ArrowUpRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-gold/22 bg-gold/20 sm:grid-cols-2">
          {appFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.07} className="h-full">
              <article className="h-full bg-white/75 p-8 backdrop-blur-sm sm:p-10">
                <p className="font-serif text-lg italic text-gold-deep">0{index + 1}</p>
                <h3 className="mt-8 font-display text-3xl font-semibold text-charcoal">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-warmgray">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
