import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/data";
import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ui/ContactForm";
import { isServerConfigured } from "@/lib/env";
import HomeFAQ from "@/components/home/HomeFAQ";

export const metadata: Metadata = {
  title: "Book a Tarot Session in Mumbai",
  description:
    "Book a tarot session in Mumbai with Dr. Manisha Belvalkar. Call +91 99222 46111 or send a message. In-person sessions in Prabhadevi, Pune and online.",
  alternates: { canonical: "/contact" },
};

const enquirySteps = [
  {
    numeral: "i.",
    title: "Personal review",
    text: "Every message is read directly by Dr. Manisha's desk, never filtered through automated templates or bots.",
  },
  {
    numeral: "ii.",
    title: "Thoughtful direction",
    text: "You receive clear guidance on whether a Tarot reading, energy healing, mentoring, or a course best serves your question.",
  },
  {
    numeral: "iii.",
    title: "Confirmed appointment",
    text: "Once you pick Mumbai, Pune, or an online session, your slot and quiet preparation notes are shared with you.",
  },
];

export default function ContactPage() {
  const locations = brand.locations ?? [
    { city: "Mumbai", address: brand.address, mapsHref: brand.mapsHref },
  ];

  const directoryItems = [
    {
      index: "01",
      label: "Telephone",
      value: brand.phone,
      note: "Monday to Saturday, 10:00 AM to 7:00 PM IST",
      href: brand.phoneHref,
      external: false,
      icon: Phone,
      tabular: true,
    },
    {
      index: "02",
      label: "Electronic mail",
      value: brand.email,
      note: "For private session, course, and media enquiries",
      href: brand.emailHref,
      external: false,
      icon: Mail,
      tabular: false,
    },
    ...locations.map((location, i) => ({
      index: String(i + 3).padStart(2, "0"),
      label: `${location.city} studio`,
      value: location.address,
      note: "In-person sessions by prior appointment",
      href: location.mapsHref,
      external: true,
      icon: MapPin,
      tabular: false,
    })),
  ];

  return (
    <div className="overflow-x-clip bg-[#fdf8f0] text-[#292524]">
      {/* 1. Editorial Split Hero */}
      <section className="relative isolate bg-[#fdf8f0] px-4 pb-12 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:min-h-[calc(100dvh-1rem)] lg:pb-24 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-12 size-[30rem] rounded-full bg-[#ddb829]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 bottom-4 size-[24rem] rounded-full bg-[#b41414]/6 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 sm:gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <GsapReveal y={18} instant>
                <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#981313]">
                  <span aria-hidden="true" className="h-px w-8 bg-[#981313]" />
                  Private consultation &amp; enquiries
                </span>
              </GsapReveal>

              <GsapReveal y={24} delay={0.07} instant>
                <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.25rem] leading-[1.03] tracking-[-0.03em] text-[#292524] sm:mt-6 sm:text-[clamp(3.1rem,5.6vw,4.9rem)] sm:leading-[0.98]">
                  Begin a quiet
                  <span className="block text-[#a81414]">conversation.</span>
                </h1>
              </GsapReveal>

              <GsapReveal y={18} delay={0.13} instant>
                <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                  Reach Dr. Manisha Belvalkar for Tarot consultations, energy healing, courses, or personal guidance across Mumbai, Pune, and online.
                </p>
              </GsapReveal>

              <GsapReveal y={18} delay={0.18} instant>
                <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
                  <Link
                    href="#enquiry-form"
                    className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-[#b41414] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-13 sm:pl-7 sm:pr-3"
                  >
                    <span>Write a message</span>
                    <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:scale-105">
                      <ArrowRight className="size-4 rotate-45" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <a
                    href={brand.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#a8871a]/65 bg-transparent px-6 py-3 text-sm font-semibold text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-13 sm:px-7"
                  >
                    <MessageCircle className="size-4" strokeWidth={1.6} />
                    <span>Open WhatsApp</span>
                  </a>
                </div>
              </GsapReveal>

              <GsapReveal y={16} delay={0.24} instant>
                <dl className="mt-8 grid gap-4 border-t border-[#6b0b0b]/12 pt-5 sm:mt-11 sm:grid-cols-3 sm:gap-5 sm:pt-7">
                  <div>
                    <dt className="text-sm font-semibold text-[#292524]">Mumbai &amp; Pune</dt>
                    <dd className="mt-1 text-sm leading-6 text-[#67564d]">Prabhadevi &amp; Erandavane</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-[#292524]">Online globally</dt>
                    <dd className="mt-1 text-sm leading-6 text-[#67564d]">Zoom &amp; WhatsApp sessions</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-[#292524]">Direct line</dt>
                    <dd className="mt-1 text-sm leading-6 text-[#67564d] tabular-nums">{brand.phone}</dd>
                  </div>
                </dl>
              </GsapReveal>
            </div>
          </div>

          {/* Double-Bezel Arch Portrait + Obsidian Studio Note */}
          <Reveal direction="left" delay={0.1}>
            <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[460px]">
              <div className="rounded-t-[999px] rounded-b-[2rem] bg-[#efe5d2]/85 p-2 ring-1 ring-[#c7a23b]/45 shadow-[0_36px_80px_-42px_rgba(107,11,11,0.5)]">
                <div className="relative aspect-[3/3.55] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-[#1c1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] sm:aspect-[3/4]">
                  <Image
                    src="/images/manisha/manisha-contact-portrait.webp"
                    alt="Dr. Manisha Belvalkar — Spiritual Mentor"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 460px"
                    className="object-cover object-[50%_16%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241612]/40 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative z-20 mx-2 -mt-8 rounded-2xl border-t-2 border-[#ddb829] bg-[#1c1917] p-5 text-white shadow-[0_28px_60px_-24px_rgba(28,25,23,0.72)] sm:-ml-8 sm:mr-14 sm:-mt-16 sm:p-7">
                <p className="font-serif text-lg leading-snug text-[#fdf8f0] sm:text-[1.35rem]">
                  “Every enquiry is read with care and answered personally with clear next steps within 24 hours.”
                </p>
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-[#f0d060]">
                  Dr. Manisha Belvalkar&apos;s Desk
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Sticky Editorial Directory + Double-Bezel Consultation Letter Form */}
      <section className="bg-[#f8f3e9] px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          {/* Left sticky directory */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-balance font-serif text-[1.95rem] leading-[1.06] text-[#292524] sm:text-5xl">
                Direct lines &amp;{" "}
                <span className="text-[#a81414]">private studios.</span>
              </h2>
              <p className="mt-4 max-w-md text-pretty text-base leading-7 text-[#57534e] sm:mt-5 sm:text-lg sm:leading-8">
                Choose whichever channel feels easiest. In-person consultations are held by prior appointment in Mumbai and Pune.
              </p>

              <div className="mt-8 border-t border-[#6b0b0b]/15 sm:mt-10">
                {directoryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.index}
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-3 border-b border-[#6b0b0b]/15 py-5 transition-colors duration-300 hover:bg-[#efe5d2]/45 sm:grid-cols-[3rem_1fr_auto] sm:gap-5 sm:py-6"
                    >
                      <span className="pt-0.5 font-serif text-lg tabular-nums text-[#a8871a]">
                        {item.index}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67564d]">
                          <Icon className="size-3.5 text-[#981313]" strokeWidth={1.6} />
                          <span>{item.label}</span>
                        </div>
                        <p
                          className={`mt-1.5 break-words font-serif text-lg font-semibold text-[#1c1917] transition-colors duration-300 group-hover:text-[#981313] sm:text-xl ${
                            item.tabular ? "tabular-nums" : ""
                          }`}
                        >
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#57534e]">{item.note}</p>
                      </div>

                      <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-[#c7a23b]/45 text-[#6b0b0b] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#981313] group-hover:bg-[#981313] group-hover:text-white">
                        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 border-l-2 border-[#a8871a] pl-4">
                <p className="text-sm font-semibold text-[#292524]">
                  International &amp; outstation seekers
                </p>
                <p className="mt-1 max-w-md text-sm leading-6 text-[#57534e]">
                  Tarot consultations, Soul Purpose readings, Distance Healing, and courses are available worldwide via Zoom and WhatsApp in IST-aligned slots.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right Double-Bezel Consultation Form */}
          <Reveal direction="left" delay={0.1}>
            <div
              id="enquiry-form"
              className="scroll-mt-24 rounded-[2rem] bg-[#efe5d2]/80 p-2 ring-1 ring-[#c7a23b]/40 shadow-[0_36px_80px_-48px_rgba(107,11,11,0.42)]"
            >
              <div className="rounded-[calc(2rem-0.5rem)] bg-[#fffdf9] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-8 lg:p-10">
                <div className="border-b border-[#efe5d2] pb-5">
                  <h2 className="font-serif text-2xl font-semibold text-[#1c1917] sm:text-3xl">
                    Send a private enquiry
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-[#57534e]">
                    Share what you are navigating, and Manisha&apos;s team will respond with suitable guidance or appointment slots.
                  </p>
                </div>

                <ContactForm manualMode={!isServerConfigured()} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Ruled Three-Column Process Strip */}
      <section className="border-y border-[#6b0b0b]/12 bg-[#efe5d2] px-4 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="max-w-xl">
              <h2 className="text-balance font-serif text-[1.85rem] leading-[1.08] text-[#292524] sm:text-4xl lg:text-5xl">
                How your enquiry{" "}
                <span className="text-[#a81414]">is held.</span>
              </h2>
              <p className="mt-3 text-base leading-7 text-[#57534e]">
                Simple, personal, and unhurried from your first message to your confirmed session.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-8 border-t border-[#6b0b0b]/15 pt-8 sm:mt-12 md:grid-cols-3 md:gap-10 md:pt-10">
            {enquirySteps.map((step, index) => (
              <Reveal key={step.numeral} delay={index * 0.06}>
                <div className="md:border-l md:border-[#6b0b0b]/15 md:pl-7 md:first:border-l-0 md:first:pl-0">
                  <span className="font-serif text-3xl text-[#a8871a] sm:text-4xl">
                    {step.numeral}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-[#1c1917] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grounded FAQ Sanctuary */}
      <HomeFAQ />
    </div>
  );
}
