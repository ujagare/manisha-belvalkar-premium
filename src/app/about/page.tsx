import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  Star,
  Home as HomeIcon,
  Award,
  Quote,
  Newspaper,
  ArrowRight,
  BadgeCheck,
  ScrollText,
  Heart,
  Eye,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TextReveal from "@/components/ui/TextReveal";
import GoldDivider from "@/components/ui/GoldDivider";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import { brand, mediaItems, awards } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Manisha Belvalkar — a holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Goddess Attunement, and Chakra Therapy.",
};

const expertise = [
  {
    icon: Sparkles,
    title: "Tarot Consultation",
    text: "With a PhD in Tarot Reading, Manisha's readings uncover life's mysteries, providing clarity and direction.",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: Star,
    title: "Soul Purpose Reading",
    text: "Aligns your journey with cosmic energies, empowering you to make informed decisions and unlock your true potential.",
    gradient: "from-gold/10 via-gold/5 to-transparent",
  },
  {
    icon: HomeIcon,
    title: "Goddess Attunement",
    text: "Connect with the divine feminine energy through sacred attunement, receiving spiritual guidance and blessings.",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: GraduationCap,
    title: "Chakra Therapy",
    text: "Balances and heals your energy centers for deep alignment, vitality, and inner harmony.",
    gradient: "from-gold/10 via-gold/5 to-transparent",
  },
];

const milestones = [
  {
    year: "1990s",
    title: "The Beginning",
    desc: "Manisha began her spiritual journey, exploring esoteric tools and ancient wisdom traditions.",
  },
  {
    year: "2000s",
    title: "Mastery & Research",
    desc: "Over two decades of refining Tarot, Goddess Attunement, and Chakra Therapy — developing her unique approach.",
  },
  {
    year: "2010s",
    title: "Recognition",
    desc: "Awarded a PhD in Tarot Reading. Features in Success Today, Citadel Magazine, and The Health Mag.",
  },
  {
    year: "Today",
    title: "Mentoring & Legacy",
    desc: "Guiding souls worldwide through mentoring, distance healing, courses, and the Shakti movement.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ===== SPLIT HERO ===== */}
      <section className="relative min-h-[90vh] overflow-hidden bg-charcoal">
        {/* Image half */}
        <div className="absolute inset-0 lg:relative lg:w-1/2">
          <div className="relative h-full w-full">
            <Image
              src="/images/about-portrait-2.png"
              alt="Dr. Manisha Belvalkar"
              fill
              sizes="50vw"
              priority
              className="object-cover object-[55%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent lg:bg-gradient-to-r lg:from-charcoal/90 lg:via-charcoal/60 lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Text half */}
        <div className="relative z-10 flex min-h-[90vh] items-center px-6 lg:ml-auto lg:w-1/2 lg:px-16">
          <div className="w-full max-w-xl py-20">
            <GsapReveal y={40}>
              <div className="flex items-center gap-4 text-gold">
                <span className="hairline-gold w-12" />
                <span className="eyebrow text-xs tracking-[0.35em]">
                  About Manisha
                </span>
              </div>
            </GsapReveal>

            <GsapReveal y={40} delay={0.1}>
              <h1 className="mt-8 font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                The woman behind the{" "}
                <span className="text-gold-shimmer">wisdom</span>
              </h1>
            </GsapReveal>

            <GsapReveal y={30} delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
                With over{" "}
                <strong className="text-gold-light">30 years</strong> of
                experience in Tarot Consultation, Soul Purpose Reading, Space
                Clearing, and Chakra Therapy — Manisha brings unmatched
                expertise and insight to guiding individuals toward clarity,
                success, and self-empowerment.
              </p>
            </GsapReveal>

            <GsapReveal y={30} delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact" size="lg" variant="gold">
                  Work with Manisha
                </Button>
                <Button href={brand.whatsappHref} size="lg" variant="ghost">
                  Book a Session
                </Button>
              </div>
            </GsapReveal>

            <GsapReveal y={20} delay={0.35} className="mt-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-gold" />
                  <div>
                    <p className="text-sm font-bold text-white">PhD</p>
                    <p className="text-xs text-white/50">Tarot Reading</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-sm">
                  <p className="font-bold text-white">30+</p>
                  <p className="text-xs text-white/50">Years Experience</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-sm">
                  <p className="font-bold text-white">∞</p>
                  <p className="text-xs text-white/50">Souls Guided</p>
                </div>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>

      {/* ===== THE STORY ===== */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Intro */}
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <GsapReveal y={40}>
              <div className="eyebrow mb-5 flex items-center gap-4 text-gold-dark">
                <span className="hairline-gold w-10" />
                The Journey
              </div>
              <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-5xl">
                A life dedicated to{" "}
                <span className="text-crimson-gradient">guiding souls</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-warmgray">
                Holding a <strong className="text-ink">PhD in Tarot Reading</strong>,
                Manisha has mastered this ancient art to offer profound guidance
                and solutions. Her tarot readings uncover life&apos;s mysteries,
                providing clarity and direction.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-warmgray">
                As a <strong className="text-ink">Goddess Attunement</strong> practitioner,
                she creates sacred connections with divine feminine energy.
                Through{" "}
                <strong className="text-ink">Soul Purpose Reading</strong>, she
                aligns your journey with cosmic energies, empowering you to make
                informed decisions and unlock your true potential.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-warmgray">
                Whether you seek answers, alignment, or transformation, her
                decades of dedication ensure a personalized and impactful
                experience.
              </p>
            </GsapReveal>

            <GsapReveal y={40} x={40} className="relative">
              <div className="gold-border-gradient relative h-[500px] overflow-hidden rounded-3xl sm:h-[600px]">
                <Image
                  src="/images/about-portrait-3.png"
                  alt="Manisha in her element"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[60%_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-primary px-7 py-5 text-white shadow-[0_24px_60px_-18px_rgba(180,20,20,0.6)]">
                <p className="font-display text-3xl font-bold text-gold">
                  PhD
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/85">
                  in Tarot Reading
                </p>
              </div>
            </GsapReveal>
          </div>

          {/* Milestones */}
          <div className="mt-24">
            <SectionHeading
              eyebrow="Milestones"
              title={
                <>
                  Three decades of{" "}
                  <span className="text-gold-shimmer">dedication</span>
                </>
              }
              subtitle="A journey marked by discovery, mastery, and a commitment to guiding others."
            />

            <div className="relative mt-16">
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-gold/60 via-gold/20 to-transparent md:block" />
              <div className="space-y-12 md:space-y-16">
                {milestones.map((m, i) => {
                  const left = i % 2 === 0;
                  return (
                    <GsapReveal key={m.year} y={50}>
                      <div className="relative flex items-start gap-6 md:w-1/2 md:pr-12 md:[&:nth-child(even)]:ml-auto md:[&:nth-child(even)]:flex-row-reverse md:[&:nth-child(even)]:pl-12 md:[&:nth-child(even)]:pr-0">
                        {/* Node */}
                        <div className="absolute left-0 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-charcoal text-gold shadow-lg md:left-1/2 md:right-auto md:[&:nth-child(even)]:left-1/2">
                          <span className="font-display text-[10px] font-bold">
                            {m.year}
                          </span>
                        </div>

                        {/* Card */}
                        <div className="group relative ml-6 flex-1 overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_70px_-30px_rgba(221,184,41,0.45)] md:ml-0">
                          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                          <h3 className="relative font-display font-bold text-gold-dark">
                            {m.year}
                          </h3>
                          <h4 className="relative font-display text-xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                            {m.title}
                          </h4>
                          <p className="relative mt-2 text-sm leading-relaxed text-warmgray">
                            {m.desc}
                          </p>
                        </div>
                      </div>
                    </GsapReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CINEMATIC QUOTE ===== */}
      <section className="relative overflow-hidden bg-charcoal py-28 lg:py-44">
        <div className="glow-gold absolute -left-40 top-0 h-[500px] w-[500px] opacity-60" />
        <div className="glow-crimson absolute -bottom-40 -right-40 h-[500px] w-[500px] opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
          <GsapReveal y={50}>
            <Quote className="mx-auto mb-10 h-14 w-14 rotate-180 text-gold/40" />
            <TextReveal
              text="It is your own commitment to what you want in life that determines your success."
              as="p"
              className="font-serif text-3xl font-medium italic leading-[1.4] text-gold-light sm:text-4xl lg:text-[3rem]"
              stagger={0.025}
              scrub
            />
            <p className="mt-10 text-sm uppercase tracking-[0.35em] text-white/50">
              — {brand.name}
            </p>
          </GsapReveal>
        </div>
      </section>

      {/* ===== EXPERTISE ===== */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Areas of Expertise"
            title={
              <>
                Ancient wisdom,{" "}
                <span className="text-gold-shimmer">modern clarity</span>
              </>
            }
            subtitle="Four pillars of practice, refined over three decades — each one a doorway into deeper understanding."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, i) => (
              <GsapReveal key={item.title} delay={i * 0.1} y={50}>
                <div className="group relative h-full overflow-hidden rounded-[28px] border border-parchment bg-white p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  {/* Gold aura bloom */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-all duration-500 group-hover:scale-105">
                      <item.icon className="h-6 w-6 text-gold-light" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                      <span className="h-px w-8 bg-gradient-to-r from-gold to-gold/30" />
                      <span className="font-serif text-xs text-gold">✦</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-warmgray">
                      {item.text}
                    </p>
                  </div>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY BENTO ===== */}
      <section className="bg-ivory py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Moments"
            title={
              <>
                In her <span className="text-gold-shimmer">element</span>
              </>
            }
            subtitle="A glimpse into the presence and practice of Manisha Belvalkar."
          />

          <div className="mt-16 grid grid-flow-dense gap-5 md:grid-cols-3">
            <GsapReveal className="md:col-span-2 md:row-span-2">
              <div className="gold-border-gradient relative h-[340px] overflow-hidden rounded-3xl md:h-full md:min-h-[480px]">
                <Image
                  src="/images/about-portrait-3.png"
                  alt="Manisha in contemplation"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover object-[60%_20%] transition-transform duration-700 hover:scale-105"
                />
              </div>
            </GsapReveal>

            <GsapReveal delay={0.08}>
              <div className="relative h-[200px] overflow-hidden rounded-3xl md:h-[230px]">
                <Image
                  src="/images/manisha-portrait.jpg"
                  alt="Dr. Manisha Belvalkar"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[50%_10%] transition-transform duration-700 hover:scale-105"
                />
              </div>
            </GsapReveal>

            <GsapReveal delay={0.15}>
              <div className="gold-border-gradient relative h-[200px] overflow-hidden rounded-3xl bg-charcoal md:h-[230px]">
                <Image
                  src="/images/about-portrait-1.png"
                  alt="Manisha at an award ceremony"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-md backdrop-blur">
                  <Award className="h-3.5 w-3.5 text-gold" />
                  Award Ceremony
                </div>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>

      {/* ===== IN MEDIA (BENTO) ===== */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="In Media"
            title={
              <>
                As featured in{" "}
                <span className="text-crimson-gradient">the press</span>
              </>
            }
            subtitle="Interviews, features and articles celebrating her work."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item, i) => (
              <GsapReveal
                key={item.id}
                delay={i * 0.08}
                y={40}
                className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
              >
                <article
                  className={`group gold-border-gradient relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ${
                    i === 0 ? "lg:min-h-[480px]" : "min-h-[320px]"
                  }`}
                >
                  {/* Image */}
                  {item.image ? (
                    <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-64">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 shadow-md backdrop-blur">
                        <Newspaper className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-ink">
                          {item.outlet}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* Text */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <h3 className="font-display text-xl font-bold text-charcoal sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-warmgray">
                        {item.excerpt}
                      </p>
                    </div>
                    {item.quote ? (
                      <blockquote className="mt-4 border-l-2 border-gold pl-4">
                        <p className="font-serif text-sm italic leading-relaxed text-charcoal">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </blockquote>
                    ) : null}
                    <div className="mt-5">
                      <Button
                        href={brand.whatsappHref}
                        variant="outline"
                        size="sm"
                      >
                        Read feature
                      </Button>
                    </div>
                  </div>
                </article>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AWARDS ===== */}
      <section className="relative overflow-hidden bg-charcoal py-20 lg:py-32">
        <div className="glow-crimson absolute -right-32 -top-32 h-[400px] w-[400px]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Award image */}
            <GsapReveal y={50}>
              <div className="gold-border-gradient-dark relative mx-auto h-[420px] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-gold/10">
                <Image
                  src="/images/about-portrait-1.png"
                  alt={awards[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
                  <Award className="h-6 w-6 text-gold" />
                  <p className="text-sm font-semibold text-charcoal">
                    Presented by Sonu Sood
                  </p>
                </div>
              </div>
            </GsapReveal>

            {/* Award text */}
            <GsapReveal delay={0.15} y={40}>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-gold" />
                <span className="eyebrow text-gold">Recognition</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {awards[0].title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {awards[0].description}
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Recognised for mastery in Tarot Reading",
                  "Celebrated across the spiritual community",
                  "A testament to 30+ years of dedication",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 shrink-0 text-gold" />
                    <span className="text-white/80">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button href="/contact" variant="gold" size="lg">
                  Begin Your Journey <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}