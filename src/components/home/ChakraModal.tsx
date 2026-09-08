"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Loader2, Download, CheckCircle2, ArrowLeft } from "lucide-react";
import { brand } from "@/lib/data";
import { cn } from "@/lib/utils";
import { startLenis, stopLenis } from "@/components/providers/SmoothScrollProvider";

/* ==================================================================
   Chakra Questionnaire — exact questions from ChakraQuestionnaire.pdf
   Part 1: seven chakra sections answered Yes/No (Yes = needs healing).
   Part 2: Healing Needs Assessment — Never 3 / Rarely 2 / Sometimes 1 /
   Usually 0 points (higher total = better wellbeing).
   ================================================================== */

export interface ChakraSection {
  chakra: string;
  sanskrit: string;
  color: string;
  questions: string[];
}

export const CHAKRA_SECTIONS: ChakraSection[] = [
  {
    chakra: "Root",
    sanskrit: "Muladhara",
    color: "#c0392b",
    questions: [
      "Did you go through any major physical trauma in the first year or during the first seven years of your life?",
      "When someone does not agree with you, do you feel angry or irritated?",
      "If pushed beyond a certain limit, do you tend to get violent?",
      "Do you get tired easily?",
      "Do you feel emotionally burdened?",
    ],
  },
  {
    chakra: "Sacral",
    sanskrit: "Svadhishthana",
    color: "#e67e22",
    questions: [
      "Did you miss hugging or physical display of affection in your childhood?",
      "Do you have intense fantasies of being swept off your feet by a romantic partner?",
      "Are you uncomfortable talking about sex openly?",
      "Are you impulsive by nature?",
      "Are you uncomfortable with people of the opposite gender?",
    ],
  },
  {
    chakra: "Solar Plexus",
    sanskrit: "Manipura",
    color: "#ddb829",
    questions: [
      "Do you feel things don't come easily to you?",
      "Is money most important to you?",
      "Do you put a lot of restrictions on yourself?",
      "Do you like it when people follow what you say?",
      "Do you feel confused about major issues in your life?",
    ],
  },
  {
    chakra: "Heart",
    sanskrit: "Anahata",
    color: "#4c9a6f",
    questions: [
      "Do you feel used in intimate relationships?",
      "Do you hold on to grudges for a long time?",
      "Do you think about your past hurts or past relationships often?",
      "Do you expect to be acknowledged for everything that you do for your partner?",
      "Do you find it difficult to be happy?",
    ],
  },
  {
    chakra: "Throat",
    sanskrit: "Vishuddha",
    color: "#3d8fb5",
    questions: [
      "Do you always like to appear strong?",
      "Do you feel you have too much responsibility on you?",
      "Are you harsh with words?",
      "Do you like to talk about impersonal and trivial things?",
      "Are you scared of being judged?",
    ],
  },
  {
    chakra: "Third Eye",
    sanskrit: "Ajna",
    color: "#5b5ea6",
    questions: [
      "Do you have trouble sleeping and/or feel tired after waking up in the morning?",
      "Do you have problem remembering your dreams?",
      "Are you consistently forgetful?",
      "Do you lack intuition?",
      "Do you find it difficult to imagine and visualise things?",
    ],
  },
  {
    chakra: "Crown",
    sanskrit: "Sahasrara",
    color: "#9b59b6",
    questions: [
      "Do you find it difficult to relax?",
      "Do you find it difficult to trust?",
      "Do you feel alone, isolated and left out in this world?",
      "Are you a workaholic or do you compulsively keep yourself busy?",
      "Do you avoid sitting alone by yourself?",
      "Do you find coincidences to be just random acts of chance?",
    ],
  },
];

/** Healing Needs Assessment statements (last 4–6 weeks). */
export const HEALING_NEEDS_STATEMENTS: string[] = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed or hopeless",
  "Trouble falling asleep, staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you're a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
];

/** Healing Needs scale — points per answer (higher = less bothered). */
const HEALING_SCALE = [
  { label: "Never", points: 3 },
  { label: "Rarely", points: 2 },
  { label: "Sometimes", points: 1 },
  { label: "Usually", points: 0 },
] as const;

type YesNo = "yes" | "no";

const TOTAL_CHAKRA_QUESTIONS = CHAKRA_SECTIONS.reduce(
  (n, s) => n + s.questions.length,
  0,
); // 31
const HEALING_MAX = HEALING_NEEDS_STATEMENTS.length * 3; // 21
const STEPS = CHAKRA_SECTIONS.length + 1; // 7 chakra steps + healing step

interface ChakraModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChakraModal({ open, onClose }: ChakraModalProps) {
  const [step, setStep] = useState(0); // 0..6 chakra sections, 7 healing, 8 results
  const [answers, setAnswers] = useState<Record<string, YesNo>>({});
  const [healing, setHealing] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  // Lock background page scroll while the questionnaire is open.
  // Lenis drives a virtual scroll, so body overflow alone is not enough —
  // Lenis must be paused for the duration and the modal body marked
  // data-lenis-prevent so wheel/touch scrolls the questionnaire itself.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopLenis();
    return () => {
      document.body.style.overflow = previous;
      startLenis();
    };
  }, [open]);

  const isResults = step >= STEPS;
  const currentSection = step < CHAKRA_SECTIONS.length ? CHAKRA_SECTIONS[step] : null;

  const chakraScores = useMemo(
    () =>
      CHAKRA_SECTIONS.map((section, si) => {
        const yes = section.questions.filter(
          (_, qi) => answers[`${si}-${qi}`] === "yes",
        ).length;
        return { ...section, yes, max: section.questions.length };
      }),
    [answers],
  );

  const healingScore = useMemo(() => {
    let total = 0;
    let answeredAll = true;
    HEALING_NEEDS_STATEMENTS.forEach((_, i) => {
      const p = healing[i];
      if (p === undefined) answeredAll = false;
      else total += p;
    });
    return { total, answeredAll };
  }, [healing]);

  const chakraAnswered = Object.keys(answers).length;
  const healingAnswered = Object.keys(healing).length;

  /** Current step fully answered? */
  const stepComplete = currentSection
    ? currentSection.questions.every((_, qi) => answers[`${step}-${qi}`])
    : healingAnswered === HEALING_NEEDS_STATEMENTS.length;

  function setAnswer(key: string, value: YesNo) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function setHealingAnswer(index: number, points: number) {
    setHealing((prev) => ({ ...prev, [index]: points }));
  }

  function handleSubmit() {
    setSending(true);
    // Scoring is fully local — the personal report goes through WhatsApp.
    setTimeout(() => setSending(false), 500);
    setStep(STEPS); // results view
  }

  function waHref() {
    const lines = chakraScores
      .map((s) => `${s.chakra} (${s.sanskrit}): ${s.yes}/${s.max}`)
      .join("\n");
    const text = `Hello Manisha, I completed the Chakra Questionnaire.\n\nName: ${name || "-"}\nEmail: ${email || "-"}\n\nChakra scores (Yes = needs healing):\n${lines}\nTotal chakra score: ${chakraScores.reduce((n, s) => n + s.yes, 0)}/${TOTAL_CHAKRA_QUESTIONS}\n\nHealing Needs Assessment: ${healingScore.total}/${HEALING_MAX}\n\nPlease guide me further.`;
    return `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(text)}`;
  }

  function attentionLabel(ratio: number) {
    if (ratio >= 0.6) return { label: "Needs attention", cls: "text-primary" };
    if (ratio >= 0.3) return { label: "Moderate", cls: "text-gold-deep" };
    return { label: "Balanced", cls: "text-emerald-700" };
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-charcoal/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chakra questionnaire"
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------- Header ---------------- */}
        <div className="relative border-b border-parchment bg-white px-6 py-5 sm:px-8">
          {!isResults ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="eyebrow mb-1 text-gold-dark">
                    {step < CHAKRA_SECTIONS.length
                      ? `Section ${step + 1} · ${currentSection?.chakra} chakra`
                      : "Healing Needs Assessment"}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal">
                    Discover Your Chakra
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-soft"
                  aria-label="Close questionnaire"
                >
                  <X className="h-5 w-5 text-charcoal" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-parchment/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      ((chakraAnswered + healingAnswered) /
                        (TOTAL_CHAKRA_QUESTIONS +
                          HEALING_NEEDS_STATEMENTS.length)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="eyebrow mb-1 text-gold-dark">Your Result</div>
              <h3 className="font-display text-2xl font-bold text-charcoal">
                Chakra Report
              </h3>
              <button
                onClick={onClose}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary-soft"
                aria-label="Close questionnaire"
              >
                <X className="h-5 w-5 text-charcoal" />
              </button>
            </>
          )}
        </div>

        {/* ---------------- Body ---------------- */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8"
        >
          {/* ---- Chakra section step ---- */}
          {currentSection ? (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    background: currentSection.color,
                    boxShadow: `0 0 12px ${currentSection.color}66`,
                  }}
                />
                <h4 className="font-display text-xl font-bold text-charcoal">
                  {currentSection.chakra}{" "}
                  <span className="ml-1 font-serif text-base italic text-warmgray">
                    ({currentSection.sanskrit})
                  </span>
                </h4>
                <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-warmgray">
                  Yes / No
                </span>
              </div>

              <div className="space-y-3">
                {currentSection.questions.map((question, qi) => {
                  const key = `${step}-${qi}`;
                  return (
                    <div
                      key={key}
                      className="rounded-2xl border border-parchment bg-white p-4"
                    >
                      <p className="text-sm leading-relaxed text-ink">
                        <span className="mr-1.5 font-display font-bold text-gold-dark">
                          {qi + 1}.
                        </span>
                        {question}
                      </p>
                      <div className="mt-3 flex gap-2.5">
                        {(["yes", "no"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAnswer(key, option)}
                            className={cn(
                              "flex-1 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all duration-200",
                              answers[key] === option
                                ? option === "yes"
                                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
                                  : "border-charcoal bg-charcoal text-white"
                                : "border-parchment bg-cream text-warmgray hover:border-gold hover:text-charcoal",
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="/pdfs/chakra-questionnaire.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-warmgray underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                Prefer paper? Download the PDF questionnaire
              </a>
            </div>
          ) : null}

          {/* ---- Healing Needs step ---- */}
          {step === CHAKRA_SECTIONS.length ? (
            <div>
              <p className="mb-5 rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm leading-relaxed text-gold-deep">
                <strong>Healing Needs Assessment</strong> — how often have you
                been bothered by the following problems in the last 4 to 6
                weeks?
              </p>

              <div className="space-y-3">
                {HEALING_NEEDS_STATEMENTS.map((statement, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-parchment bg-white p-4"
                  >
                    <p className="text-sm leading-relaxed text-ink">
                      <span className="mr-1.5 font-display font-bold text-gold-dark">
                        {i + 1}.
                      </span>
                      {statement}
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
                      {HEALING_SCALE.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setHealingAnswer(i, option.points)}
                          className={cn(
                            "rounded-full border px-1 py-2 text-xs font-semibold transition-all duration-200 sm:px-2",
                            healing[i] === option.points
                              ? "border-gold-dark bg-gradient-to-r from-gold to-gold-dark text-primary-deeper shadow-sm"
                              : "border-parchment bg-cream text-warmgray hover:border-gold hover:text-charcoal",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact details */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cq-name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
                  >
                    Name
                  </label>
                  <input
                    id="cq-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-parchment bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-warmgray/50 focus:border-gold focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cq-email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
                  >
                    Email
                  </label>
                  <input
                    id="cq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-parchment bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-warmgray/50 focus:border-gold focus:ring-2 focus:ring-gold/30"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* ---- Results ---- */}
          {isResults ? (
            <div>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-gold-deep" />
                <p className="text-sm leading-relaxed text-gold-deep">
                  Thank you{name ? `, ${name.split(" ")[0]}` : ""}! Your
                  complete assessment is ready — {TOTAL_CHAKRA_QUESTIONS}{" "}
                  chakra questions + healing needs.
                </p>
              </div>

              {/* Chakra scores */}
              <h4 className="mt-6 font-display text-lg font-bold text-charcoal">
                Chakra scores{" "}
                <span className="font-serif text-sm font-normal italic text-warmgray">
                  (higher = more healing needed)
                </span>
              </h4>
              <div className="mt-3 space-y-3">
                {chakraScores.map((s) => {
                  const ratio = s.yes / s.max;
                  const attn = attentionLabel(ratio);
                  return (
                    <div key={s.chakra}>
                      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold text-charcoal">
                          <span
                            className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                            style={{ background: s.color }}
                          />
                          {s.chakra}{" "}
                          <span className="font-serif text-xs font-normal italic text-warmgray">
                            ({s.sanskrit})
                          </span>
                        </span>
                        <span className="flex items-baseline gap-2">
                          <span className={cn("text-xs font-semibold", attn.cls)}>
                            {attn.label}
                          </span>
                          <span className="font-display font-bold text-primary">
                            {s.yes}/{s.max}
                          </span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-parchment/70">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${ratio * 100}%`,
                            background: `linear-gradient(90deg, ${s.color}99, ${s.color})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-parchment bg-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">
                    Total chakra score
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-primary">
                    {chakraScores.reduce((n, s) => n + s.yes, 0)}
                    <span className="text-lg text-warmgray">
                      /{TOTAL_CHAKRA_QUESTIONS}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-parchment bg-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">
                    Healing needs wellbeing
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-gold-deep">
                    {healingScore.total}
                    <span className="text-lg text-warmgray">/{HEALING_MAX}</span>
                  </p>
                </div>
              </div>

              {(() => {
                const neediest = chakraScores.reduce((max, s) =>
                  s.yes / s.max > max.yes / max.max ? s : max,
                );
                return (
                  <p className="mt-4 rounded-2xl border border-parchment bg-white p-4 text-sm leading-relaxed text-warmgray">
                    Your energy currently needs the most attention in the{" "}
                    <strong className="text-charcoal">{neediest.chakra}</strong>{" "}
                    chakra. Send your result to Manisha to receive a
                    personalised healing path.
                  </p>
                );
              })()}
            </div>
          ) : null}
        </div>

        {/* ---------------- Footer ---------------- */}
        <div className="border-t border-parchment bg-white px-6 py-4 sm:px-8">
          {!isResults ? (
            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-warmgray transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <span className="text-xs font-medium text-warmgray">
                  Step {step + 1} of {STEPS}
                </span>
              )}

              {step < CHAKRA_SECTIONS.length ? (
                <button
                  onClick={() => stepComplete && setStep((s) => s + 1)}
                  disabled={!stepComplete}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all",
                    "hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {stepComplete ? "Continue" : "Answer all questions"}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!stepComplete || sending || !name.trim() || !email.trim()}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-7 py-3 text-sm font-bold text-primary-deeper shadow-md shadow-gold/30 transition-all",
                    "hover:from-gold-light hover:to-gold disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  See My Result
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                  setHealing({});
                }}
                className="text-sm font-medium text-warmgray transition-colors hover:text-primary"
              >
                Retake
              </button>
              <a
                href={waHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-7 py-3 text-sm font-bold text-primary-deeper shadow-md shadow-gold/30 transition-all hover:from-gold-light hover:to-gold"
              >
                Get My Personal Report
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
