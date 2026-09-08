"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  src: string;
  /** Parallax intensity, 0.1–1 (0.4 default). Higher = more movement. */
  speed?: number;
  /** Classes for the inner (moving) image layer. */
  className?: string;
  /** Classes for the outer overflow-hidden container. */
  containerClass?: string;
  alt?: string;
}

/**
 * Parallax background image. The inner layer is oversized (125%) and glides
 * vertically as the section scrolls, creating a slow premium depth effect.
 * The container must have a height (e.g. h-72 lg:h-[480px]).
 */
export default function Parallax({
  src,
  speed = 0.4,
  className,
  containerClass,
  alt = "",
}: ParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const c = container.current;
      const img = image.current;
      if (!c || !img) return;
      // ±speed*20% of the 125%-tall image keeps the edges covered (±12.5%).
      const move = Math.min(12, Math.max(2, speed * 20));
      gsap.fromTo(
        img,
        { yPercent: -move },
        {
          yPercent: move,
          ease: "none",
          scrollTrigger: {
            trigger: c,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className={cn("relative overflow-hidden", containerClass)}
    >
      <div
        ref={image}
        role="img"
        aria-label={alt}
        className={cn(
          "absolute left-0 top-[-12.5%] h-[125%] w-full bg-cover bg-center will-change-transform",
          className,
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}