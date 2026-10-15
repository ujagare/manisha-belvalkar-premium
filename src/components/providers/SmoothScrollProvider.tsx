"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/** Module-level handle so overlays (modals) can pause smooth scrolling. */
let lenisInstance: import("lenis").default | null = null;

/** Pause Lenis's virtual scroll (call while a modal is open). */
export function stopLenis() {
  lenisInstance?.stop();
}

/** Resume Lenis's virtual scroll after a modal closes. */
export function startLenis() {
  lenisInstance?.start();
}

/**
 * Global smooth scrolling powered by Lenis, synced with GSAP ScrollTrigger.
 * Also upgrades in-page anchor links (#...) to glide instead of jump.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let raf = 0;
    let onClick: ((event: MouseEvent) => void) | undefined;

    const initialize = async () => {
      const { default: Lenis } = await import("lenis");
      if (disposed) return;

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisInstance = lenis;

      const frame = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        const hash = anchor?.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
        history.replaceState(null, "", hash);
      };
      document.addEventListener("click", onClick);
    };

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(() => void initialize(), { timeout: 2500 });
    const timerId = idleId === undefined ? window.setTimeout(() => void initialize(), 1500) : undefined;

    return () => {
      disposed = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (onClick) document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
