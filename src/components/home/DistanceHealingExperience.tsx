import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  HeartHandshake,
  ImageUp,
  LockKeyhole,
  MessageCircle,
  Music2,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { brand } from "@/lib/data";

const steps = [
  {
    number: "01",
    title: "Book your session",
    text: "Choose Distance Healing and complete your booking online or with our team on WhatsApp.",
    icon: HeartHandshake,
  },
  {
    number: "02",
    title: "Share your photograph",
    text: "After booking, upload one recent, clear photograph with your healing intention.",
    icon: ImageUp,
  },
  {
    number: "03",
    title: "Receive healing support",
    text: "Dr. Manisha works with your photograph through a focused, private healing process.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Receive and reflect",
    text: "Your photograph and healing music are shared with you, followed by a private feedback invitation.",
    icon: Music2,
  },
];

const healingFeedback = [
  {
    quote:
      "The chakra healing sessions helped me release years of accumulated stress. My focus and energy have completely changed.",
    name: "Ananya Iyer",
    role: "Healing client, Bengaluru",
  },
  {
    quote:
      "The serenity after her healing sessions is undeniable. It was a beautiful and deeply calming experience.",
    name: "Sneha Patil",
    role: "Healing client, Pune",
  },
];

const whatsappUrl = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(
  "Hello Manisha, I would like to book a Distance Healing session. Please guide me with the booking, payment and photograph submission process.",
)}`;

export default function DistanceHealingExperience() {
  return (
    <section
      aria-labelledby="distance-healing-title"
      className="relative isolate overflow-hidden bg-ivory py-20 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="pointer-events-none absolute -right-48 top-16 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-parchment shadow-[0_32px_80px_-38px_rgba(107,11,11,0.42)]">
              <Image
                src="/images/home-cards/distance-healing.png"
                alt="A calm Distance Healing session from the comfort of home"
                fill
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="max-w-sm font-display text-2xl leading-tight sm:text-3xl">
                  Healing support, wherever you are.
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-white/85">
                  <ShieldCheck className="h-4 w-4 text-gold-light" aria-hidden="true" />
                  Private and personally guided
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 max-w-[16rem] rounded-2xl border border-gold/30 bg-cream p-5 shadow-[0_20px_50px_-28px_rgba(107,11,11,0.45)] sm:right-[-1.5rem]">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-6 text-warmgray">
                  Your photograph is treated as private session material and is never published without consent.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <p className="eyebrow text-primary">Distance Healing</p>
            <h2
              id="distance-healing-title"
              className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-charcoal sm:text-5xl lg:text-6xl"
            >
              A personal healing journey, held beyond distance
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-warmgray sm:text-lg">
              Receive focused energy healing from your own space. The entire experience, from booking and photograph sharing to aftercare and feedback, is designed to feel clear, respectful and supported.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Book online or on WhatsApp", "Photograph shared privately", "Healing music included", "Feedback and aftercare included"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/checkout/healing/distance-healing"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-18px_rgba(107,11,11,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:translate-y-px"
              >
                Book Distance Healing
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-transparent px-7 py-3 text-sm font-semibold text-primary transition duration-300 hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:translate-y-px"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Continue on WhatsApp
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-5 text-warmgray">
              Distance Healing supports spiritual wellbeing and personal reflection. It does not replace medical diagnosis, treatment or emergency care.
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-primary/15 pt-12 lg:mt-28 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-primary">How your session unfolds</p>
              <h3 className="mt-3 max-w-md font-display text-3xl leading-tight text-charcoal sm:text-4xl">
                Four thoughtful steps, with clarity at every stage
              </h3>
            </div>
            <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.number} className="group border-t border-parchment pt-5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-semibold text-primary">{step.number}</span>
                      <Icon className="h-5 w-5 text-gold-deep" strokeWidth={1.7} aria-hidden="true" />
                    </div>
                    <h4 className="mt-6 text-base font-semibold text-charcoal">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-warmgray">{step.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-20 rounded-[2rem] border border-gold/25 bg-cream px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12">
            <div>
              <div className="flex items-center gap-1 text-gold-deep" aria-label="Five star client feedback">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <h3 className="mt-4 font-display text-3xl leading-tight text-charcoal">Healing experiences, shared with care</h3>
              <p className="mt-4 text-sm leading-6 text-warmgray">
                After delivery, every client is invited to share private feedback. A testimonial is published only when the client gives permission.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {healingFeedback.map((item) => (
                <blockquote key={item.name} className="relative border-l border-gold/50 pl-6">
                  <Quote className="h-6 w-6 text-primary/25" aria-hidden="true" />
                  <p className="mt-3 text-sm leading-7 text-ink">“{item.quote}”</p>
                  <footer className="mt-5">
                    <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                    <p className="mt-1 text-xs text-warmgray">{item.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
