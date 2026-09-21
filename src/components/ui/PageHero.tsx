"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  contentSide?: "left" | "right";
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Image-led editorial header. Every top-level route receives its own artwork. */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
  imagePosition = "center",
  contentSide = "left",
}: PageHeroProps) {
  const reduce = useReducedMotion();
  const settle = { opacity: 1, y: 0, ...(reduce ? {} : { filter: "blur(0px)" }) };

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-charcoal pt-24 text-white lg:min-h-[720px] lg:pt-28">
      {image ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(221,184,41,0.22),transparent_28%),linear-gradient(135deg,#241b18,#651111)]" />
      )}

      <div
        className={`absolute inset-0 ${
          contentSide === "right"
            ? "bg-[linear-gradient(270deg,rgba(17,13,12,0.94)_0%,rgba(25,17,15,0.8)_38%,rgba(23,16,14,0.25)_68%,rgba(15,12,11,0.08)_100%)]"
            : "bg-[linear-gradient(90deg,rgba(17,13,12,0.94)_0%,rgba(25,17,15,0.8)_38%,rgba(23,16,14,0.28)_68%,rgba(15,12,11,0.12)_100%)]"
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,14,12,0.8)_0%,transparent_38%)]" />
      <div className="absolute inset-y-0 left-[7%] hidden w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent lg:block" />

      <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-end px-6 pb-16 pt-20 lg:min-h-[610px] lg:items-center lg:px-10 lg:pb-20">
        <div className={`max-w-2xl ${contentSide === "right" ? "lg:ml-auto lg:w-[52%]" : ""}`}>
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={settle}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="eyebrow mb-6 flex items-center gap-4 text-gold-light"
          >
            <span className="h-px w-12 bg-gradient-to-r from-gold to-transparent" />
            {eyebrow}
          </motion.div>

          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 46, filter: "blur(10px)" }}
            animate={settle}
            transition={{ duration: 1, delay: 0.22, ease: EASE }}
            className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-white drop-shadow-[0_3px_24px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[5.15rem]"
          >
            {title}
          </motion.h1>

          {subtitle ? (
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={settle}
              transition={{ duration: 0.9, delay: 0.52, ease: EASE }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/76 text-shadow-sm sm:text-lg"
            >
              {subtitle}
            </motion.p>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
      <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-white/55 md:flex">
        <span>Explore</span>
        <span className="h-8 w-px bg-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      </div>
    </section>
  );
}
