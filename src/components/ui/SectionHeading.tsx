"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitWords, prefersReducedMotion } from "@/lib/anim";
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

/**
 * Editorial section heading with a scroll-driven three-layer parallax —
 * a giant ghost word (back), the heading (mid) and the subtitle (front)
 * drift apart as the section travels through the viewport — plus the
 * GSAP word-by-word reveal. Scroll parallax uses framer-motion
 * useScroll (same proven pattern as the hero) so it stays in sync with
 * the Lenis smooth scroll.
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

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const h2 = scope.current?.querySelector<HTMLHeadingElement>("h2");
      if (!h2) return;

      // Word-by-word reveal (once, near viewport entry).
      const words = splitWords(h2);
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: scope.current,
          start: "top 88%",
          once: true,
        },
      });

      if (eyebrow) {
        tl.fromTo(
          ".sh-eyebrow",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0,
        );
      }
      tl.fromTo(
        words,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.02 },
        eyebrow ? 0.15 : 0,
      );
      if (subtitle) {
        tl.fromTo(
          ".sh-sub",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        );
      }
    },
    { scope },
  );

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
          <div
            className={cn(
              "sh-eyebrow eyebrow mb-4 flex items-center gap-4 text-gold-dark",
              centered && "justify-center",
            )}
          >
            <span className="hairline-gold w-10" />
            <span>{eyebrow}</span>
            <span className="hairline-gold w-10" />
          </div>
        ) : null}
        <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-5xl">
          {title}
        </h2>
      </motion.div>

      {/* Front layer — subtitle, gentlest drift */}
      {subtitle ? (
        <motion.div style={{ y: yFront }} className="relative z-10">
          <p
            className={cn(
              "sh-sub mt-5 text-base leading-relaxed text-warmgray sm:text-lg",
              centered && "mx-auto max-w-2xl",
            )}
          >
            {subtitle}
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
