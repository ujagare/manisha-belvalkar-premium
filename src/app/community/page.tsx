import type { Metadata } from "next";
import { socialMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarHeart,
  HeartHandshake,
  Mail,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { communityIntro, communityPillars, brand } from "@/lib/data";
import LeadCaptureForm from "@/components/backend/LeadCaptureForm";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = {

  title: "Magic Community — Monthly Guidance",
  description:
    "Join the Magic Community by Dr. Manisha Belvalkar for monthly moon-cycle guidance, spiritual tips, remedies and member-only offerings.",
  alternates: { canonical: "/community" },
  ...socialMeta({ title: "Magic Community — Monthly Guidance", description: "Join the Magic Community by Dr. Manisha Belvalkar for monthly moon-cycle guidance, spiritual tips, remedies and member-only offerings.", image: "/images/page-heroes/community-hero.webp", path: "/community" }),
};

const pillarIcons = [CalendarHeart, Sparkles, Users, HeartHandshake];

const lunarCadence = [
  {
    index: "01",
    phase: "new" as const,
    label: "New Moon",
    title: "Intention and reflection",
    copy: "Monthly lunar prompts to set grounded intentions for the cycle ahead.",
  },
  {
    index: "02",
    phase: "full" as const,
    label: "Full Moon",
    title: "Alignment and release",
    copy: "Guided reflection aligned with the fullness of the month.",
  },
  {
    index: "03",
    phase: "crescent" as const,
    label: "Weekly practice",
    title: "Everyday remedies",
    copy: "Simple spiritual tips and home remedies for clarity and calm.",
  },
  {
    index: "04",
    phase: "festival" as const,
    label: "Festive days",
    title: "Seasonal rituals",
    copy: "Timely festival rituals, remedies, and member-only updates.",
  },
];

function LunarMark({ phase }: { phase: "new" | "full" | "crescent" | "festival" }) {
  if (phase === "new") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-charcoal" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }
  if (phase === "full") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-charcoal" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" fill="currentColor" />
      </svg>
    );
  }
  if (phase === "crescent") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-charcoal" fill="none" aria-hidden="true">
        <path
          d="M12.5 3.5a7 7 0 1 0 4 12.2 5.5 5.5 0 0 1-4-12.2Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-primary" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10" cy="10" r="2.25" fill="currentColor" />
    </svg>
  );
}

export default function CommunityPage() {
  return (
    <div className="bg-ivory text-charcoal">
      {/* 1. Full-Bleed Sanctuary Scene Hero */}
      <section className="relative isolate overflow-hidden bg-[#1c1713] pt-16 text-[#fdf8f0] sm:pt-20">
        <Image
          src="/images/community/community-hero-sanctuary.webp"
          alt="Antique hammered brass urli with floating mogra jasmine, crimson rose petals, and two lit earthen beeswax diyas on a dark teak table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right sm:object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,23,19,0.72)_0%,rgba(28,23,19,0.82)_55%,rgba(28,23,19,0.94)_100%)] sm:bg-[linear-gradient(90deg,rgba(28,23,19,0.92)_0%,rgba(28,23,19,0.78)_44%,rgba(28,23,19,0.22)_78%,rgba(28,23,19,0.08)_100%)]"
        />

        <div className="relative mx-auto flex min-h-[390px] max-w-6xl flex-col justify-between px-4 pb-7 pt-8 sm:min-h-[580px] sm:px-8 sm:pb-14 sm:pt-20 lg:min-h-[650px]">
          <div className="my-auto max-w-xl py-2 sm:py-6">
            <div className="flex items-center gap-2.5 text-xs text-[#e6dfd4] sm:gap-3 sm:text-sm">
              <span aria-hidden="true" className="h-px w-6 bg-primary sm:w-8" />
              <span>Magic Community · Dr. Manisha Belvalkar</span>
            </div>

            <h1 className="mt-3 font-display text-[1.85rem] font-medium leading-[1.08] tracking-[-0.025em] text-[#fdf8f0] sm:mt-5 sm:text-5xl lg:text-6xl">
              Sacred guidance held in shared company
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#d7cfc3] sm:mt-5 sm:text-lg sm:leading-8">
              {communityIntro}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="#apply-community"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] sm:h-12 sm:gap-2 sm:px-5 sm:text-sm"
              >
                <span>Request access</span>
                <ArrowDown className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              </Link>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3.5 text-xs font-medium text-[#fdf8f0] backdrop-blur-sm transition-colors duration-150 hover:bg-white/15 active:scale-[0.98] sm:h-12 sm:gap-2 sm:px-5 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/12 pt-4 sm:mt-8 sm:gap-6 sm:pt-6">
            <div>
              <dt className="text-[11px] text-[#b8afa2] sm:text-xs">Cadence</dt>
              <dd className="mt-0.5 text-xs font-medium text-[#fdf8f0] sm:mt-1 sm:text-sm">Monthly lunar</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#b8afa2] sm:text-xs">Included</dt>
              <dd className="mt-0.5 text-xs font-medium text-[#fdf8f0] sm:mt-1 sm:text-sm">Remedies &amp; rituals</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#b8afa2] sm:text-xs">Access</dt>
              <dd className="mt-0.5 text-xs font-medium text-[#fdf8f0] sm:mt-1 sm:text-sm">By invitation</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 2. Asymmetric Editorial Index: What Members Receive */}
      <section className="px-4 py-7 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-5 sm:gap-7 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
          {/* Left editorial visual */}
          <div>
            <p className="text-xs text-warmgray sm:text-sm">Inside the circle</p>
            <h2 className="mt-1.5 font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-4xl">
              What members receive
            </h2>
            <p className="mt-2.5 max-w-md text-sm leading-6 text-warmgray sm:mt-3 sm:text-base">
              A quiet, like-hearted circle guided personally by Dr. Manisha Belvalkar — without noise, overwhelm, or automated feeds.
            </p>

            <figure className="mt-5 overflow-hidden rounded-xl border border-charcoal/10 bg-[#fdfbf7] shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:mt-6 sm:rounded-2xl">
              <div className="relative aspect-[16/10] bg-charcoal/5 sm:aspect-[4/3]">
                <Image
                  src="/images/community/community-lunar-ritual.webp"
                  alt="Handmade cotton-paper journal with a crimson silk ribbon bookmark beside a hammered brass bowl of Himalayan salt crystals, sandalwood, and incense in morning light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover object-center"
                loading="lazy" />
              </div>
              <figcaption className="border-t border-charcoal/10 px-4 py-2.5 text-xs leading-5 text-warmgray sm:px-5 sm:py-3">
                Monthly lunar guidance, simple home remedies, and seasonal ritual notes.
              </figcaption>
            </figure>
          </div>

          {/* Right compact pillar cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {communityPillars.map((pillar, i) => {
              const Icon = pillarIcons[i] ?? HeartHandshake;
              const num = String(i + 1).padStart(2, "0");
              return (
                <article
                  key={pillar.title}
                  className="flex flex-col rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)] transition-colors duration-150 hover:border-primary/25 sm:rounded-2xl sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium tabular-nums text-primary sm:text-xs">
                      {num}
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-charcoal/8 bg-ivory text-primary sm:h-8 sm:w-8">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.6} />
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-[13.5px] font-medium leading-snug text-charcoal sm:mt-4 sm:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-[11.5px] leading-[1.45] text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Monthly Lunar Rhythm Strip — compact 2x2 on mobile, 4-col ruled on desktop */}
      <section className="border-y border-charcoal/10 bg-[#fdfbf7] px-4 py-9 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-xs text-warmgray sm:text-sm">Monthly rhythm</p>
            <h2 className="mt-1.5 font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-4xl">
              How the circle moves each month
            </h2>
            <p className="mt-2 text-sm leading-6 text-warmgray sm:mt-3 sm:text-base">
              Guidance arrives at meaningful lunar and festive turning points instead of constant notifications.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4 lg:border-t lg:border-charcoal/10 lg:pt-8">
            {lunarCadence.map((item) => (
              <div
                key={item.index}
                className="rounded-xl border border-charcoal/10 bg-white p-3.5 sm:p-5 lg:rounded-none lg:border-0 lg:border-l lg:border-charcoal/10 lg:bg-transparent lg:p-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs tabular-nums text-warmgray">{item.index}</span>
                  <LunarMark phase={item.phase} />
                </div>
                <p className="mt-3 text-xs font-medium text-primary sm:mt-4">{item.label}</p>
                <h3 className="mt-1 font-display text-base font-medium leading-snug text-charcoal sm:mt-1.5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Split Membership Invitation & Application Desk */}
      <section id="apply-community" className="scroll-mt-20 px-4 py-10 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-7 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <span>By invitation · Details shared on WhatsApp</span>
              </div>
              <h2 className="mt-3 font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:text-4xl">
                Join the circle with intention
              </h2>
              <p className="mt-2.5 max-w-lg text-sm leading-6 text-warmgray sm:mt-3.5 sm:text-base sm:leading-7">
                No upfront payment on this form. Share your intention first — Dr. Manisha&apos;s team reviews each request personally and shares membership details and onboarding steps on WhatsApp.
              </p>

              {/* 3-step onboarding clarity strip */}
              <ol className="mt-5 grid gap-3 rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)] sm:mt-6 sm:rounded-2xl sm:p-5">
                {[
                  ["01", "Submit your request", "Share your name, email or WhatsApp number, and what brings you to the circle."],
                  ["02", "Instant reference & alert", "Your request is logged with a reference ID (plus email confirmation if shared)."],
                  ["03", "Personal WhatsApp onboarding", "Confirm on WhatsApp to receive membership details and private circle access."],
                ].map(([step, title, detail]) => (
                  <li
                    key={step}
                    className="grid grid-cols-[1.75rem_1fr] items-start gap-2.5 border-b border-charcoal/8 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="pt-0.5 font-mono text-xs font-medium tabular-nums text-primary">
                      {step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-charcoal sm:text-sm">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-warmgray">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 space-y-4 pt-2 sm:mt-7">
              <blockquote className="border-l-2 border-primary/35 pl-4">
                <p className="font-display text-sm italic leading-6 text-charcoal sm:text-[15px]">
                  “When seekers gather with sincerity, spiritual practice stops feeling solitary and becomes part of everyday life.”
                </p>
                <footer className="mt-1 text-xs font-medium text-warmgray">
                  — {brand.name}
                </footer>
              </blockquote>

              {/* Direct contact cards */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  href={brand.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-charcoal/10 bg-[#fdfbf7] px-3.5 py-3 text-xs font-medium text-charcoal transition-colors duration-150 hover:border-primary/30 hover:text-primary sm:text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />
                    <span>Message on WhatsApp</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-warmgray transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" strokeWidth={1.6} />
                </a>
                <a
                  href={brand.emailHref}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-charcoal/10 bg-[#fdfbf7] px-3.5 py-3 text-xs font-medium text-charcoal transition-colors duration-150 hover:border-primary/30 hover:text-primary sm:text-sm"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />
                    <span className="truncate">{brand.email}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-warmgray transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" strokeWidth={1.6} />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-[#fdfbf7] p-1.5 shadow-[0_24px_55px_-38px_rgba(28,25,23,0.22)] sm:rounded-[1.35rem] sm:p-2">
            <LeadCaptureForm
              kind="community"
              source="community-page"
              manualMode={!isServerConfigured()}
              className="mt-0 sm:mt-0 border-charcoal/8 shadow-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
