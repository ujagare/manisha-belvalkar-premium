"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Centered elegant light hero — inspired by the original Wix layout.
 * Playfair serif heading, gold shimmer accent, gold ornamental divider,
 * name in serif italic, tagline, dual CTAs, trust stats row.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const goldGlowRef = useRef<HTMLDivElement>(null);
  const crimsonGlowRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger parallax on the ambient glows for depth.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          defaults: { ease: "none" },
        });

        tl.to(goldGlowRef.current, { y: -120 }, 0).to(
          crimsonGlowRef.current,
          { y: 90 },
          0,
        );

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream"
    >
      {/* ============ Background layers ============ */}
      {/* Gold radial glow */}
      <div
        ref={goldGlowRef}
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold/10 blur-[160px]"
      />
      {/* Crimson soft glow */}
      <div
        ref={crimsonGlowRef}
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
      />

      {/* Subtle hairline grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(221,184,41,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(221,184,41,0.4) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
        aria-hidden="true"
      />

      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* ============ Content ============ */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-28 text-center lg:pb-24 lg:pt-36">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-8 flex items-center justify-center gap-4 text-gold-dark"
        >
          <span className="hairline-gold w-12" />
          {brand.heroAction}
          <span className="hairline-gold w-12" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-bold leading-[1.06] tracking-tight text-charcoal sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          <span className="block">Guidance For</span>
          <span className="mt-1 block">
            <GradientText as="span" variant="gold">
              the Soul
            </GradientText>
          </span>
        </motion.h1>

        {/* Gold ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="my-8 flex items-center justify-center gap-4"
        >
          <span className="h-px w-16 bg-gold/50" />
          <span className="font-serif text-2xl text-gold">✦</span>
          <span className="h-px w-16 bg-gold/50" />
        </motion.div>

        {/* Name */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-xl font-medium italic text-warmgray sm:text-2xl"
        >
          — {brand.name} —
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warmgray sm:text-lg"
        >
          {brand.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/contact" size="lg" variant="gold">
            <Sparkles className="h-4 w-4" />
            Book a Session
          </Button>
          <Button href="/services" size="lg" variant="primary">
            Explore Services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Trust stats row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
        >
          <span className="inline-flex items-center gap-1.5 text-warmgray">
            <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
            30+ Years Experience
          </span>
          <span className="inline-flex items-center gap-1.5 text-warmgray">
            <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
            PhD in Tarot Reading
          </span>
          <span className="inline-flex items-center gap-1.5 text-warmgray">
            <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
            4 Sacred Practices
          </span>
        </motion.div>
      </div>

      {/* ============ Scroll indicator ============ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <a
          href="#about"
          className="group inline-flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-warmgray/50 transition-colors hover:text-gold-deep"
        >
          Scroll
          <span className="block h-9 w-px bg-gradient-to-b from-gold/70 to-transparent transition-colors duration-300 group-hover:from-gold-deep" />
        </a>
      </motion.div>
    </section>
  );
}