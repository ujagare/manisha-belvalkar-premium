"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  /** Animation starts when this trigger enters. Default — the element itself. */
  trigger?: string;
  stagger?: number;
  delay?: number;
  scrub?: boolean;
}

/**
 * Word-by-word GSAP text reveal on scroll.
 * Each word rises from y: 40 → 0 with a stagger.
 */
export default function TextReveal({
  text,
  as: Tag = "div",
  className,
  trigger,
  stagger = 0.035,
  delay = 0,
  scrub = false,
}: TextRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = scope.current?.querySelectorAll<HTMLElement>(".tr-word");
      if (!words?.length) return;

      if (scrub) {
        // Continuous scrub: track scroll position
        gsap.fromTo(
          words,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: stagger,
            ease: "none",
            scrollTrigger: {
              trigger: trigger ?? scope.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 1.2,
            },
          },
        );
      } else {
        // One-shot stagger reveal
        gsap.fromTo(
          words,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger,
            delay,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trigger ?? scope.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className={cn("inline", className)} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {text.split(" ").map((w, i) => {
          const isLast = i === text.split(" ").length - 1;
          const space = isLast ? "" : "\u00A0";
          return (
            <span
              key={i}
              className="tr-wrap inline-block overflow-hidden align-bottom"
            >
              <span className="tr-word inline-block will-change-transform opacity-0">
                {w}
              </span>
              {!isLast && (
                <span className="inline-block" aria-hidden="true">
                  {" "}
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
}