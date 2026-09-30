"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const chakras = [
  {
    name: "Root",
    sanskrit: "Muladhara",
    color: "#a72b25",
    focus: "safety, stability and grounded energy",
    guidance: "Create steadier routines, spend time in nature and bring gentle attention to your sense of safety and belonging.",
    questions: [
      "Did you go through any major physical trauma in the first year or during the first seven years of your life?",
      "When someone does not agree with you, do you feel angry or irritated?",
      "If pushed beyond a certain limit, do you tend to get violent?",
      "Do you get tired easily?",
      "Do you feel emotionally burdened?",
  ] },
  {
    name: "Sacral",
    sanskrit: "Svadhishthana",
    color: "#d06f2a",
    focus: "emotion, creativity and healthy pleasure",
    guidance: "Make room for creative expression, emotional honesty and simple experiences that help you reconnect with joy.",
    questions: [
      "Did you miss hugging or physical display of affection in your childhood?",
      "Do you have intense fantasies of being swept off your feet by a romantic partner?",
      "Are you uncomfortable talking about sex openly?",
      "Are you impulsive by nature?",
      "Are you uncomfortable with people of the opposite gender?",
  ] },
  {
    name: "Solar Plexus",
    sanskrit: "Manipura",
    color: "#c8a01d",
    focus: "confidence, choice and personal power",
    guidance: "Practise making small clear decisions, honour your boundaries and notice where you give your power away.",
    questions: [
      "Do you feel things don't come easily to you?",
      "Is money most important to you?",
      "Do you put a lot of restrictions on yourself?",
      "Do you like it when people follow what you say?",
      "Do you feel confused about major issues in your life?",
  ] },
  {
    name: "Heart",
    sanskrit: "Anahata",
    color: "#4f8e68",
    focus: "love, compassion and emotional openness",
    guidance: "Offer yourself the care you readily give others, and explore forgiveness without dismissing your boundaries.",
    questions: [
      "Do you feel used in intimate relationships?",
      "Do you hold on to grudges for a long time?",
      "Do you think about your past hurts or past relationships often?",
      "Do you expect to be acknowledged for everything that you do for your partner?",
      "Do you find it difficult to be happy?",
  ] },
  {
    name: "Throat",
    sanskrit: "Vishuddha",
    color: "#377e9f",
    focus: "truth, expression and being heard",
    guidance: "Begin with one honest sentence at a time. Journalling, humming and calm boundary-setting can support expression.",
    questions: [
      "Do you always like to appear strong?",
      "Do you feel you have too much responsibility on you?",
      "Are you harsh with words?",
      "Do you like to talk about impersonal and trivial things?",
      "Are you scared of being judged?",
  ] },
  {
    name: "Third Eye",
    sanskrit: "Ajna",
    color: "#57548f",
    focus: "intuition, insight and inner vision",
    guidance: "Reduce mental noise, record your dreams and give yourself quiet space before seeking answers outside yourself.",
    questions: [
      "Do you have trouble sleeping and/or feel tired after waking up in the morning?",
      "Do you have problem remembering your dreams?",
      "Are you consistently forgetful?",
      "Do you lack intuition?",
      "Do you find it difficult to imagine and visualise things?",
  ] },
  {
    name: "Crown",
    sanskrit: "Sahasrara",
    color: "#81518d",
    focus: "trust, meaning and spiritual connection",
    guidance: "Create small moments of stillness and reflection, without pressure to have every answer or remain constantly productive.",
    questions: [
      "Do you find it difficult to relax?",
      "Do you find it difficult to trust?",
      "Do you feel alone, isolated and left out in this world?",
      "Are you a workaholic or do you compulsively keep yourself busy?",
      "Do you avoid sitting alone by yourself?",
      "Do you find coincidences to be just random acts of chance?",
  ] },
] as const;

const chakraQuestions = chakras.flatMap((chakra, chakraIndex) =>
  chakra.questions.map((question) => ({ question, chakraIndex, kind: "chakra" as const })),
);

const healingNeedsStatements = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed or hopeless",
  "Trouble falling asleep, staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself, or that you're a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
] as const;

const healingQuestions = healingNeedsStatements.map((question) => ({
  question,
  kind: "healing" as const,
}));

const questions = [...chakraQuestions, ...healingQuestions];

const yesNoOptions = [
  { label: "Yes", note: "This feels true for me", value: 1 },
  { label: "No", note: "This does not feel true for me", value: 0 },
] as const;

const healingOptions = [
  { label: "Never", note: "3 points", value: 3 },
  { label: "Rarely", note: "2 points", value: 2 },
  { label: "Sometimes", note: "1 point", value: 1 },
  { label: "Usually", note: "0 points", value: 0 },
] as const;

type Stage = "intro" | "questions" | "result";

export default function ChakraAssessment() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(questions.length));

  const result = useMemo(() => {
    const scores = chakras.map((_, chakraIndex) =>
      chakraQuestions.reduce((total, question, index) =>
        question.chakraIndex === chakraIndex ? total + (answers[index] ?? 0) : total,
      0),
    );
    const highest = scores.reduce((best, score, index) => score > scores[best] ? index : best, 0);
    const healingScore = answers
      .slice(chakraQuestions.length)
      .reduce<number>((total, answer) => total + (answer ?? 0), 0);
    return { chakra: chakras[highest], scores, highest, healingScore };
  }, [answers]);

  const selectAnswer = (value: number) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[current] = value;
      return next;
    });
    window.setTimeout(() => {
      if (current === questions.length - 1) setStage("result");
      else setCurrent((value) => value + 1);
    }, 240);
  };

  const restart = () => {
    setAnswers(Array(questions.length));
    setCurrent(0);
    setStage("questions");
  };

  const progress = stage === "result" ? 100 : ((current + 1) / questions.length) * 100;
  const activeQuestion = questions[current];
  const activeChakra = activeQuestion.kind === "chakra" ? chakras[activeQuestion.chakraIndex] : null;
  const activeColor = activeChakra?.color ?? "#b41414";
  const activeOptions = activeQuestion.kind === "chakra" ? yesNoOptions : healingOptions;

  return (
    <section className="relative overflow-hidden bg-[#f6eddf] px-5 py-24 sm:px-8 lg:px-10 lg:py-32" aria-labelledby="chakra-assessment-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(221,184,41,0.18),transparent_25%),radial-gradient(circle_at_90%_80%,rgba(180,20,20,0.08),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-8 border-b border-gold/25 pb-8">
          <div>
            <p className="font-serif text-xl italic tracking-[0.05em] text-primary">A quiet check-in with yourself</p>
            <h2 id="chakra-assessment-title" className="mt-3 text-balance font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-7xl">
              Discover your <span className="text-crimson-gradient">chakra</span>
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-7 text-warmgray lg:block">The complete client questionnaire with seven chakra sections and a healing needs assessment.</p>
        </div>

        <div className="grid overflow-hidden rounded-[1.75rem] border border-gold/25 bg-white shadow-[0_38px_100px_-55px_rgba(92,19,14,0.42)] lg:min-h-[38rem] lg:grid-cols-[0.78fr_1.22fr] lg:rounded-[2.25rem]">
          <div className="relative min-h-[22rem] overflow-hidden bg-[#24110e] lg:min-h-full">
            <Image src="/images/chakra.png" alt="The seven chakra energy centres" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#24110e] via-[#24110e]/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#24110e]/38" />
            <div className="absolute inset-x-7 bottom-7 text-white sm:inset-x-10 sm:bottom-9">
              <div className="flex items-center gap-3 text-gold-light">
                <Sparkles className="h-4 w-4" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.25em]">Seven energy centres</span>
              </div>
              <p className="mt-3 max-w-sm font-serif text-2xl italic leading-snug text-white/92">Notice what is asking for your care—not what needs to be “fixed”.</p>
            </div>
          </div>

          <div className="relative flex min-h-[36rem] flex-col bg-[#fffdf9] p-6 sm:p-10 lg:p-12">
            {stage === "intro" && (
              <div className="my-auto max-w-2xl animate-fade-up">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">Complimentary self-assessment</p>
                <h3 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-charcoal sm:text-5xl">Listen to what your energy is saying.</h3>
                <p className="mt-6 max-w-xl text-base leading-8 text-warmgray">Answer each chakra question honestly, then reflect on how often you have experienced the listed concerns during the last four to six weeks.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {["38 questions", "Original answer scale", "Instant reflection"].map((item) => (
                    <div key={item} className="border-l border-gold/45 bg-gold-soft/45 px-4 py-3 text-sm font-semibold text-charcoal">{item}</div>
                  ))}
                </div>
                <button type="button" onClick={() => setStage("questions")} className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_15px_35px_-16px_rgba(107,11,11,0.7)] transition duration-300 hover:-translate-y-1 hover:bg-primary-dark">
                  Begin assessment<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-5 text-xs leading-5 text-warmgray/75">For self-reflection only. This assessment is not a medical or psychological diagnosis.</p>
              </div>
            )}

            {stage === "questions" && (
              <div className="flex h-full flex-col animate-fade-up" key={current}>
                <div>
                  <div className="flex items-center justify-between gap-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold-deep">Question {current + 1} of {questions.length}</p>
                    <p className="font-serif text-sm italic text-warmgray">
                      {activeChakra ? `${activeChakra.name} · ${activeChakra.sanskrit}` : "Healing Needs Assessment"}
                    </p>
                  </div>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-parchment">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: activeColor }} />
                  </div>
                </div>

                <div className="my-auto py-10">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: activeColor, boxShadow: `0 0 0 6px ${activeColor}18` }} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-warmgray">
                      {activeQuestion.kind === "chakra" ? "Choose Yes or No" : "Think about the last 4 to 6 weeks"}
                    </span>
                  </div>
                  <h3 className="max-w-3xl text-pretty font-display text-3xl font-semibold leading-[1.18] tracking-[-0.025em] text-charcoal sm:text-4xl">{activeQuestion.question}</h3>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {activeOptions.map((option, index) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectAnswer(option.value)}
                        className={cn(
                          "group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5",
                          answers[current] === option.value
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/15"
                            : "border-parchment bg-white text-charcoal hover:-translate-y-0.5 hover:border-gold hover:bg-gold-soft/40",
                        )}
                      >
                        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold", answers[current] === option.value ? "border-white/35 bg-white/12" : "border-gold/35 bg-gold-soft text-gold-deep")}>{String.fromCharCode(65 + index)}</span>
                        <span><span className="block text-sm font-semibold">{option.label}</span><span className={cn("mt-0.5 block text-xs", answers[current] === option.value ? "text-white/65" : "text-warmgray")}>{option.note}</span></span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-parchment pt-5">
                  <button type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition hover:text-primary disabled:invisible"><ArrowLeft className="h-4 w-4" />Previous</button>
                  <span className="text-xs text-warmgray">Your answers stay on this page only.</span>
                </div>
              </div>
            )}

            {stage === "result" && (
              <div className="my-auto animate-fade-up">
                <div className="flex items-center gap-3 text-emerald-700"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50"><Check className="h-4 w-4" /></span><span className="text-xs font-semibold uppercase tracking-[0.23em]">Your reflection is ready</span></div>
                <p className="mt-8 font-serif text-xl italic text-warmgray">Your energy may benefit from attention around</p>
                <div className="mt-3 flex items-end gap-4">
                  <span className="mb-3 h-4 w-4 rounded-full" style={{ backgroundColor: result.chakra.color, boxShadow: `0 0 0 8px ${result.chakra.color}16` }} />
                  <h3 className="font-display text-5xl font-semibold leading-none tracking-[-0.05em] text-charcoal sm:text-6xl">{result.chakra.name}</h3>
                </div>
                <p className="mt-3 font-serif text-2xl italic" style={{ color: result.chakra.color }}>{result.chakra.sanskrit}</p>
                <p className="mt-7 max-w-xl text-base leading-8 text-warmgray">This chakra is associated with {result.chakra.focus}. {result.chakra.guidance}</p>

                <div className="mt-7 border-l border-gold/50 bg-gold-soft/40 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">Healing Needs Assessment</p>
                  <p className="mt-2 text-sm leading-6 text-warmgray">
                    Your wellbeing reflection score is <strong className="text-charcoal">{result.healingScore} out of 21</strong>. A higher score means these concerns were experienced less often.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-7 gap-2" aria-label="Chakra score overview">
                  {chakras.map((chakra, index) => (
                    <div key={chakra.name} className="text-center">
                      <div className="flex h-20 items-end overflow-hidden rounded-full bg-parchment/70 p-1">
                        <div className="w-full rounded-full transition-all duration-700" style={{ height: `${Math.max(12, (result.scores[index] / chakra.questions.length) * 100)}%`, backgroundColor: chakra.color, opacity: index === result.highest ? 1 : 0.48 }} />
                      </div>
                      <span className="mt-2 hidden text-[0.56rem] font-semibold text-warmgray sm:block">{chakra.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/healing/shakti-healing" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark">Explore healing support<ArrowRight className="h-4 w-4" /></Link>
                  <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full border border-parchment px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-primary"><RotateCcw className="h-4 w-4" />Retake</button>
                </div>
                <p className="mt-5 text-xs leading-5 text-warmgray/75">This result offers reflective guidance, not a diagnosis. For persistent physical or emotional concerns, consult a qualified healthcare professional.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
