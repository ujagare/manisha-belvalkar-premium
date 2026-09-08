"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
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
  ease?: string;
  /** Scroll-trigger start. Default "top 88%". */
  start?: string;
  /** Stagger each child (children must be direct elements). */
  stagger?: number;
  /** Disable scroll trigger — animate on mount instead. */
  instant?: boolean;
}

/**
 * Premium GSAP-powered scroll reveal with optional blur, scale, and stagger.
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
  ease = "power3.out",
  start,
  stagger,
  instant = false,
}: GsapRevealProps) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = el.current;
      if (!target) return;

      const vars: gsap.TweenVars = {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
      };

      if (doBlur) vars.filter = "blur(0px)";

      const from: gsap.TweenVars = {
        y,
        x,
        scale: s,
        opacity: 0,
      };
      if (doBlur) from.filter = "blur(6px)";

      if (stagger && stagger > 0) {
        // Stagger direct children
        const children = target.children;
        gsap.fromTo(children, from, {
          ...vars,
          stagger,
          scrollTrigger: instant
            ? undefined
            : { trigger: target, start: start ?? "top 88%", once: true },
        });
        // Also set the parent
        gsap.set(target, { opacity: 1 });
        return;
      }

      if (instant) {
        gsap.fromTo(target, from, vars);
      } else {
        gsap.fromTo(target, from, {
          ...vars,
          scrollTrigger: {
            trigger: target,
            start: start ?? "top 88%",
            once: true,
          },
        });
      }
    },
    { scope: el },
  );

  return (
    <div ref={el} className={cn(className)}>
      {children}
    </div>
  );
}