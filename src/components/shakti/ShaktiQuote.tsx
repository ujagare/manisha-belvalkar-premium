import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import styles from "@/app/shakti/shakti.module.css";

export default function ShaktiQuote() {
  return (
    <section className="relative overflow-hidden border-t border-gold/25 bg-ivory px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/65 to-transparent"
      />
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-gold/35 bg-[#210b0a] shadow-[0_50px_110px_-52px_rgba(62,12,9,0.88)] sm:rounded-[2.25rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(153,42,29,0.58),transparent_46%),radial-gradient(circle_at_15%_85%,rgba(221,184,41,0.08),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.03),transparent_38%)]"
          />
          {/* Subtle sacred orbital geometry watermark */}
          <svg
            aria-hidden="true"
            viewBox="0 0 320 320"
            fill="none"
            stroke="currentColor"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-gold/[0.08] sm:h-[26rem] sm:w-[26rem]"
          >
            <circle cx="160" cy="160" r="148" strokeWidth="0.7" strokeDasharray="3 7" />
            <circle cx="160" cy="160" r="112" strokeWidth="0.6" />
            <circle cx="160" cy="160" r="68" strokeWidth="0.5" />
            <path d="M160 22 L176 144 L298 160 L176 176 L160 298 L144 176 L22 160 L144 144 Z" strokeWidth="0.55" />
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-4 font-display text-[clamp(7rem,20vw,18rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.02]"
          >
            SHAKTI
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-[1.15rem] border border-gold/14 sm:inset-5 sm:rounded-[1.8rem]"
          />

          <div className="relative grid lg:grid-cols-[0.26fr_0.74fr]">
            <aside className="flex items-center justify-between border-b border-gold/20 px-6 py-4 sm:px-8 sm:py-6 lg:min-h-[32rem] lg:flex-col lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
              <div className="flex items-center gap-3 text-gold-light/85">
                <span className="h-2 w-2 rotate-45 border border-gold/85 bg-gold/20" aria-hidden="true" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
                  A note from Manisha
                </span>
              </div>
              <div
                aria-hidden="true"
                className="hidden h-28 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent lg:block"
              />
              <div className="flex items-center gap-3 lg:flex-col">
                <Sparkles className="h-5 w-5 text-gold" aria-hidden="true" />
                <span className="hidden font-serif text-sm italic tracking-[0.16em] text-cream/50 [writing-mode:vertical-rl] lg:block">
                  Divine feminine wisdom
                </span>
              </div>
            </aside>

            <blockquote className="relative flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-16 lg:min-h-[32rem] lg:px-16 xl:px-20">
              <span
                className="pointer-events-none absolute right-6 top-2 font-serif text-[5.5rem] leading-none text-gold/15 sm:right-12 sm:text-[13rem]"
                aria-hidden="true"
              >
                “
              </span>
              <p className="relative max-w-5xl text-balance font-display text-[1.7rem] font-semibold leading-[1.14] tracking-[-0.02em] text-white sm:text-[clamp(2.25rem,4.2vw,4.5rem)] sm:leading-[1.08]">
                Within every woman lives the energy of the{" "}
                <span className="text-gold-shimmer">Goddess</span>
                <span className="text-cream/82">
                  {" "}— waiting to be remembered, honoured and set free.
                </span>
              </p>

              <footer className="relative mt-8 flex flex-col gap-5 border-t border-gold/22 pt-6 sm:mt-11 sm:flex-row sm:items-center sm:justify-between sm:gap-7 sm:pt-7">
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-gold/70 sm:w-10" aria-hidden="true" />
                  <div>
                    <cite className="block font-serif text-lg not-italic text-gold-light sm:text-xl">
                      Dr. {brand.name}
                    </cite>
                    <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cream/55">
                      {brand.role} · 30+ Years
                    </p>
                  </div>
                </div>
                <Button
                  href="/healing/shakti-healing"
                  size="lg"
                  variant="gold"
                  className={`${styles.tactileButton} shadow-[0_16px_38px_-14px_rgba(221,184,41,0.45)] hover:-translate-y-0.5`}
                >
                  Begin Your Shakti Journey
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </footer>
            </blockquote>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
