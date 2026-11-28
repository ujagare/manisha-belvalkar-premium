"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']",
  "[role='tab']",
  "summary",
  "select:not(:disabled)",
  "label[for]",
  "input[type='checkbox']:not(:disabled)",
  "input[type='radio']:not(:disabled)",
  "input[type='submit']:not(:disabled)",
  "input[type='button']:not(:disabled)",
  "[data-cursor='interactive']",
].join(",");

const TEXT_INPUT_SELECTOR = [
  "textarea:not(:disabled)",
  "[contenteditable='true']",
  "input:not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit']):not([type='reset']):not([type='range']):not([type='file']):not(:disabled)",
].join(",");

/**
 * Sacred Luxury desktop cursor — zero plain dot.
 * Combines a crisp 4-pointed sacred star pointer at the exact hotspot with
 * a fluid spring-interpolated orbital compass halo that expands on interactive
 * elements and compresses haptically on click.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const starTrackRef = useRef<HTMLDivElement>(null);
  const haloTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const starTrack = starTrackRef.current;
    const haloTrack = haloTrackRef.current;
    if (!root || !starTrack || !haloTrack) return;

    document.body.classList.add("has-custom-cursor");

    let mx = -120;
    let my = -120;
    let rx = -120;
    let ry = -120;
    let initialized = false;
    let raf = 0;

    const updateTargetState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        delete root.dataset.hover;
        delete root.dataset.text;
        return;
      }

      if (target.closest(TEXT_INPUT_SELECTOR)) {
        root.dataset.text = "true";
        delete root.dataset.hover;
        return;
      }

      delete root.dataset.text;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        root.dataset.hover = "true";
      } else {
        delete root.dataset.hover;
      }
    };

    const loop = () => {
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.18;
      ry += dy * 0.18;

      const speed = Math.hypot(dx, dy);
      const stretch = Math.min(speed * 0.0032, 0.16);
      const angle = speed > 0.6 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      const starTilt = Math.max(-14, Math.min(14, dx * 0.28));

      starTrack.style.transform = `translate3d(${mx}px, ${my}px, 0) rotate(${starTilt.toFixed(2)}deg)`;
      haloTrack.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) rotate(${angle.toFixed(1)}deg) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.45).toFixed(3)})`;

      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        raf = requestAnimationFrame(loop);
      } else {
        haloTrack.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        starTrack.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        raf = 0;
      }
    };

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;

      if (!initialized) {
        initialized = true;
        rx = mx;
        ry = my;
        haloTrack.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      root.dataset.visible = "true";
      starTrack.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      updateTargetState(event.target);

      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onDown = () => {
      root.dataset.pressed = "true";
    };

    const onUp = () => {
      delete root.dataset.pressed;
    };

    const onLeaveWindow = () => {
      delete root.dataset.visible;
      delete root.dataset.pressed;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("blur", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("blur", onUp);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="sacred-cursor pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Fluid Spring Orbital Compass Halo */}
      <div
        ref={haloTrackRef}
        className="pointer-events-none fixed left-0 top-0 will-change-transform"
      >
        <div className="sacred-cursor-halo">
          <svg
            viewBox="0 0 44 44"
            className="sacred-cursor-halo-svg h-10 w-10"
            fill="none"
          >
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="#ddb829"
              strokeWidth="0.9"
              strokeOpacity="0.75"
            />
            <circle
              cx="22"
              cy="22"
              r="14.5"
              stroke="#fdf8f0"
              strokeWidth="0.55"
              strokeOpacity="0.35"
              strokeDasharray="2.5 4.5"
            />
            {/* Four delicate cardinal compass ticks */}
            <path
              d="M22 2.2V5.4M22 38.6V41.8M2.2 22H5.4M38.6 22H41.8"
              stroke="#f0d060"
              strokeWidth="0.95"
              strokeLinecap="round"
              strokeOpacity="0.88"
            />
          </svg>
        </div>
      </div>

      {/* Zero-Lag Sacred 4-Pointed Star Pointer (No Plain Dot) */}
      <div
        ref={starTrackRef}
        className="pointer-events-none fixed left-0 top-0 will-change-transform"
      >
        <div className="sacred-cursor-star">
          <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            fill="none"
          >
            <defs>
              <linearGradient
                id="sacredCursorGold"
                x1="3"
                y1="3"
                x2="21"
                y2="21"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#fff4c2" />
                <stop offset="48%" stopColor="#ddb829" />
                <stop offset="100%" stopColor="#9e7612" />
              </linearGradient>
            </defs>
            <path
              d="M12 1.8L14.35 9.65L22.2 12L14.35 14.35L12 22.2L9.65 14.35L1.8 12L9.65 9.65L12 1.8Z"
              fill="url(#sacredCursorGold)"
              stroke="#292524"
              strokeOpacity="0.42"
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
