import type { Metadata } from "next";
import { socialMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/data";
import ContactForm from "@/components/ui/ContactForm";
import { isServerConfigured } from "@/lib/env";
import HomeFAQ from "@/components/home/HomeFAQ";

export const metadata: Metadata = {

  title: "Book a Tarot Session in Mumbai",
  description:
    "Book a tarot session in Mumbai with Dr. Manisha Belvalkar. Call +91 99222 46111 or send a message. In-person sessions in Prabhadevi, Pune and online.",
  alternates: { canonical: "/contact" },
  ...socialMeta({ title: "Book a Tarot Session in Mumbai", description: "Book a tarot session in Mumbai with Dr. Manisha Belvalkar. Call +91 99222 46111 or send a message. In-person sessions in Prabhadevi, Pune and online.", image: "/images/manisha/manisha-contact-portrait.webp", path: "/contact" }),
};

const enquirySteps = [
  {
    index: "01",
    title: "Personal review",
    text: "Every message is read directly by Dr. Manisha's desk, never filtered through automated bots.",
  },
  {
    index: "02",
    title: "Clear direction",
    text: "Guidance on whether a Tarot reading, energy healing, mentoring, or a course best serves your question.",
  },
  {
    index: "03",
    title: "Confirmed appointment",
    text: "Once you pick Mumbai, Pune, or online, your slot and preparation notes are shared directly.",
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
      note: "Mon–Sat, 10:00 AM to 7:00 PM IST",
      href: brand.phoneHref,
      external: false,
      icon: Phone,
      tabular: true,
    },
    {
      index: "02",
      label: "Email",
      value: brand.email,
      note: "Private session, course, and media enquiries",
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
    <div className="bg-ivory text-charcoal">
      {/* 1. Compact Editorial Split Hero */}
      <section className="bg-[#fdfbf7] px-4 pb-10 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 text-xs text-warmgray sm:gap-3 sm:text-sm">
              <span aria-hidden="true" className="h-px w-6 bg-primary sm:w-8" />
              <span>Private consultation and enquiries</span>
            </div>

            <h1 className="mt-3 font-display text-[1.85rem] font-medium leading-[1.08] tracking-[-0.025em] text-charcoal sm:mt-4 sm:text-5xl lg:text-6xl">
              Begin a quiet conversation
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-warmgray sm:mt-5 sm:text-lg sm:leading-8">
              Reach Dr. Manisha Belvalkar for Tarot consultations, energy healing, courses, or personal guidance across Mumbai, Pune, and online.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="#enquiry-form"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] sm:h-12 sm:gap-2 sm:px-5 sm:text-sm"
              >
                <span>Write message</span>
                <ArrowDown className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              </Link>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-charcoal/15 bg-white px-3.5 text-xs font-medium text-charcoal transition-colors duration-150 hover:border-charcoal/30 hover:bg-ivory active:scale-[0.98] sm:h-12 sm:gap-2 sm:px-5 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-warmgray" strokeWidth={1.5} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Private Consultation Desk Summary Card (no portrait) */}
          <div className="rounded-2xl border border-charcoal/10 bg-ivory/70 p-1.5 shadow-[0_20px_50px_-36px_rgba(28,25,23,0.22)] sm:rounded-[1.35rem] sm:p-2">
            <div className="rounded-xl border border-charcoal/8 bg-white p-5 sm:rounded-2xl sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal/10 pb-3.5">
                <span className="text-xs font-medium text-primary">
                  Dr. Manisha Belvalkar&apos;s desk
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-warmgray">
                  <Clock className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                  Replies within 24 hrs
                </span>
              </div>

              <p className="mt-4 font-display text-base leading-relaxed text-charcoal sm:text-lg">
                “Every enquiry is read with care and answered personally with clear next steps within 24 hours.”
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-charcoal/10 pt-4 sm:gap-x-6">
                <div>
                  <dt className="text-[11px] text-warmgray sm:text-xs">Studios</dt>
                  <dd className="mt-0.5 text-xs font-medium text-charcoal sm:text-sm">Mumbai &amp; Pune</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-warmgray sm:text-xs">Online</dt>
                  <dd className="mt-0.5 text-xs font-medium text-charcoal sm:text-sm">Worldwide video &amp; call</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-warmgray sm:text-xs">Hours (IST)</dt>
                  <dd className="mt-0.5 text-xs font-medium text-charcoal sm:text-sm">Mon–Sat · 10 AM – 7 PM</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-warmgray sm:text-xs">Direct line</dt>
                  <dd className="mt-0.5 font-mono text-[11px] font-medium tabular-nums text-charcoal sm:text-sm">
                    <a href={brand.phoneHref} className="transition-colors hover:text-primary">
                      {brand.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Directory + Private Consultation Form */}
      <section className="border-t border-charcoal/10 bg-ivory px-4 py-9 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          {/* Left sticky directory */}
          <div className="lg:sticky lg:top-28">
            <p className="text-xs text-warmgray sm:text-sm">Directory</p>
            <h2 className="mt-1.5 font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-4xl">
              Direct lines and private studios
            </h2>
            <p className="mt-2.5 max-w-md text-sm leading-6 text-warmgray sm:mt-4 sm:text-base sm:leading-7">
              Choose whichever channel feels easiest. In-person consultations are held by prior appointment in Mumbai and Pune.
            </p>

            <div className="mt-5 border-t border-charcoal/10 sm:mt-8">
              {directoryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.index}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group grid grid-cols-[1.75rem_1fr_auto] items-start gap-3 border-b border-charcoal/10 py-3.5 transition-colors duration-150 hover:bg-[#fdfbf7] sm:grid-cols-[2.25rem_1fr_auto] sm:gap-4 sm:px-2 sm:py-5"
                  >
                    <span className="pt-0.5 font-mono text-xs tabular-nums text-warmgray">
                      {item.index}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-warmgray sm:gap-2">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-warmgray sm:h-4 sm:w-4" strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </div>
                      <p
                        className={`mt-1 break-words text-sm font-medium text-charcoal transition-colors duration-150 group-hover:text-primary sm:mt-1.5 sm:text-base ${item.tabular ? "font-mono tabular-nums" : ""
                          }`}
                      >
                        {item.value}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-warmgray sm:mt-1">{item.note}</p>
                    </div>

                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-warmgray transition-colors duration-150 group-hover:text-primary"
                      strokeWidth={1.5}
                    />
                  </a>
                );
              })}
            </div>

            <div className="mt-5 border-l border-primary pl-3.5 sm:mt-8 sm:pl-4">
              <p className="text-sm font-medium text-charcoal">
                International and outstation clients
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-warmgray sm:text-sm sm:leading-6">
                Tarot consultations, Soul Purpose readings, Distance Healing, and courses are available worldwide via private video room and WhatsApp in IST-aligned slots.
              </p>
            </div>
          </div>

          {/* Right clean form panel */}
          <div
            id="enquiry-form"
            className="scroll-mt-20 rounded-xl border border-charcoal/10 bg-white p-4 shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:rounded-2xl sm:p-8"
          >
            <div className="border-b border-charcoal/10 pb-4 sm:pb-5">
              <h2 className="font-display text-xl font-medium text-charcoal sm:text-3xl">
                Send a private enquiry
              </h2>
              <p className="mt-1.5 max-w-lg text-xs leading-5 text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
                Share what you are navigating, and Dr. Manisha&apos;s team will respond with suitable guidance or appointment slots.
              </p>
            </div>

            <ContactForm manualMode={!isServerConfigured()} />
          </div>
        </div>
      </section>

      {/* 3. Ruled Three-Column Process Strip */}
      <section className="border-t border-charcoal/10 bg-[#fdfbf7] px-4 py-9 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-xs text-warmgray sm:text-sm">What happens next</p>
            <h2 className="mt-1.5 font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-4xl">
              How your enquiry is handled
            </h2>
            <p className="mt-2 text-sm leading-6 text-warmgray sm:mt-3 sm:text-base sm:leading-7">
              Simple, personal, and unhurried from your first message to your confirmed session.
            </p>
          </div>

          <div className="mt-6 grid gap-5 border-t border-charcoal/10 pt-6 sm:mt-10 sm:gap-8 sm:pt-8 md:grid-cols-3 md:gap-10">
            {enquirySteps.map((step) => (
              <div
                key={step.index}
                className="grid grid-cols-[2rem_1fr] items-start gap-3 md:block md:border-l md:border-charcoal/10 md:pl-6 md:first:border-l-0 md:first:pl-0"
              >
                <span className="pt-0.5 font-mono text-xs tabular-nums text-primary md:pt-0">
                  {step.index}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-charcoal md:mt-3 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-warmgray md:mt-2">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grounded Compact FAQ */}
      <HomeFAQ />
    </div>
  );
}
