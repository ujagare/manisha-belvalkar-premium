"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_TOKENS } from "@/lib/motion";

/**
 * Services page wali scroll choreography baaki saare routes pe bhi chalati hai:
 *  1. Headings (h2/h3)     — masked line-by-line reveal on scroll.
 *  2. Prose paragraphs     — scrubbed word-by-word illumination.
 *  3. Section images       — scrubbed curtain reveal + zoom settle.
 *  4. Hero image           — scrubbed parallax.
 *
 * Root layout me ek hi jagah mount hota hai — kisi page ka markup / UI nahi
 * badalta. Jin pages me pehle se apni choreography hai (home, about, services,
 * shakti) unhe skip kiya jata hai. Streamed pages ke liye MutationObserver.
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
      const tweens = new Set<gsap.core.Tween>();
      const timelines = new Set<gsap.core.Timeline>();
      const tweensByHeading = new WeakMap<HTMLElement, gsap.core.Tween>();
      const imageLoadHandlers: Array<() => void> = [];
      let cancelled = false;
      let initialized = false;

      const alreadyVisible = (element: HTMLElement) =>
        element.getBoundingClientRect().top <= window.innerHeight * 0.88;

      const initialize = (observer: MutationObserver) => {
        if (cancelled || initialized) return;
        // Streamed page content abhi DOM me nahi hota — wait karo.
        if (!main.querySelector("h2, h3, p, img")) return;
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

                tweensByHeading.get(heading)?.scrollTrigger?.kill();
                tweensByHeading.get(heading)?.kill();

                // Hero heading ke saath pehle se entrance chal raha hota hai.
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
                  scrollTrigger: { trigger: heading, start: "top 90%", once: true },
                });
                tweensByHeading.set(heading, tween);
                tweens.add(tween);
              },
            });
            splits.push(split);
          });

          // 2. Scrubbed word-by-word illumination on editorial prose
          //    (exact services `data-scrub-words` treatment).
          const heroSection = main.querySelector<HTMLElement>("section");
          const prose = Array.from(main.querySelectorAll<HTMLElement>("p"))
            .filter((paragraph) => {
              if (paragraph.closest("[data-motion-managed], [data-reveal]")) return false;
              if (heroSection?.contains(paragraph)) return false;
              return (paragraph.textContent?.trim().length ?? 0) >= 100;
            })
            .slice(0, 12);

          prose.forEach((paragraph) => {
            if (alreadyVisible(paragraph)) return;
            const split = SplitText.create(paragraph, {
              type: "words",
              wordsClass: "global-motion-word",
              aria: "auto",
            });
            splits.push(split);
            if (!split.words.length) return;

            const tween = gsap.fromTo(
              split.words,
              { opacity: 0.28 },
              {
                opacity: 1,
                stagger: 0.04,
                ease: "none",
                scrollTrigger: {
                  trigger: paragraph,
                  start: "top 92%",
                  end: "top 54%",
                  scrub: 0.7,
                },
              },
            );
            tweens.add(tween);
          });

          // 3. Scrubbed curtain reveal + zoom settle on section images
          //    (exact services featured-journey treatment).
          const heroImage = heroSection?.querySelector<HTMLImageElement>("img");
          const sectionImages = Array.from(main.querySelectorAll<HTMLImageElement>("img"))
            .filter((image) => {
              if (image === heroImage) return false;
              if (image.closest("[data-motion-managed], [data-reveal]")) return false;
              if (image.offsetParent === null) return false; // hidden accordion/tab
              const rect = image.getBoundingClientRect();
              return rect.width >= 300 && rect.height >= 180;
            })
            .slice(0, 12);

          sectionImages.forEach((image) => {
            // Already on screen (or its trigger has already passed) — no curtain.
            if (alreadyVisible(image)) return;
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: image,
                start: "top 88%",
                end: "top 30%",
                scrub: 0.75,
                invalidateOnRefresh: true,
              },
            });
            timeline.fromTo(
              image,
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1,
                ease: MOTION_TOKENS.ease.settle,
              },
            );
            timelines.add(timeline);
          });

          // 4. Scrubbed hero-image parallax (services hero pattern).
          if (heroSection && heroImage) {
            // scale > 1 keeps the oversized frame covered during the y glide.
            const tween = gsap.fromTo(
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
            tweens.add(tween);
          }

          // Images/fonts change layout after hydration — keep triggers honest.
          const refresh = () => {
            if (!cancelled) ScrollTrigger.refresh();
          };
          document.fonts?.ready.then(refresh);
          window.addEventListener("load", refresh, { once: true });
          imageLoadHandlers.push(() => window.removeEventListener("load", refresh));
          sectionImages.forEach((image) => {
            if (image.complete) return;
            image.addEventListener("load", refresh, { once: true });
            imageLoadHandlers.push(() => image.removeEventListener("load", refresh));
          });
        });
      };

      const observer = new MutationObserver(() => initialize(observer));
      observer.observe(main, { childList: true, subtree: true });
      initialize(observer);

      return () => {
        cancelled = true;
        observer.disconnect();
        imageLoadHandlers.forEach((off) => off());
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        timelines.forEach((timeline) => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        });
        splits.forEach((split) => split.revert());
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
