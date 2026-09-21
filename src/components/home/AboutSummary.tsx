import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";

const stats = [
  { value: "30+", label: "Years of Experience" },
  { value: "4", label: "Sacred Practices" },
  { value: "PhD", label: "In Tarot Reading" },
  { value: "∞", label: "Souls Guided" },
];

/** Editorial premium about section — text left, arched portrait right. */
export default function AboutSummary() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-ivory/60 to-white py-24 lg:py-32">
      {/* Soft tinted glows */}
      <div className="glow-crimson absolute -left-44 top-16 h-[460px] w-[460px]" />
      <div className="glow-gold absolute -right-44 bottom-16 h-[460px] w-[460px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* ============ Text side (left) ============ */}
          <div>
            <Reveal>
              <div className="eyebrow mb-6 flex items-center gap-4 text-gold-dark">
                <span className="hairline-gold w-12" />
                About
              </div>
              <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-[3.4rem]">
                A guide for{" "}
                <span className="text-crimson-gradient">your soul</span>
                <span className="text-gold">.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 text-base leading-relaxed text-warmgray sm:text-lg">
                A holistic well-being coach with over{" "}
                <span className="font-semibold text-charcoal">
                  30 years of experience
                </span>{" "}
                in Tarot Consultation, Soul Purpose Reading, Goddess Attunement,
                and Chakra Therapy.
              </p>
              <p className="mt-4 text-base leading-relaxed text-warmgray sm:text-lg">
                Her tarot readings uncover life&apos;s mysteries, providing
                clarity and direction — aligning your journey with cosmic
                energies so you can make empowered, informed decisions.
              </p>
            </Reveal>

            {/* Pull-quote */}
            <Reveal delay={0.2}>
              <blockquote className="relative mt-8 rounded-r-2xl border-l-4 border-gold bg-white py-6 pl-7 pr-6 shadow-[0_18px_40px_-24px_rgba(180,20,20,0.25)]">
                <Sparkles className="absolute -top-3 right-5 h-5 w-5 text-gold" />
                <p className="font-serif text-xl font-medium italic leading-snug text-charcoal sm:text-2xl">
                  &ldquo;{brand.quote}&rdquo;
                </p>
              </blockquote>
            </Reveal>

            {/* Chips */}
            <Reveal delay={0.25}>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Soul Purpose Reading
                </span>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.3}>
              <div className="mt-9">
                <Button href="/about" size="lg">
                  Know More About Manisha
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ============ Portrait side (right) ============ */}
          <Reveal direction="left" delay={0.15} className="relative">
            {/* Rotating ornament ring behind */}
            <div
              aria-hidden="true"
              className="animate-spin-slow absolute -right-8 -top-8 h-40 w-40 text-gold/40 sm:-right-12 sm:h-52 sm:w-52"
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="48" strokeDasharray="4 6" strokeWidth="1" />
                <circle cx="50" cy="50" r="38" strokeDasharray="1 9" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Arch portrait with gold gradient frame */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-t-[11rem] rounded-b-[1.5rem] p-1.5">
                <div className="absolute inset-0 rounded-t-[11rem] rounded-b-[1.5rem] bg-gradient-to-b from-gold via-gold-light to-gold-deep" />
                <div className="relative h-[540px] w-full overflow-hidden rounded-t-[10rem] rounded-b-[1.25rem]">
                  <Image
                    src="/images/manisha-wix.jpg"
                    alt="Manisha Belvalkar — spiritual mentor"
                    width={1100}
                    height={1653}
                    className="h-full w-full object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating glass stat card */}
              <div className="absolute -bottom-8 -left-4 flex items-center gap-4 rounded-2xl border border-white/60 bg-white/85 px-6 py-5 shadow-2xl backdrop-blur-md sm:-left-8">
                <div>
                  <p className="font-display text-4xl font-bold leading-none text-primary">
                    30+
                  </p>
                  <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-warmgray">
                    Years of Experience
                  </p>
                </div>
                <span className="h-12 w-px bg-gold/50" />
                <div>
                  <p className="font-display text-4xl font-bold leading-none text-gold">
                    PhD
                  </p>
                  <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-warmgray">
                    In Tarot Reading
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ============ Stats row ============ */}
        <Reveal delay={0.15}>
          <div className="mt-24 grid grid-cols-2 gap-y-10 rounded-3xl border border-parchment bg-white/70 px-6 py-10 backdrop-blur-sm sm:grid-cols-4 lg:mt-28 lg:px-12">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i > 0 ? "sm:border-l sm:border-parchment sm:pl-8" : ""
                }
              >
                <p className="font-display text-4xl font-bold text-charcoal lg:text-5xl">
                  <span
                    className={
                      i % 2 === 0 ? "text-crimson-gradient" : "text-gold-shimmer"
                    }
                  >
                    {stat.value}
                  </span>
                </p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-warmgray">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <GoldDivider className="mt-20 lg:mt-24" />
    </section>
  );
}
