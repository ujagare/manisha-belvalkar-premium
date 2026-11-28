"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_TOKENS } from "@/lib/motion";

/**
 * Services page wali scroll choreography baaki saare routes pe bhi chalati hai:
 *  1. Section headings (h2/h3) — masked, line-by-line reveal on scroll.
 *  2. Hero image — scrubbed parallax while the hero scrolls away.
 *
 * Ye component root layout me ek hi jagah mount hota hai — kisi bhi page ke
 * markup / design me koi badlaav nahi. Jin pages me pehle se apni dedicated
 * choreography hai (home, about, services, shakti) unhe skip kiya jata hai.
 *
 * Next App Router streamed pages me layout ka effect page content se pehle
 * chal jata hai, isliye MutationObserver se content aate hi animation attach
 * ki jati hai.
 */
const CHOREOGRAPHED_ROUTES = ["/", "/about", "/services", "/shakti"];

export default function GlobalScrollMotion() {
  const pathname = usePathname() ?? "";

  useGSAP(
    () => {
      const isChoreographed = CHOREOGRAPHED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      );
      if (isChoreographed) return;

      const main = document.getElementById("main-content");
      if (!main) return;

      const mm = gsap.matchMedia();
      const splits: SplitText[] = [];
      const lineTweens = new Set<gsap.core.Tween>();
      const tweensByHeading = new WeakMap<HTMLElement, gsap.core.Tween>();
      let cancelled = false;
      let initialized = false;

      const alreadyVisible = (element: HTMLElement) =>
        element.getBoundingClientRect().top <= window.innerHeight * 0.88;

      const initialize = (observer: MutationObserver) => {
        if (cancelled || initialized) return;
        // Wait until the streamed page content is actually in the DOM.
        if (!main.querySelector("h2, h3")) return;
        initialized = true;
        observer.disconnect();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          // 1. Masked line-by-line reveal on section headings (services H2 pattern).
          main.querySelectorAll<HTMLElement>("h2, h3").forEach((heading) => {
            if (heading.closest("[data-motion-managed]")) return;

            const split = SplitText.create(heading, {
              type: "lines",
              mask: "lines",
              linesClass: "global-motion-line",
              aria: "auto",
              autoSplit: true,
              deepSlice: true,
              onSplit(self) {
                if (!self.lines.length) return;

                // Re-splits (font load / resize) must replace their own tween.
                tweensByHeading.get(heading)?.scrollTrigger?.kill();
                tweensByHeading.get(heading)?.kill();

                // Hero pe pehle se entrance animation hai — usse dobara na chalayein.
                if (alreadyVisible(heading)) {
                  gsap.set(self.lines, { yPercent: 0, clearProps: "transform" });
                  return;
                }

                const tween = gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 0.86,
                  stagger: 0.08,
                  ease: MOTION_TOKENS.ease.editorial,
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    once: true,
                  },
                });
                tweensByHeading.set(heading, tween);
                lineTweens.add(tween);
              },
            });
            splits.push(split);
          });

          // 2. Scrubbed hero-image parallax (services hero pattern).
          const heroSection = main.querySelector<HTMLElement>("section");
          const heroImage = heroSection?.querySelector<HTMLImageElement>("img");
          if (heroSection && heroImage) {
            // scale > 1 keeps the oversized frame covered during the y glide,
            // so no background gap ever shows at the image edges.
            gsap.fromTo(
              heroImage,
              { yPercent: -4, scale: 1.12 },
              {
                yPercent: 4,
                scale: 1.12,
                ease: "none",
                scrollTrigger: {
                  trigger: heroSection,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.9,
                },
              },
            );
          }
        });

        // SplitText line counts change after webfonts load — refresh triggers.
        document.fonts?.ready.then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      };

      const observer = new MutationObserver(() => initialize(observer));
      observer.observe(main, { childList: true, subtree: true });
      initialize(observer);

      return () => {
        cancelled = true;
        observer.disconnect();
        lineTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        splits.forEach((split) => split.revert());
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
