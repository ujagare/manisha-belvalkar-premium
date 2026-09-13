"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial page header — eyebrow, title and subtitle rise into view out
 * of a soft blur on load (Canva-style), one after the other.
 */
export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  const reduce = useReducedMotion();
  const settle = { opacity: 1, y: 0, ...(reduce ? {} : { filter: "blur(0px)" }) };

  return (
    <section className="relative overflow-hidden bg-ivory pb-16 pt-32 lg:pb-20 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[420px] w-[420px]" />
      <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={settle}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="eyebrow ph-eyebrow mb-5 flex items-center justify-center gap-4 text-gold-dark"
        >
          <span className="hairline-gold w-10" />
          {eyebrow}
          <span className="hairline-gold w-10" />
        </motion.div>
        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 46, filter: "blur(10px)" }}
          animate={settle}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={settle}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="ph-sub mx-auto mt-6 max-w-2xl text-base leading-relaxed text-warmgray sm:text-lg"
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
