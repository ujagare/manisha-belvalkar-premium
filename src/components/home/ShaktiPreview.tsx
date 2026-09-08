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
          subtitle="A sacred journey of self-discovery, empowerment and inner transformation for women."
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
          <div className="relative left-1/2 mt-14 w-screen -translate-x-1/2 overflow-hidden bg-charcoal">
            {/* Full-width, full-height background video */}
            <video
              src="/videos/shakti-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-[760px] w-full object-cover lg:h-[1080px]"
            />
            {/* Left-side scrim — keeps text readable over bright frames, video untouched on right */}
            <div
              className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-charcoal/85 via-charcoal/50 to-charcoal/10 sm:to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-charcoal/60 to-transparent"
              aria-hidden="true"
            />

            {/* Text content over the video — left aligned */}
            <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                <span className="eyebrow mb-3 inline-flex items-center gap-3 text-gold-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  <span className="hairline-gold w-8" />
                  Feel the divine energy
                </span>
                <h3 className="font-display text-3xl font-bold leading-tight text-white drop-shadow-[0_3px_22px_rgba(0,0,0,0.85)] lg:text-5xl">
                  Experience the Shakti Energy
                </h3>
                <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] lg:text-base">
                  Step into the sacred space — a glimpse of the rituals,
                  meditations and divine feminine wisdom that await you on
                  the Shakti journey.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/shakti"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-primary-deeper shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl"
                  >
                    Explore Shakti
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={brand.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/25 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                  >
                    <Sparkles className="h-4 w-4" />
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
