import { Sparkles } from "lucide-react";
import { transformationProgram } from "@/lib/data";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/**
 * Flagship-program band on a ceremonial light canvas that echoes the home
 * hero without copying it: a rising-sun halo behind the title, corner lotus
 * arcs, flowing gold ribbons and floating sparks over a warm parchment
 * gradient. Month chips are white glass with gold rings.
 */
export default function TransformationHighlight() {
  const { months } = transformationProgram;
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fdf6ea_46%,#f4e8d4_100%)] py-20 lg:py-28">
      {/* Ceremonial glows — gold crown behind the title, crimson warmth low-left */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[-220px] h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(221,184,41,0.34),rgba(221,184,41,0.08)_46%,transparent_70%)] blur-2xl" />
        <div className="absolute -left-40 bottom-[-160px] h-[420px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(180,20,20,0.12),transparent_70%)] blur-2xl" />
        <div className="absolute -right-32 top-1/3 h-[380px] w-[440px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,165,32,0.18),transparent_70%)] blur-2xl" />
      </div>

      {/* Rising-sun halo behind the heading — concentric gold arcs */}
      <svg
        viewBox="0 0 640 320"
        className="pointer-events-none absolute left-1/2 top-6 z-[1] w-[min(560px,86vw)] -translate-x-1/2 text-gold-deep opacity-30 sm:top-2"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor">
          <path d="M40 320a280 280 0 0 1 560 0" strokeWidth="1.2" />
          <path d="M90 320a230 230 0 0 1 460 0" strokeWidth="0.9" strokeDasharray="2 9" />
          <path d="M140 320a180 180 0 0 1 360 0" strokeWidth="0.9" />
          <path d="M196 320a124 124 0 0 1 248 0" strokeWidth="0.7" strokeDasharray="1 7" />
          {/* rays */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = Math.PI - (i * Math.PI) / 8;
            return (
              <line
                key={i}
                x1={320 + Math.cos(a) * 282}
                y1={320 - Math.sin(a) * 282}
                x2={320 + Math.cos(a) * 300}
                y2={320 - Math.sin(a) * 300}
                strokeWidth="1.1"
              />
            );
          })}
        </g>
      </svg>

      {/* Flowing gold + crimson ribbon lines, echoing the hero's silk art */}
      <svg
        viewBox="0 0 1600 640"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="thRibbonCrimson" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b0f0f" stopOpacity=".14" />
            <stop offset=".55" stopColor="#d64545" stopOpacity=".07" />
            <stop offset="1" stopColor="#b41414" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="thRibbonGold" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ddb829" stopOpacity=".22" />
            <stop offset="1" stopColor="#f0d060" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-120 560c280-150 470 70 760-50 220-92 360 20 600-30-250 90-430 210-700 160-240-44-430 60-660 90Z" fill="url(#thRibbonCrimson)" />
        <path d="M-80 586c260-160 450 46 740-52" fill="none" stroke="#c9a520" strokeOpacity=".3" strokeWidth="1.6" />
        <path d="M1720 40c-190 120-390 60-560 190" fill="none" stroke="url(#thRibbonGold)" strokeWidth="2.4" />
        <path d="M1180 -40c150 96 292 68 460 190" fill="none" stroke="#c9a520" strokeDasharray="3 12" strokeOpacity=".4" strokeLinecap="round" />
        <circle cx="1352" cy="92" r="4.5" fill="#ddb829" fillOpacity=".65" />
        <circle cx="1188" cy="208" r="3" fill="#ddb829" fillOpacity=".5" />
        <circle cx="236" cy="118" r="3.5" fill="#b41414" fillOpacity=".28" />
      </svg>

      {/* Corner lotus arcs — left and right, mirrored */}
      <svg
        viewBox="0 0 260 260"
        className="pointer-events-none absolute -left-16 top-1/2 z-[1] hidden w-[240px] -translate-y-1/2 text-gold-deep opacity-25 lg:block"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor">
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse
              key={i}
              cx="150"
              cy="130"
              rx="26"
              ry="96"
              strokeWidth="1"
              transform={`rotate(${i * 36 - 72} 150 130)`}
            />
          ))}
          <circle cx="150" cy="130" r="112" strokeWidth="0.8" strokeDasharray="2 8" />
        </g>
      </svg>
      <svg
        viewBox="0 0 260 260"
        className="pointer-events-none absolute -right-16 top-1/2 z-[1] hidden w-[240px] -translate-y-1/2 rotate-180 text-gold-deep opacity-25 lg:block"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor">
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse
              key={i}
              cx="150"
              cy="130"
              rx="26"
              ry="96"
              strokeWidth="1"
              transform={`rotate(${i * 36 - 72} 150 130)`}
            />
          ))}
          <circle cx="150" cy="130" r="112" strokeWidth="0.8" strokeDasharray="2 8" />
        </g>
      </svg>

      {/* Ambient floating gold sparks */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        {[
          { l: "10%", t: "24%", d: "0s" },
          { l: "26%", t: "70%", d: "1.8s" },
          { l: "58%", t: "14%", d: "0.8s" },
          { l: "76%", t: "30%", d: "2.6s" },
          { l: "88%", t: "64%", d: "1.2s" },
          { l: "44%", t: "82%", d: "3.2s" },
        ].map((p) => (
          <span
            key={p.l}
            className="absolute h-1.5 w-1.5 animate-float rounded-full bg-gold/60 blur-[1px]"
            style={{ left: p.l, top: p.t, animationDelay: p.d }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="text-center">
          <div className="eyebrow mb-5 flex items-center justify-center gap-4 text-gold-dark">
            <span className="hairline-gold w-10" />
            Flagship Program
            <span className="hairline-gold w-10" />
          </div>
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl">
            Six months to{" "}
            <span className="text-crimson-gradient">transform</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-warmgray">
            {transformationProgram.description}
          </p>
        </Reveal>

        {/* Month chips — white glass on gold rings */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {months.map((m, i) => (
            <Reveal key={m.month} delay={i * 0.06}>
              <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-[22px] border border-gold/25 bg-white/80 p-5 text-center shadow-[0_18px_40px_-24px_rgba(180,20,20,0.18)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/55 hover:bg-white hover:shadow-[0_28px_60px_-28px_rgba(221,184,41,0.5)]">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <span className="font-display text-sm font-bold tracking-[0.2em] text-gold-dark">
                  {String(m.month).padStart(2, "0")}
                </span>
                <span className="mt-2 text-sm font-semibold text-charcoal">
                  {m.title}
                </span>
                <Sparkles className="mt-3 h-4 w-4 text-gold/60 transition-transform duration-500 group-hover:scale-125 group-hover:text-gold-dark" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Button href="/transformation" size="lg" variant="gold">
            Explore the Program
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
