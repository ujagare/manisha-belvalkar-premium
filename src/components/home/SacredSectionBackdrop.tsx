import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Motif = "orbit" | "petals" | "arch" | "constellation";

const paths: Record<Motif, ReactNode> = {
  orbit: (
    <>
      <circle cx="250" cy="250" r="178" />
      <circle cx="250" cy="250" r="126" strokeDasharray="3 12" />
      <path d="M72 250h356M250 72v356" opacity=".35" />
      <circle cx="250" cy="72" r="6" fill="currentColor" stroke="none" />
      <circle cx="428" cy="250" r="4" fill="currentColor" stroke="none" />
    </>
  ),
  petals: (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="250"
          cy="145"
          rx="58"
          ry="116"
          transform={`rotate(${i * 45} 250 250)`}
        />
      ))}
      <circle cx="250" cy="250" r="42" />
    </>
  ),
  arch: (
    <>
      <path d="M92 430V236C92 113 162 55 250 55s158 58 158 181v194" />
      <path d="M140 430V245c0-91 48-139 110-139s110 48 110 139v185" />
      <path d="M188 430V253c0-58 27-96 62-96s62 38 62 96v177" />
    </>
  ),
  constellation: (
    <>
      <path d="m74 356 86-182 90 76 96-137 80 214" />
      <path d="m101 104 126 104 104-50 91 71" strokeDasharray="4 13" />
      {[
        [74, 356], [160, 174], [250, 250], [346, 113], [426, 327],
        [101, 104], [227, 208], [331, 158], [422, 229],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 7 : 4} fill="currentColor" stroke="none" />
      ))}
    </>
  ),
};

export default function SacredSectionBackdrop({
  motif,
  className,
}: {
  motif: Motif;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox="0 0 500 500"
        className="absolute -right-24 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 text-gold"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".32">
          {paths[motif]}
        </g>
      </svg>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-y-20 left-[8%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
    </div>
  );
}
