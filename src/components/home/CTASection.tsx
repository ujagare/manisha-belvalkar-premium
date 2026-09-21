import { Heart, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/** Full-width CTA section with gradient background. */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      {/* Decorative background pattern */}
      <div className="glow-gold absolute -right-40 -top-40 h-[500px] w-[500px]" />
      <div className="glow-crimson absolute -bottom-40 -left-40 h-[400px] w-[400px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left">
            <div className="eyebrow mb-4 flex items-center gap-3 text-primary">
              <Sparkles className="h-4 w-4" />
              Begin your journey
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-charcoal sm:text-5xl">
              Ready to find{" "}
              <span className="text-crimson-gradient">clarity</span> and
              alignment<span className="text-gold">?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warmgray sm:text-lg">
              Whether you seek answers, alignment, or transformation, Manisha&apos;s
              decades of dedication ensure a personalized and impactful
              experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" size="lg" variant="primary">
                <Heart className="h-4 w-4" />
                Book a Session
              </Button>
              <Button href="/about" size="lg" variant="outline">
                Know More
              </Button>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2rem] bg-charcoal p-10 shadow-[0_35px_90px_-35px_rgba(107,11,11,0.55)] ring-1 ring-gold/25">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(221,184,41,0.18),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(180,20,20,0.3),transparent_34%)]" />
              <svg
                viewBox="0 0 500 500"
                className="absolute h-[125%] w-[125%] animate-spin-slow text-gold motion-reduce:animate-none"
                style={{ animationDuration: "90s" }}
                aria-hidden="true"
              >
                <g fill="none" stroke="currentColor">
                  <circle cx="250" cy="250" r="185" opacity=".28" />
                  <circle cx="250" cy="250" r="135" opacity=".18" />
                  <path d="M250 65 410 342H90Z" opacity=".34" />
                  <path d="m250 435 160-277H90Z" opacity=".34" />
                  <circle cx="250" cy="250" r="72" strokeDasharray="3 10" opacity=".5" />
                </g>
              </svg>
              <div className="relative z-10 max-w-sm text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-2xl text-gold shadow-[0_0_45px_rgba(221,184,41,0.2)]">
                  ✦
                </span>
                <p className="mt-8 font-serif text-3xl font-medium italic leading-snug text-gold-light sm:text-4xl">
                  Your next chapter begins with clarity.
                </p>
                <div className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Wisdom · Healing · Alignment
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
