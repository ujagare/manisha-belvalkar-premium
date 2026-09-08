import Link from "next/link";
import { Smartphone, Users, Radio } from "lucide-react";
import { appName, appTagline, appFeatures } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import Parallax from "@/components/ui/Parallax";

export default function EcosystemPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Beyond the Website"
          title="An ecosystem of support"
          subtitle="Guidance that travels with you — across app, community and live sessions."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {/* App */}
          <GsapReveal y={50}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                <Smartphone className="h-5 w-5 text-gold-light" />
              </div>
              <h3 className="relative font-display text-xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">{appName}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-warmgray">{appTagline}</p>
              <ul className="relative mt-5 space-y-2">
                {appFeatures.map((f) => (
                  <li key={f.title} className="flex items-start gap-2 text-xs text-warmgray">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>
                      <span className="font-semibold text-ink">{f.title}</span> — {f.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className="relative mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
              >
                Coming soon <span className="text-warmgray">·</span> Learn more
              </Link>
            </div>
          </GsapReveal>

          {/* Community */}
          <GsapReveal delay={0.1} y={50}>
            <Link
              href="/community"
              className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] bg-charcoal p-8 ring-1 ring-gold/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]"
            >
              <Parallax
                src="/images/manisha-portrait.jpg"
                speed={0.3}
                containerClass="absolute inset-0"
                className="opacity-30 transition-opacity duration-700 group-hover:opacity-50"
                alt="Community"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">Community</h3>
                <p className="mt-2 text-sm text-white/70">
                  Sacred circles, monthly wisdom and Q&amp;A with Manisha.
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-gold">
                  Join our community
                </span>
              </div>
            </Link>
          </GsapReveal>

          {/* Live */}
          <GsapReveal delay={0.2} y={50}>
            <Link
              href="/live"
              className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] bg-charcoal p-8 ring-1 ring-gold/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]"
            >
              <Parallax
                src="/images/tarot.jpg"
                speed={0.3}
                containerClass="absolute inset-0"
                className="opacity-30 transition-opacity duration-700 group-hover:opacity-50"
                alt="Live Sessions"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Radio className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">Live Sessions</h3>
                <p className="mt-2 text-sm text-white/70">
                  Online sessions and interactive live workshops.
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-gold">
                  Attend live
                </span>
              </div>
            </Link>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}