"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitWords, prefersReducedMotion } from "@/lib/anim";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Editorial page header with a GSAP word-by-word title reveal. */
export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const h1 = scope.current?.querySelector<HTMLHeadingElement>("h1");
      if (!h1) return;

      const words = splitWords(h1);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".ph-eyebrow",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.1,
      )
        .fromTo(
          words,
          { y: 60, opacity: 0, rotateX: 45 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.028 },
          0.25,
        )
        .fromTo(
          ".ph-sub",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.7,
        );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-ivory pb-16 pt-32 lg:pb-20 lg:pt-40"
    >
      <div className="glow-gold absolute -right-32 -top-32 h-[420px] w-[420px]" />
      <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <div className="eyebrow ph-eyebrow mb-5 flex items-center justify-center gap-4 text-gold-dark">
          <span className="hairline-gold w-10" />
          {eyebrow}
          <span className="hairline-gold w-10" />
        </div>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="ph-sub mx-auto mt-6 max-w-2xl text-base leading-relaxed text-warmgray sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}