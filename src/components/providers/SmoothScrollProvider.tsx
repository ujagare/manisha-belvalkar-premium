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

function getAnchorOffset(target: Element): number {
  const scrollMargin = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop || "0",
  );
  // Lenis already subtracts `scrollMarginTop` internally, so only add navbar
  // clearance when the element does not declare its own scroll-margin.
  return scrollMargin > 0 ? 0 : -84;
}

/** Smoothly scroll to an in-page selector or element on both desktop and mobile. */
export function scrollToSection(hashOrSelector: string) {
  const target = hashOrSelector.startsWith("#")
    ? document.getElementById(hashOrSelector.slice(1)) ??
      document.querySelector(hashOrSelector)
    : document.querySelector(hashOrSelector);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target as HTMLElement, {
      offset: getAnchorOffset(target),
      duration: 1.05,
    });
    return;
  }

  const top =
    target.getBoundingClientRect().top + window.scrollY + getAnchorOffset(target);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduced ? "auto" : "smooth",
  });
}

/**
 * Global smooth scrolling powered by Lenis across desktop and mobile,
 * synced with GSAP ScrollTrigger. Upgrades in-page anchor links (#...) to
 * glide smoothly with fixed-header awareness.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#") return;

      const target =
        document.getElementById(hash.slice(1)) ?? document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      scrollToSection(hash);
      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onAnchorClick);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        document.removeEventListener("click", onAnchorClick);
      };
    }

    let disposed = false;
    let cleanupTicker: (() => void) | undefined;

    const initialize = async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/lib/gsap"),
      ]);
      if (disposed) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const lenis = new Lenis({
        duration: isCoarsePointer ? 0.95 : 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Smooth wheel interpolation on desktop. On phones let the browser own
        // touch scrolling — Lenis's experimental syncTouch intercepts every
        // touchmove and causes stutter / stuck scrolling on iOS Safari.
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.95,
        allowNestedScroll: true,
        prevent: (node) =>
          Boolean(
            node.closest?.(
              "[data-lenis-prevent], [data-lenis-prevent-touch], [data-radix-scroll-area-viewport]",
            ),
          ),
      });
      lenisInstance = lenis;

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanupTicker = () => {
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(tick);
      };

      ScrollTrigger.refresh();
    };

    const rafId = requestAnimationFrame(() => void initialize());

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      cleanupTicker?.();
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
