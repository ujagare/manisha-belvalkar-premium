/**
 * Shared editorial motion tokens mirrored with CSS custom properties in
 * `src/app/globals.css` (`--motion-*`) so GSAP timelines and CSS hover/focus
 * transitions share consistent timing, easing, and distances.
 */
export const MOTION_TOKENS = {
  duration: {
    fast: 0.3,
    base: 0.68,
    editorial: 0.84,
    slow: 1.05,
  },
  ease: {
    editorial: "power3.out",
    settle: "power2.out",
    scrub: "none",
  },
  distance: {
    subtle: 12,
    reveal: 18,
    arrowSlide: 4,
  },
  stagger: {
    lines: 0.09,
    cards: 0.06,
    items: 0.07,
  },
} as const;
