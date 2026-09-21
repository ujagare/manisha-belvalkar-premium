"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import ChakraModal from "@/components/home/ChakraModal";
import { brand } from "@/lib/data";

export default function ShaktiPreview() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Shakti"
          title="Discover Your Chakra"
          subtitle="A sacred journey of self-discovery, empowerment and inner transformation."
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left — chakra artwork with quiz CTA */}
          <GsapReveal y={60}>
            <div className="relative h-full min-h-[340px] overflow-hidden rounded-3xl lg:min-h-[460px]">
              <div className="gold-border-gradient absolute inset-0" />
              <div className="absolute inset-[3px] overflow-hidden rounded-[20px]">
                <Image
                  src="/images/chakra.png"
                  alt="The seven chakras"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />

                {/* Floating CTA over the image */}
                <button
                  onClick={() => setQuizOpen(true)}
                  className="group absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-dark px-7 py-3.5 text-sm font-bold text-primary-deeper shadow-xl shadow-black/25 transition-all duration-300 hover:scale-[1.04] hover:from-gold-light hover:to-gold sm:bottom-8"
                >
                  <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  Discover Your Chakra
                </button>
              </div>
            </div>
          </GsapReveal>

          {/* Right — one merged premium card */}
          <GsapReveal delay={0.1} y={50} className="h-full">
            <Link
              href="/shakti"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-parchment bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl hover:shadow-gold/10 lg:p-12"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.05] transition-all duration-700 group-hover:scale-105 group-hover:opacity-[0.12]"
                style={{ backgroundImage: "url(/images/candle.jpg)" }}
              />
              <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gold/10 blur-2xl transition-all duration-700 group-hover:scale-125" />

              <div className="relative z-10">
                <span className="eyebrow mb-3 inline-flex items-center gap-3 text-gold-dark">
                  <span className="hairline-gold w-8" />
                  Grow into your fullest self · Walk with the divine feminine
                </span>
                <h3 className="font-display text-3xl font-bold leading-tight text-charcoal lg:text-4xl">
                  Self Development &amp; Divine Support
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-warmgray lg:text-base">
                  Guided practices for emotional balance, self-awareness and
                  continuous personal evolution — connect with the energy of
                  the Goddesses through Shakti rituals, oracle wisdom and
                  sacred guidance.
                </p>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all group-hover:bg-primary-dark group-hover:shadow-lg">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-parchment px-6 py-3 text-sm font-semibold text-charcoal transition-colors group-hover:border-gold group-hover:text-primary">
                  Shakti rituals · Oracle wisdom
                </span>
              </div>
            </Link>
          </GsapReveal>
        </div>

        {/* Video showcase — full-bleed video, text overlay left, no overlays */}
        <GsapReveal>
          <div className="relative left-1/2 mt-14 w-screen -translate-x-1/2 overflow-hidden bg-[#f2f1ef] shadow-[0_24px_70px_-32px_rgba(107,11,11,0.3)]">
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_22%_48%,rgba(221,184,41,0.18),transparent_32%),radial-gradient(circle_at_54%_45%,rgba(180,20,20,0.08),transparent_26%),linear-gradient(110deg,#fffaf1_0%,#f7f0e3_52%,#eee2d2_100%)]"
              aria-hidden="true"
            />
            <svg
              viewBox="0 0 720 560"
              className="pointer-events-none absolute -left-20 top-1/2 z-[1] h-[135%] w-[62%] -translate-y-1/2 text-gold-deep opacity-[0.22]"
              aria-hidden="true"
            >
              <g fill="none" stroke="currentColor">
                <circle cx="290" cy="280" r="184" strokeWidth="1" />
                <circle cx="290" cy="280" r="146" strokeWidth="0.8" strokeDasharray="3 8" />
                {Array.from({ length: 12 }).map((_, index) => (
                  <ellipse
                    key={index}
                    cx="290"
                    cy="154"
                    rx="48"
                    ry="126"
                    strokeWidth="1.15"
                    transform={`rotate(${index * 30} 290 280)`}
                  />
                ))}
                <path d="M290 96 449 372H131Z" strokeWidth="1.1" />
                <path d="m290 464 159-276H131Z" strokeWidth="1.1" />
              </g>
            </svg>
            <svg
              viewBox="0 0 1600 560"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="shaktiRibbon" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8b0f0f" stopOpacity=".2" />
                  <stop offset=".48" stopColor="#b41414" stopOpacity=".11" />
                  <stop offset=".82" stopColor="#d64545" stopOpacity=".04" />
                  <stop offset="1" stopColor="#b41414" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M-60 510c238-128 374 38 604-28 179-51 280-39 431 28-240-28-380 96-641 47C131 519 40 600-60 604Z" fill="url(#shaktiRibbon)" />
              <path d="M-30 516c216-105 348 46 582-29" fill="none" stroke="#c9a520" strokeOpacity=".38" strokeWidth="1.5" />
              <path d="M330 82c210-90 474-36 628 118" fill="none" stroke="#c9a520" strokeDasharray="3 11" strokeLinecap="round" strokeOpacity=".42" />
              <path d="M404 116c198-68 388-10 498 98" fill="none" stroke="#a8871a" strokeOpacity=".25" strokeWidth="1" />
              <circle cx="542" cy="61" r="4" fill="#ddb829" fillOpacity=".7" />
              <circle cx="764" cy="122" r="3" fill="#ddb829" fillOpacity=".55" />
              <circle cx="914" cy="212" r="5" fill="#c9a520" fillOpacity=".48" />
            </svg>
            {/* Full-width, full-height background video */}
            <video
              src="/videos/shakti-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="relative z-[2] h-[400px] w-full object-contain object-right sm:h-[460px] lg:h-[560px]"
            />

            {/* Text content over the video — left aligned (dark text + white halo, video kept bright) */}
            <div className="absolute inset-0 z-10 flex items-center px-5 sm:px-8 lg:px-12">
              <div className="max-w-md">
                <span className="eyebrow mb-3 inline-flex items-center gap-3 text-gold-dark drop-shadow-[0_1px_10px_rgba(255,255,255,0.9)]">
                  <span className="hairline-gold w-8" />
                  Feel the divine energy
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight text-charcoal drop-shadow-[0_1px_16px_rgba(255,255,255,0.95)] sm:text-3xl lg:text-4xl">
                  Experience the Shakti Energy
                </h3>
                <p className="mt-3 max-w-md text-xs font-medium leading-relaxed text-charcoal/90 drop-shadow-[0_1px_10px_rgba(255,255,255,0.9)] sm:text-sm">
                  Step into the sacred space — a glimpse of the rituals,
                  meditations and divine feminine wisdom that await you on
                  the Shakti journey.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link
                    href="/shakti"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-2 text-[0.7rem] font-bold text-primary-deeper shadow-sm shadow-gold/35 ring-1 ring-gold/50 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-gold/45 hover:brightness-105 sm:text-xs"
                  >
                    Explore Shakti
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={brand.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-white/75 px-4 py-2 text-[0.7rem] font-semibold text-charcoal shadow-sm shadow-black/10 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary-deeper sm:text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Book a Session
                  </a>
                </div>
              </div>
            </div>
          </div>
        </GsapReveal>

        <GsapReveal className="mt-10 text-center" y={30}>
          <Link
            href="/shakti"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
          >
            Explore Shakti <ArrowRight className="h-4 w-4" />
          </Link>
        </GsapReveal>

        {/* Chakra questionnaire popup */}
        <ChakraModal open={quizOpen} onClose={() => setQuizOpen(false)} />
      </div>
    </section>
  );
}
