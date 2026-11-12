import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  LockKeyhole,
  MessageCircle,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";

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

export default function DistanceHealingExperience() {
  return (
    <section
      aria-labelledby="distance-healing-title"
      className="relative isolate overflow-hidden bg-ivory py-12 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="pointer-events-none absolute -right-48 top-16 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-2xl bg-parchment shadow-[0_32px_80px_-38px_rgba(107,11,11,0.42)] sm:aspect-[4/5] sm:rounded-[2rem]">
              <Image
                src="/images/home-cards/distance-healing.webp"
                alt="A calm Distance Healing session from the comfort of home"
                fill
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-9">
                <p className="max-w-sm font-display text-xl leading-tight sm:text-3xl">
                  Healing support, wherever you are.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/85 sm:mt-5 sm:text-sm">
                  <ShieldCheck className="h-4 w-4 text-gold-light" aria-hidden="true" />
                  Private and personally guided
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-gold/30 bg-cream p-4 shadow-[0_20px_50px_-28px_rgba(107,11,11,0.45)] sm:absolute sm:-bottom-6 sm:-right-6 sm:mt-0 sm:max-w-[16rem] sm:p-5">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" aria-hidden="true" />
                <p className="text-xs leading-5 text-warmgray sm:text-sm sm:leading-6">
                  Your photograph is treated as private session material and is never published without consent.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pt-0">
            <p className="eyebrow text-primary">Distance Healing</p>
            <h2
              id="distance-healing-title"
              className="mt-3 max-w-2xl font-display text-[1.85rem] leading-[1.08] tracking-tight text-charcoal sm:mt-5 sm:text-5xl lg:text-6xl"
            >
              A personal healing journey, held beyond distance
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-warmgray sm:mt-6 sm:text-lg sm:leading-8">
              Receive focused energy healing from your own space. The entire experience, from booking and photograph sharing to aftercare and feedback, is designed to feel clear, respectful and supported.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Payment verified before submission", "Photograph shared privately", "Healing music included", "Feedback and aftercare included"].map(
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
                href="/checkout/healing/distance-healing"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-transparent px-7 py-3 text-sm font-semibold text-primary transition duration-300 hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:translate-y-px"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Pay first, then use WhatsApp
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-5 text-warmgray">
              Distance Healing supports spiritual wellbeing and personal reflection. It does not replace medical diagnosis, treatment or emergency care.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gold/25 bg-cream px-4 py-6 sm:mt-16 sm:rounded-[2rem] sm:px-10 sm:py-10 lg:px-12">
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
