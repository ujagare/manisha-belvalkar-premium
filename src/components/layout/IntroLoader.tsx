"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./IntroLoader.module.css";

const brandName = "Manisha Belvalkar";
const loaderSessionKey = "manisha-intro-seen";

export default function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    try {
      if (window.sessionStorage.getItem(loaderSessionKey) === "true") {
        if (loaderRef.current) loaderRef.current.style.display = "none";
        return;
      }

      window.sessionStorage.setItem(loaderSessionKey, "true");
    } catch {
      // Keep the loader functional when browser storage is unavailable.
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), 4200);
    const removeTimer = window.setTimeout(() => setVisible(false), 5400);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      className={`${styles.loader} ${leaving ? styles.leaving : ""}`}
      aria-hidden="true"
    >
      <div className={`${styles.panel} ${styles.left}`} />
      <div className={`${styles.panel} ${styles.right}`} />
      <div className={styles.splash}>
        <svg
          className={styles.wordmark}
          viewBox="0 0 940 150"
          role="presentation"
          focusable="false"
        >
          <text x="470" y="101" textAnchor="middle" aria-label={brandName}>
            {Array.from(brandName).map((letter, index) => (
              <tspan
                key={`${letter}-${index}`}
                className={styles.letter}
                style={{ "--letter-delay": `${index * 90}ms` } as CSSProperties}
              >
                {letter === " " ? "\u00a0" : letter}
              </tspan>
            ))}
          </text>
        </svg>
      </div>
    </div>
  );
}
