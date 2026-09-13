"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}

const offsets: Record<NonNullable<RevealProps["direction"]>, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/** Scroll-triggered reveal — soft Canva-style blur + rise with premium easing. */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = reduce ? { x: 0, y: 0 } : offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...(reduce ? {} : { filter: "blur(8px)" }), ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
