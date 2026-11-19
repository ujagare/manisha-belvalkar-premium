import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  LockKeyhole,
  ShieldCheck,
  Star,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

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
      className="relative isolate overflow-hidden bg-[#f7f0e3] py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ddb829]/60 to-transparent" />
      <div className="pointer-events-none absolute -right-48 top-16 h-96 w-96 rounded-full bg-[#b41414]/6 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <Reveal direction="right">
            <div className="mx-auto w-full max-w-md lg:mx-0">
              <div className="rounded-[2rem] bg-[#efe5d2] p-2 ring-1 ring-[#c7a23b]/40 shadow-[0_32px_80px_-42px_rgba(107,11,11,0.42)]">
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#1c1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
                  <Image
                    src="/images/home-cards/distance-healing.webp"
                    alt="A calm Distance Healing session from the comfort of home"
                    fill
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#d8c8ae] bg-[#fdf8f0] px-4 py-3.5 sm:px-5 sm:py-4">
                <LockKeyhole
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#981313]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-xs leading-5 text-[#57534e] sm:text-sm sm:leading-6">
                  Your photograph is treated as private session material and is
                  never published without explicit consent.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b0b0b]">
                <ShieldCheck
                  className="h-4 w-4 text-[#a8871a]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>Private distance care from anywhere</span>
              </div>

              <h2
                id="distance-healing-title"
                className="mt-4 max-w-2xl text-balance font-serif text-[1.95rem] leading-[1.06] tracking-[-0.02em] text-[#292524] sm:mt-5 sm:text-5xl lg:text-[3.25rem]"
              >
                A personal healing journey,{" "}
                <span className="text-[#a81414]">held beyond distance.</span>
              </h2>

              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                Receive focused energy healing from your own quiet space. From
                booking and private photograph sharing to healing music and
                aftercare, every step stays clear and respectful.
              </p>

              <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {[
                  "Payment verified before submission",
                  "Photograph shared privately",
                  "Healing music included",
                  "Feedback and aftercare included",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-[#292524]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#6b0b0b] text-[#f0d060]">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/checkout/healing/distance-healing"
                  className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-[#b41414] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_-18px_rgba(107,11,11,0.75)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddb829] sm:pl-7 sm:pr-3"
                >
                  <span>Book Distance Healing</span>
                  <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </Link>
                <Link
                  href="/healing/distance-healing"
                  className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-[#a8871a]/65 bg-transparent px-6 py-3 text-sm font-semibold text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddb829]"
                >
                  View session details
                </Link>
              </div>

              <p className="mt-4 max-w-xl text-xs leading-5 text-[#57534e]">
                Distance Healing supports spiritual wellbeing and personal
                reflection. It does not replace medical diagnosis, treatment or
                emergency care.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Double-Bezel Client Reflections Strip */}
        <Reveal delay={0.12}>
          <div className="mt-14 rounded-[2rem] bg-[#efe5d2]/80 p-2 ring-1 ring-[#c7a23b]/35 sm:mt-20">
            <div className="rounded-[calc(2rem-0.5rem)] bg-[#fdf8f0] px-5 py-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:px-10 sm:py-10 lg:px-12">
              <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-12">
                <div>
                  <div
                    className="flex items-center gap-1 text-[#a8871a]"
                    aria-label="Five star client feedback"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-tight text-[#292524] sm:text-3xl">
                    Healing experiences, shared with care
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#57534e]">
                    After delivery, every client is invited to share private
                    feedback. A testimonial is published only when the client
                    gives permission.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {healingFeedback.map((item) => (
                    <blockquote
                      key={item.name}
                      className="border-l border-[#ddb829]/60 pl-5 sm:pl-6"
                    >
                      <p className="font-serif text-base leading-7 text-[#292524]">
                        “{item.quote}”
                      </p>
                      <footer className="mt-4">
                        <p className="text-sm font-semibold text-[#1c1917]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#57534e]">
                          {item.role}
                        </p>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
