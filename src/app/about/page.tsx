import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenText,
  Heart,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";
import GsapReveal from "@/components/ui/GsapReveal";
import { awards, brand } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Dr. Manisha Belvalkar, a holistic well-being coach with over 30 years of experience in Tarot, Soul Purpose Reading, Goddess Attunement and Chakra Therapy.",
  alternates: { canonical: "/about" },
};

const expertise = [
  {
    icon: BookOpenText,
    title: "Tarot consultation",
    text: "A focused reading that brings context, clarity and direction to the questions shaping your life.",
  },
  {
    icon: Sparkles,
    title: "Soul purpose reading",
    text: "A deeper look at your natural gifts, recurring patterns and the path that feels most aligned.",
  },
  {
    icon: HomeIcon,
    title: "Goddess attunement",
    text: "A sacred practice for connecting with divine feminine energy, inner strength and spiritual support.",
  },
  {
    icon: Heart,
    title: "Chakra therapy",
    text: "Gentle energy work created to restore balance, vitality and a stronger sense of inner steadiness.",
  },
];

const milestones = [
  {
    year: "1990s",
    title: "The practice begins",
    text: "Manisha starts exploring Tarot, energy work and ancient wisdom traditions.",
  },
  {
    year: "2000s",
    title: "Study becomes mastery",
    text: "Years of research shape a personal approach to Tarot, attunement and chakra work.",
  },
  {
    year: "2010s",
    title: "Recognition follows",
    text: "A PhD in Tarot Reading and features in leading publications bring wider recognition.",
  },
  {
    year: "Today",
    title: "The work continues",
    text: "Private sessions, mentoring, courses and Shakti carry the practice to a global community.",
  },
];

const stats = [
  ["30+", "years of practice"],
  ["PhD", "in Tarot Reading"],
  ["04", "core disciplines"],
] as const;

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbf8f2] pt-16 text-charcoal">
      <section className="relative min-h-[calc(100dvh-4rem)] border-b border-primary/15">
        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[90rem] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative order-2 min-h-[24rem] overflow-hidden bg-white sm:min-h-[28rem] lg:order-1 lg:m-12 lg:min-h-0 lg:rounded-[1.5rem]">
            <Image
              src="/images/manisha-about-hero.jpg"
              alt="Dr. Manisha Belvalkar seated with her Tarot cards"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover object-[50%_35%]"
            />
          </div>

          <div className="relative order-1 flex items-center px-5 py-20 sm:px-8 lg:order-2 lg:px-16 lg:py-20 xl:px-24">
            <div className="max-w-2xl">
              <GsapReveal y={24}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-primary">
                  About Manisha
                </p>
              </GsapReveal>
              <GsapReveal y={30} delay={0.08}>
                <h1 className="mt-6 text-balance font-display text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-[4.5rem]">
                  Wisdom shaped by a lifetime of practice.
                </h1>
              </GsapReveal>
              <GsapReveal y={24} delay={0.16}>
                <p className="mt-7 max-w-[34rem] text-pretty text-lg leading-8 text-warmgray">
                  For over 30 years, Manisha has helped people meet uncertainty with clarity, self-trust and grounded spiritual guidance.
                </p>
              </GsapReveal>
              <GsapReveal y={20} delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(107,11,11,0.65)] transition duration-300 hover:-translate-y-1 hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.98]"
                  >
                    Work with Manisha
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/services"
                    className="border-b border-charcoal/30 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-primary hover:text-primary"
                  >
                    Explore her practice
                  </Link>
                </div>
              </GsapReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-primary/15 bg-white/55">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {stats.map(([value, label], index) => (
            <div
              key={label}
              className={`py-7 sm:px-8 sm:py-9 ${index > 0 ? "border-t border-primary/15 sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-primary">{value}</p>
              <p className="mt-1 text-sm text-warmgray">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <GsapReveal y={30}>
            <div className="relative mx-auto w-full max-w-lg lg:mx-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/manisha-about-practice.jpg"
                  alt="Manisha Belvalkar during a Tarot reading"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-[50%_30%]"
                />
              </div>
              <div className="absolute -bottom-7 right-4 w-[72%] rounded-[1.25rem] bg-primary p-6 text-white shadow-[0_24px_55px_-25px_rgba(107,11,11,0.8)] sm:-right-7">
                <p className="font-serif text-xl italic leading-[1.35]">
                  Clarity begins when you learn to hear your own wisdom.
                </p>
              </div>
            </div>
          </GsapReveal>

          <div className="pt-8 lg:pt-14">
            <GsapReveal y={28}>
              <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                A practice built on attention, study and care.
              </h2>
            </GsapReveal>
            <GsapReveal y={24} delay={0.08}>
              <div className="mt-8 max-w-[42rem] space-y-5 text-base leading-8 text-warmgray sm:text-lg">
                <p>
                  Manisha&apos;s work began with a deep curiosity about the unseen patterns that influence everyday life. That curiosity grew into decades of disciplined study across Tarot, soul purpose, divine feminine practices and chakra therapy.
                </p>
                <p>
                  Her PhD in Tarot Reading reflects that commitment to depth. In each session, she pairs intuitive insight with practical conversation so that guidance feels useful beyond the reading itself.
                </p>
                <p>
                  The intention is simple: to help each person understand where they are, recognise what is asking to change and move forward with greater confidence.
                </p>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/15 bg-white/50 px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <GsapReveal y={24}>
            <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
              Four disciplines. One thoughtful approach.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-warmgray sm:text-lg">
              Every practice offers a different way to understand the present and make the next decision with care.
            </p>
          </GsapReveal>

          <div className="mt-14 grid gap-x-14 gap-y-0 md:grid-cols-2">
            {expertise.map((item, index) => (
              <GsapReveal key={item.title} y={24} delay={index * 0.05}>
                <article className="group grid grid-cols-[3.5rem_1fr] gap-5 border-t border-primary/15 py-8">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <item.icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.025em]">{item.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-warmgray sm:text-base">{item.text}</p>
                  </div>
                </article>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <GsapReveal y={24}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-primary">The journey</p>
            <h2 className="mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
              Three decades of learning and service.
            </h2>
          </GsapReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, index) => (
              <GsapReveal key={milestone.year} y={24} delay={index * 0.06}>
                <article className="relative border-t border-primary/25 pt-7">
                  <span className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-primary" />
                  <p className="font-mono text-xs font-semibold tracking-[0.14em] text-primary">{milestone.year}</p>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em]">{milestone.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-warmgray">{milestone.text}</p>
                </article>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="life-in-practice" className="relative overflow-hidden bg-[#211a17] px-5 py-24 text-white sm:px-8 lg:py-36">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[42%] border-l border-white/10 bg-[#291f1b] lg:block"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-20">
            <GsapReveal y={24}>
              <div>
                <p className="text-sm font-medium text-[#e3c866]">Beyond the sessions</p>
                <h2 className="mt-4 max-w-md font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  A life in practice.
                </h2>
              </div>
            </GsapReveal>
            <GsapReveal y={24} delay={0.08}>
              <div className="max-w-2xl lg:ml-auto">
                <p className="font-serif text-2xl italic leading-[1.45] text-white/90 sm:text-3xl">
                  “The experience of the divine happens every day, in each
                  moment. It is not something that you achieve.”
                </p>
                <p className="mt-5 text-sm leading-7 text-white/55">
                  A glimpse of Manisha as a practitioner, teacher and woman
                  whose work has grown through decades of study, recognition
                  and lived spiritual practice.
                </p>
              </div>
            </GsapReveal>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
            <GsapReveal y={28}>
              <figure className="group relative min-h-[34rem] overflow-hidden rounded-[1.5rem] sm:min-h-[42rem] lg:min-h-[48rem]">
                <Image
                  src="/images/manisha-wix.jpg"
                  alt="Manisha Belvalkar in a personal portrait"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-[50%_22%] transition-transform duration-700 group-hover:scale-[1.015]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent px-6 pb-7 pt-24 sm:px-8">
                  <figcaption className="flex items-end justify-between gap-6">
                    <div>
                      <p className="font-display text-2xl font-semibold">
                        Presence before prescription.
                      </p>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-white/65">
                        The person behind the practice—warm, grounded and
                        deeply attentive.
                      </p>
                    </div>
                    <span className="hidden text-sm font-medium text-[#e3c866] sm:block">
                      Manisha Belvalkar
                    </span>
                  </figcaption>
                </div>
              </figure>
            </GsapReveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
              <GsapReveal y={24} delay={0.06}>
                <figure className="group relative min-h-[22rem] overflow-hidden rounded-[1.5rem] lg:min-h-[23.25rem]">
                  <Image
                    src="/images/about-success-today.jpg"
                    alt="Manisha Belvalkar featured as founder of Shakti Portal"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 38vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <figcaption className="absolute left-5 top-5 rounded-full bg-[#f8f3e9] px-4 py-2 text-xs font-semibold text-[#6b0b0b] shadow-sm">
                    A recognised voice
                  </figcaption>
                </figure>
              </GsapReveal>
              <GsapReveal y={24} delay={0.1}>
                <figure className="group relative min-h-[22rem] overflow-hidden rounded-[1.5rem] lg:min-h-[23.25rem]">
                  <Image
                    src="/images/about-health-mag.jpg"
                    alt="Manisha Belvalkar receiving professional recognition on stage"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 38vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16">
                    <figcaption className="text-sm font-semibold text-white">
                      A journey honoured through recognition
                    </figcaption>
                  </div>
                </figure>
              </GsapReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/15 bg-white/55 px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <GsapReveal y={28}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/about-portrait-1.png"
                alt={awards[0]?.title ?? "Manisha Belvalkar receiving an award"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </GsapReveal>
          <GsapReveal y={28} delay={0.08}>
            <Award className="h-9 w-9 text-primary" strokeWidth={1.5} />
            <h2 className="mt-7 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {awards[0]?.title ?? "Recognition for a lifetime of work"}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-warmgray sm:text-lg">
              {awards[0]?.description ?? "A recognition of sustained dedication to Tarot practice and spiritual guidance."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-dark active:scale-[0.98]"
              >
                Begin a conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={brand.whatsappHref} className="text-sm font-semibold text-primary hover:text-primary-dark">
                Message on WhatsApp
              </Link>
            </div>
          </GsapReveal>
        </div>
      </section>
    </main>
  );
}
