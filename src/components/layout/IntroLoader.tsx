"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./IntroLoader.module.css";

const brandName = "Manisha Belvalkar";

export default function IntroLoader() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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
