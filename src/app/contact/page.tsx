import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { brand, disclaimer } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with Manisha Belvalkar for Tarot, Healing, and Well-being sessions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        image="/images/page-heroes/contact-hero.png"
        imageAlt="A calm and welcoming private consultation space"
        title={
          <>
            Let&apos;s <span className="text-crimson-gradient">connect</span>
          </>
        }
        subtitle="Whether you seek answers, alignment, or transformation — reach out and begin your journey."
      />

      <section className="py-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Contact details */}
            <div>
              <Reveal>
                <h2 className="font-display text-3xl font-bold text-charcoal">
                  Reach out to Manisha
                </h2>
                <p className="mt-4 leading-relaxed text-warmgray">
                  Ready to begin your journey? Send a message, and Manisha will
                  personally guide you toward the path that&apos;s right for you.
                </p>
              </Reveal>

              <div className="mt-10 space-y-6">
                <Reveal delay={0.1}>
                  <a
                    href={brand.phoneHref}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_25px_50px_-25px_rgba(221,184,41,0.45)]"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                      <Phone className="h-5 w-5 text-gold-light" />
                    </span>
                    <div className="relative">
                      <p className="text-sm text-warmgray">Phone</p>
                      <p className="font-display text-lg font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                        {brand.phone}
                      </p>
                    </div>
                  </a>
                </Reveal>

                <Reveal delay={0.15}>
                  <a
                    href={brand.emailHref}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_25px_50px_-25px_rgba(221,184,41,0.45)]"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                      <Mail className="h-5 w-5 text-gold-light" />
                    </span>
                    <div className="relative">
                      <p className="text-sm text-warmgray">Email</p>
                      <p className="break-all font-display text-lg font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                        {brand.email}
                      </p>
                    </div>
                  </a>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="space-y-4">
                    {brand.locations ? (
                      brand.locations.map((location, idx) => (
                        <a
                          key={idx}
                          href={location.mapsHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex items-center gap-5 overflow-hidden rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_25px_50px_-25px_rgba(221,184,41,0.45)]"
                        >
                          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                            <MapPin className="h-5 w-5 text-gold-light" />
                          </span>
                          <div className="relative">
                            <p className="text-sm text-warmgray">{location.city}</p>
                            <p className="font-display text-lg font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                              {location.address}
                            </p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <a
                        href={brand.mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-5 overflow-hidden rounded-[24px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_25px_50px_-25px_rgba(221,184,41,0.45)]"
                      >
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                          <MapPin className="h-5 w-5 text-gold-light" />
                        </span>
                        <div className="relative">
                          <p className="text-sm text-warmgray">Address</p>
                          <p className="font-display text-lg font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                            {brand.address}
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.25} className="mt-10">
                <Button
                  href={brand.whatsappHref}
                  size="lg"
                  variant="gold"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  Message on WhatsApp
                </Button>
              </Reveal>
            </div>

            {/* Contact form */}
            <Reveal direction="left" delay={0.15}>
              <div className="relative overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold text-charcoal">
                    Send a message
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warmgray">
                    Fill in the form below, and Manisha will get back to you.
                  </p>
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-ivory py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-xs leading-relaxed text-warmgray/60">
            <p className="mb-2 font-medium text-warmgray">Disclaimer</p>
            {disclaimer.map((p, i) => (
              <p key={i} className="mb-1">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />
    </>
  );
}
