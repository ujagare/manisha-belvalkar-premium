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
      className="relative isolate overflow-hidden bg-[#f7f0e3] py-8 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ddb829]/60 to-transparent" />
      <div className="pointer-events-none hidden sm:block absolute -right-48 top-16 h-96 w-96 rounded-full bg-[#b41414]/6 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10">
        <div className="grid gap-5 sm:gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <Reveal direction="right">
            <div className="mx-auto w-full max-w-[320px] sm:max-w-md lg:mx-0">
              <div className="rounded-2xl bg-[#efe5d2] p-1.5 ring-1 ring-[#c7a23b]/40 shadow-[0_24px_55px_-38px_rgba(107,11,11,0.38)] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_32px_80px_-42px_rgba(107,11,11,0.42)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#1c1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] sm:aspect-[4/4.6] sm:rounded-[calc(2rem-0.5rem)]">
                  <Image
                    src="/images/home-cards/distance-healing.webp"
                    alt="A calm Distance Healing session from the comfort of home"
                    fill
                    sizes="(max-width: 1024px) 320px, 42vw"
                    className="object-cover object-center"
                  loading="lazy" />
                </div>
              </div>

              <div className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-[#d8c8ae] bg-[#fdf8f0] px-3 py-2.5 sm:mt-4 sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-4">
                <LockKeyhole
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#981313] sm:h-4 sm:w-4"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-[11.5px] leading-[1.45] text-[#57534e] sm:text-sm sm:leading-6">
                  Your photograph is treated as private session material and is
                  never published without explicit consent.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6b0b0b] sm:gap-2 sm:text-xs">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-[#a8871a] sm:h-4 sm:w-4"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>Private distance care from anywhere</span>
              </div>

              <h2
                id="distance-healing-title"
                className="mt-2.5 max-w-2xl text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.02em] text-[#292524] sm:mt-5 sm:text-5xl sm:leading-[1.06] lg:text-[3.25rem]"
              >
                A personal healing journey,{" "}
                <span className="text-[#a81414]">held beyond distance.</span>
              </h2>

              <p className="mt-2.5 max-w-xl text-pretty text-[13.5px] leading-6 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                Receive focused energy healing from your own quiet space. From
                booking and private photograph sharing to healing music and
                aftercare, every step stays clear and respectful.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-2.5 sm:mt-8 sm:gap-3.5">
                {[
                  "Payment verified before submission",
                  "Photograph shared privately",
                  "Healing music included",
                  "Feedback and aftercare included",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-[11.5px] font-medium leading-[1.35] text-[#292524] sm:items-center sm:gap-3 sm:text-sm sm:leading-normal"
                  >
                    <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#6b0b0b] text-[#f0d060] sm:mt-0 sm:size-6">
                      <Check className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-row sm:items-center sm:gap-3">
                <Link
                  href="/checkout/healing/distance-healing"
                  className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#b41414] px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-white shadow-[0_16px_36px_-18px_rgba(107,11,11,0.75)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddb829] sm:min-h-12 sm:justify-between sm:gap-4 sm:whitespace-nowrap sm:py-2.5 sm:pl-7 sm:pr-3 sm:text-sm"
                >
                  <span>Book Distance Healing</span>
                  <span className="hidden size-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 sm:grid">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </Link>
                <Link
                  href="/healing/distance-healing"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#a8871a]/65 bg-transparent px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddb829] sm:min-h-12 sm:whitespace-nowrap sm:px-6 sm:py-3 sm:text-sm"
                >
                  View session details
                </Link>
              </div>

              <p className="mt-3 max-w-xl text-[11px] leading-[1.45] text-[#57534e] sm:mt-4 sm:text-xs sm:leading-5">
                Distance Healing supports spiritual wellbeing and personal
                reflection. It does not replace medical diagnosis, treatment or
                emergency care.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Double-Bezel Client Reflections Strip */}
        <Reveal delay={0.12}>
          <div className="mt-6 rounded-2xl bg-[#efe5d2]/80 p-1.5 ring-1 ring-[#c7a23b]/35 sm:mt-20 sm:rounded-[2rem] sm:p-2">
            <div className="rounded-[calc(1rem-0.375rem)] bg-[#fdf8f0] px-3.5 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:rounded-[calc(2rem-0.5rem)] sm:px-10 sm:py-10 lg:px-12">
              <div className="grid gap-4 sm:gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-12">
                <div>
                  <div
                    className="flex items-center gap-1 text-[#a8871a]"
                    aria-label="Five star client feedback"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <h3 className="mt-2 font-serif text-lg leading-snug text-[#292524] sm:mt-4 sm:text-3xl sm:leading-tight">
                    Healing experiences, shared with care
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#57534e] sm:mt-3 sm:text-sm sm:leading-6">
                    After delivery, every client is invited to share private
                    feedback. A testimonial is published only when the client
                    gives permission.
                  </p>
                </div>

                <div className="grid gap-3.5 sm:gap-6 md:grid-cols-2">
                  {healingFeedback.map((item) => (
                    <blockquote
                      key={item.name}
                      className="border-l border-[#ddb829]/60 pl-3 sm:pl-6"
                    >
                      <p className="font-serif text-[13.5px] leading-5 text-[#292524] sm:text-base sm:leading-7">
                        “{item.quote}”
                      </p>
                      <footer className="mt-2 sm:mt-4">
                        <p className="text-xs font-semibold text-[#1c1917] sm:text-sm">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#57534e] sm:text-xs">
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
