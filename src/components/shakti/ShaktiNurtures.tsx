import Reveal from "@/components/ui/Reveal";
import type { ShaktiPillar } from "@/lib/data";
import "@/components/ScrollStack.css";

interface ShaktiNurturesProps {
  pillars: ShaktiPillar[];
}

export default function ShaktiNurtures({ pillars }: ShaktiNurturesProps) {
  return (
    <section className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(221,184,41,0.12),transparent_28%),radial-gradient(circle_at_9%_76%,rgba(180,20,20,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent lg:left-[8%]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:py-32 lg:grid-cols-[1.18fr_0.82fr] lg:gap-24 lg:px-10 lg:py-0">
        <aside className="lg:col-start-2 lg:row-start-1 lg:pt-[18vh]">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div>
              <p className="font-serif text-xl italic tracking-[0.06em] text-primary">
                What Shakti nurtures
              </p>
              <h2 className="mt-4 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-charcoal sm:text-6xl">
                Come home to your <span className="text-crimson-gradient">whole self</span>
              </h2>
              <p className="mt-7 max-w-lg text-pretty text-base leading-8 text-warmgray">
                Shakti is the divine feminine energy within us all. This work brings sacred wisdom into lived experience, helping you feel seen, understand your patterns and move forward with strength and grace.
              </p>

              <div className="mt-10 hidden items-center gap-4 lg:flex">
                <span className="h-px w-12 bg-gold/60" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-deep/80">
                  Scroll to explore
                </span>
              </div>
              </div>
            </Reveal>
          </div>
        </aside>

        <div className="shakti-nurture-stack lg:col-start-1 lg:row-start-1">
          <div className="scroll-stack-inner">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`scroll-stack-card shakti-nurture-card shakti-nurture-card--${index + 1}`}
            >
              <article className="relative flex h-full flex-col justify-between overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-12 font-display text-[10rem] leading-none text-gold/[0.08] sm:text-[13rem]">
                  {index + 1}
                </div>

                <div className="relative flex items-start justify-between gap-6">
                  <span className="font-serif text-2xl italic text-gold-light">0{index + 1}</span>
                  <span className="mt-2 h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-gold-light/75">
                    Shakti
                  </span>
                </div>

                <div className="relative mt-12 max-w-xl">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-gold-light/80">
                    {pillar.tagline}
                  </p>
                  <h3 className="mt-3 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-cream sm:text-5xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-cream/72 sm:text-base">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
