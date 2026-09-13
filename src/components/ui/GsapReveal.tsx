"use client";

import { Children } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GsapRevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  delay?: number;
  duration?: number;
  /** Kept for API compatibility — easing is the house curve. */
  ease?: string;
  /** Kept for API compatibility — reveals fire at viewport entry. */
  start?: string;
  /** Stagger each direct child by this many seconds. */
  stagger?: number;
  /** Animate on mount instead of on scroll. */
  instant?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Canva-style premium reveal — rise + fade with optional soft blur and
 * per-child stagger. Implemented on framer-motion so it stays perfectly
 * in sync with the Lenis smooth scroll.
 */
export default function GsapReveal({
  children,
  className,
  y = 40,
  x = 0,
  scale: s = 1,
  blur: doBlur = false,
  delay = 0,
  duration = 0.9,
  stagger,
  instant = false,
}: GsapRevealProps) {
  const reduce = useReducedMotion();
  const offset = reduce ? { y: 0, x: 0, scale: 1 } : { y, x, scale: s };
  const blurInitial = doBlur && !reduce ? { filter: "blur(8px)" } : {};
  const shown = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    ...(doBlur && !reduce ? { filter: "blur(0px)" } : {}),
  };
  const viewport = { once: true, margin: "-60px" as const };

  // Stagger direct children — each gets its own rising tile.
  if (stagger && stagger > 0 && !reduce) {
    const kids = Children.toArray(children);
    return (
      <div className={cn(className)}>
        {kids.map((kid, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, ...offset, ...blurInitial }}
            {...(instant
              ? { animate: shown }
              : { whileInView: shown, viewport })}
            transition={{ duration, delay: delay + i * stagger, ease: EASE }}
          >
            {kid}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset, ...blurInitial }}
      {...(instant ? { animate: shown } : { whileInView: shown, viewport })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
