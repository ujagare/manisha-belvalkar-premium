import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { ShaktiPillar } from "@/lib/data";
import "@/components/ScrollStack.css";

interface ShaktiNurturesProps {
  pillars: ShaktiPillar[];
}

export default function ShaktiNurtures({ pillars }: ShaktiNurturesProps) {
  return (
    <section
      id="shakti-nurtures"
      className="relative scroll-mt-20 bg-cream"
      aria-labelledby="shakti-nurtures-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_26%,rgba(221,184,41,0.14),transparent_32%),radial-gradient(circle_at_9%_76%,rgba(180,20,20,0.06),transparent_34%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent lg:left-[8%]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 lg:grid-cols-[1.16fr_0.84fr] lg:gap-20 lg:px-10 lg:py-0">
        <aside className="lg:col-start-2 lg:row-start-1 lg:pt-[15vh]">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
                  <span className="h-px w-8 bg-primary/70" aria-hidden="true" />
                  What Shakti nurtures
                </span>
                <h2
                  id="shakti-nurtures-title"
                  className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.06] tracking-[-0.02em] text-charcoal sm:mt-5 sm:text-5xl lg:text-[3.5rem]"
                >
                  Come home to your <span className="text-crimson-gradient">whole self</span>
                </h2>
                <p className="mt-4 max-w-[54ch] text-pretty text-sm leading-7 text-warmgray sm:mt-6 sm:text-base sm:leading-8">
                  Shakti is the divine feminine energy within us all. This work brings sacred wisdom into lived experience, helping you feel seen, understand your patterns and move forward with strength and grace.
                </p>

                {/* Editorial pillar index */}
                <ol className="mt-8 hidden divide-y divide-gold/25 border-y border-gold/25 lg:block">
                  {pillars.map((pillar, index) => (
                    <li
                      key={pillar.title}
                      className="flex items-baseline justify-between gap-4 py-3 text-sm"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-serif text-xs italic text-gold-deep tabular-nums">
                          0{index + 1}
                        </span>
                        <span className="font-medium text-charcoal">
                          {pillar.title}
                        </span>
                      </span>
                      <span className="text-[0.68rem] tracking-[0.12em] text-warmgray/80">
                        {pillar.tagline}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 hidden items-center gap-4 lg:flex">
                  <span className="h-px w-12 bg-gold/70" aria-hidden="true" />
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">
                    Scroll to explore the four pillars
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
                  {/* Atmospheric masked pillar image on right edge */}
                  {pillar.image ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-8 -right-8 top-0 w-3/5 opacity-[0.24] mix-blend-luminosity sm:w-1/2"
                    >
                      <Image
                        src={pillar.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 60vw, 340px"
                        className="object-cover object-center"
                      loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#5b0c12] via-[#5b0c12]/65 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#36070a]/70 via-transparent to-[#36070a]/40" />
                    </div>
                  ) : null}

                  {/* Subtle inset ornamental border */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[1.1rem] border border-gold/15"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-10 font-display text-[9.5rem] leading-none text-gold/[0.08] tabular-nums sm:-right-8 sm:-top-12 sm:text-[13rem]"
                  >
                    {index + 1}
                  </div>

                  <div className="relative flex items-center justify-between gap-5 px-1 pt-1">
                    <span className="font-serif text-xl italic text-gold-light tabular-nums sm:text-2xl">
                      0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-gold/55 via-gold/25 to-transparent" />
                    <span className="rounded-full border border-gold/30 bg-black/20 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-gold-light/85 tabular-nums">
                      0{index + 1} / 0{pillars.length}
                    </span>
                  </div>

                  <div className="relative mt-6 max-w-xl px-1 pb-1 sm:mt-10">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-gold-light/90">
                      {pillar.tagline}
                    </p>
                    <h3 className="mt-2.5 text-balance font-display text-2xl font-semibold leading-[1.06] tracking-[-0.02em] text-cream sm:mt-3 sm:text-4xl lg:text-[2.75rem]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-pretty text-sm leading-6 text-cream/82 sm:mt-4 sm:text-base sm:leading-7">
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
