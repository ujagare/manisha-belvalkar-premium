"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /**
   * Huge ghost word rendered behind the heading as the "back" parallax
   * layer. Defaults to the eyebrow text; pass a string to override,
   * or an empty string to disable the layer.
   */
  ghost?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial section heading with a scroll-driven three-layer parallax —
 * a giant ghost word (back), the heading (mid) and the subtitle (front)
 * drift apart as the section travels through the viewport — plus a
 * Canva-style word entrance: the eyebrow, title and subtitle rise into
 * view out of a soft blur, one after the other. Everything runs on
 * framer-motion so it stays in sync with the Lenis smooth scroll.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  ghost,
}: SectionHeadingProps) {
  const scope = useRef<HTMLDivElement>(null);
  const centered = align === "center";
  const ghostWord = ghost !== undefined ? ghost : eyebrow;
  const reduce = useReducedMotion();

  // Scroll progress across the viewport: 0 when the section's top enters
  // the bottom edge, 1 when its bottom leaves the top edge.
  const { scrollYProgress } = useScroll({
    target: scope,
    offset: ["start end", "end start"],
  });

  // Depth layers: back drifts farthest, mid moderate, front gentlest.
  const yBack = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const yMid = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const yFront = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const rise = (distance: number, blurPx: number) =>
    reduce
      ? { opacity: 0 }
      : { opacity: 0, y: distance, filter: `blur(${blurPx}px)` };

  const settle = {
    opacity: 1,
    y: 0,
    ...(reduce ? { filter: undefined } : { filter: "blur(0px)" }),
  };

  return (
    <div
      ref={scope}
      className={cn(
        "relative max-w-3xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {/* Back layer — giant ghost word, farthest drift */}
      {ghostWord ? (
        <motion.div
          aria-hidden="true"
          style={{ y: yBack }}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <span className="sh-ghost select-none whitespace-nowrap font-display text-[18vw] font-bold uppercase leading-none tracking-tight text-charcoal/[0.07] sm:text-8xl">
            {ghostWord}
          </span>
        </motion.div>
      ) : null}

      {/* Mid layer — eyebrow + heading */}
      <motion.div style={{ y: yMid }} className="relative z-10">
        {eyebrow ? (
          <motion.div
            initial={rise(18, 6)}
            whileInView={settle}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className={cn(
              "sh-eyebrow eyebrow mb-4 flex items-center gap-4 text-gold-dark",
              centered && "justify-center",
            )}
          >
            <span className="hairline-gold w-10" />
            <span>{eyebrow}</span>
            <span className="hairline-gold w-10" />
          </motion.div>
        ) : null}
        <motion.h2
          initial={rise(44, 10)}
          whileInView={settle}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.12, ease: EASE }}
          className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-5xl"
        >
          {title}
        </motion.h2>
      </motion.div>

      {/* Front layer — subtitle, gentlest drift */}
      {subtitle ? (
        <motion.div style={{ y: yFront }} className="relative z-10">
          <motion.p
            initial={rise(24, 8)}
            whileInView={settle}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
            className={cn(
              "sh-sub mt-5 text-base leading-relaxed text-warmgray sm:text-lg",
              centered && "mx-auto max-w-2xl",
            )}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      ) : null}
    </div>
  );
}
