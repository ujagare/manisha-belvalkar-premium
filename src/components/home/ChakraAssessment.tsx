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
    <section className="relative overflow-hidden bg-[#fdf8f0] px-4 py-8 sm:px-10 sm:py-24 lg:py-32" aria-labelledby="chakra-assessment-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(221,184,41,0.14),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(180,20,20,0.06),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-5 max-w-2xl border-b border-[#6b0b0b]/12 pb-4 sm:mb-12 sm:pb-8">
          <p className="font-serif text-sm text-[#981313] sm:text-lg">A quiet check-in with yourself</p>
          <h2 id="chakra-assessment-title" className="mt-1.5 text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.02em] text-[#292524] sm:mt-3 sm:text-5xl sm:leading-[1.06] lg:text-6xl">
            Discover your <span className="text-[#a81414]">chakra</span>
          </h2>
          <p className="mt-2 max-w-xl text-[13px] leading-5 text-[#57534e] sm:mt-4 sm:text-base sm:leading-7">
            The complete seven-chakra questionnaire paired with a gentle wellbeing reflection.
          </p>
        </div>

        <div className="rounded-2xl bg-[#efe5d2]/80 p-1.5 ring-1 ring-[#c7a23b]/35 shadow-[0_28px_70px_-42px_rgba(92,19,14,0.38)] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_38px_90px_-50px_rgba(92,19,14,0.42)]">
          <div className="grid overflow-hidden rounded-[calc(1rem-0.375rem)] bg-[#fffdf9] sm:rounded-[calc(2rem-0.5rem)] lg:min-h-[38rem] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="relative flex flex-col justify-end min-h-[10.5rem] overflow-hidden bg-[#24110e] sm:min-h-[21rem] lg:min-h-full">
              <Image src="/images/chakra-energy-diagram.webp" alt="The seven chakra energy centres" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#1c1917]/15 lg:to-[#1c1917]/45" />
              <div className="relative z-10 border-t border-[#ddb829]/30 bg-[#1c1917]/88 px-3.5 py-3 text-white backdrop-blur-md sm:px-8 sm:py-6">
                <div className="flex items-center gap-2 text-[#f0d060] sm:gap-2.5">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold tracking-[0.06em] sm:text-xs">Seven energy centres</span>
                </div>
                <p className="mt-1 max-w-sm font-serif text-sm leading-snug text-[#fdf8f0] sm:mt-2 sm:text-xl">Notice what is asking for your care, not what needs to be fixed.</p>
              </div>
            </div>

            <div className="relative flex flex-col bg-[#fffdf9] p-4 sm:min-h-[32rem] sm:p-10 lg:p-12">
              {stage === "intro" && (
                <div className="my-auto max-w-2xl animate-fade-up">
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#a8871a] sm:text-xs">Complimentary self-assessment</p>
                  <h3 className="mt-2 text-balance font-serif text-xl leading-[1.1] tracking-[-0.02em] text-[#292524] sm:mt-4 sm:text-4xl sm:leading-[1.08] lg:text-5xl">Listen to what your energy is saying.</h3>
                  <p className="mt-2 max-w-xl text-[13px] leading-[1.55] text-[#57534e] sm:mt-6 sm:text-base sm:leading-8">Answer each chakra question honestly, then reflect on how often you have experienced the listed concerns during the last four to six weeks.</p>
                  <div className="mt-3.5 grid grid-cols-3 gap-1.5 sm:mt-8 sm:gap-3">
                    {["38 questions", "Original answer scale", "Instant reflection"].map((item) => (
                      <div key={item} className="border-l-2 border-[#ddb829]/70 bg-[#faf3dc]/60 px-2 py-2 text-[11px] font-semibold leading-tight text-[#292524] sm:px-4 sm:py-3 sm:text-sm">{item}</div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setStage("questions")} className="group mt-4 inline-flex min-h-10 items-center gap-2.5 rounded-full bg-[#b41414] py-2 pl-5 pr-2 text-xs font-semibold text-white shadow-[0_15px_35px_-16px_rgba(107,11,11,0.7)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] sm:mt-10 sm:min-h-12 sm:gap-3 sm:py-2.5 sm:pl-7 sm:pr-3 sm:text-sm">
                    <span>Begin assessment</span>
                    <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105 sm:size-8">
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.6} />
                    </span>
                  </button>
                  <p className="mt-3 text-[11px] leading-[1.45] text-[#57534e] sm:mt-5 sm:text-xs sm:leading-5">For self-reflection only. This assessment is not a medical or psychological diagnosis.</p>
                </div>
              )}

              {stage === "questions" && (
                <div className="flex h-full flex-col animate-fade-up" key={current}>
                  <div>
                    <div className="flex items-center justify-between gap-3 sm:gap-5">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#a8871a] sm:text-xs">Question {current + 1} of {questions.length}</p>
                      <p className="font-serif text-xs text-[#57534e] sm:text-sm">
                        {activeChakra ? `${activeChakra.name} · ${activeChakra.sanskrit}` : "Healing Needs Assessment"}
                      </p>
                    </div>
                    <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-parchment sm:mt-4">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: activeColor }} />
                    </div>
                  </div>

                  <div className="my-auto py-3.5 sm:py-10">
                    <div className="mb-2.5 flex items-center gap-2 sm:mb-6 sm:gap-3">
                      <span className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: activeColor, boxShadow: `0 0 0 5px ${activeColor}18` }} />
                      <span className="text-[11px] font-semibold tracking-[0.06em] text-[#57534e] sm:text-xs">
                        {activeQuestion.kind === "chakra" ? "Choose Yes or No" : "Think about the last 4 to 6 weeks"}
                      </span>
                    </div>
                    <h3 className="max-w-3xl text-pretty font-serif text-lg leading-[1.25] tracking-[-0.02em] text-[#292524] sm:text-3xl sm:leading-[1.22] lg:text-4xl">{activeQuestion.question}</h3>
                    <div className="mt-3.5 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
                      {activeOptions.map((option, index) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => selectAnswer(option.value)}
                          className={cn(
                            "group flex min-h-10 items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-300 active:scale-[0.98] sm:min-h-11 sm:gap-4 sm:rounded-2xl sm:p-5",
                            answers[current] === option.value
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/15"
                              : "border-parchment bg-white text-charcoal hover:-translate-y-0.5 hover:border-gold hover:bg-gold-soft/40",
                          )}
                        >
                          <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border font-display text-xs font-semibold sm:h-9 sm:w-9 sm:text-sm", answers[current] === option.value ? "border-white/35 bg-white/12" : "border-gold/35 bg-gold-soft text-gold-deep")}>{String.fromCharCode(65 + index)}</span>
                          <span><span className="block text-xs font-semibold sm:text-sm">{option.label}</span><span className={cn("mt-0.5 block text-[11px] sm:text-xs", answers[current] === option.value ? "text-white/65" : "text-warmgray")}>{option.note}</span></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-parchment pt-3.5 sm:pt-5">
                    <button type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} className="inline-flex items-center gap-1.5 text-xs font-medium text-warmgray transition hover:text-primary disabled:invisible sm:gap-2 sm:text-sm"><ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Previous</button>
                    <span className="text-[11px] text-warmgray sm:text-xs">Your answers stay on this page only.</span>
                  </div>
                </div>
              )}

              {stage === "result" && (
                <div className="my-auto animate-fade-up">
                  <div className="flex items-center gap-2.5 text-emerald-800 sm:gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 sm:h-8 sm:w-8"><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span><span className="text-[11px] font-semibold tracking-[0.08em] sm:text-xs">Your reflection is ready</span></div>
                  <p className="mt-3 font-serif text-base text-[#57534e] sm:mt-8 sm:text-xl">Your energy may benefit from attention around</p>
                  <div className="mt-2 flex items-center gap-2.5 sm:mt-3 sm:items-end sm:gap-4">
                    <span className="h-3 w-3 shrink-0 rounded-full sm:mb-3 sm:h-4 sm:w-4" style={{ backgroundColor: result.chakra.color, boxShadow: `0 0 0 7px ${result.chakra.color}16` }} />
                    <h3 className="font-serif text-2xl leading-none tracking-[-0.03em] text-[#292524] sm:text-5xl lg:text-6xl">{result.chakra.name}</h3>
                  </div>
                  <p className="mt-1 font-serif text-lg sm:mt-3 sm:text-2xl" style={{ color: result.chakra.color }}>{result.chakra.sanskrit}</p>
                  <p className="mt-2.5 max-w-xl text-[13px] leading-6 text-[#57534e] sm:mt-7 sm:text-base sm:leading-8">This chakra is associated with {result.chakra.focus}. {result.chakra.guidance}</p>

                  <div className="mt-3.5 border-l-2 border-[#ddb829]/60 bg-[#faf3dc]/50 px-3 py-2.5 sm:mt-7 sm:px-5 sm:py-4">
                    <p className="text-[11px] font-semibold tracking-[0.06em] text-[#a8871a] sm:text-xs">Healing Needs Assessment</p>
                    <p className="mt-1 text-xs leading-5 text-[#57534e] sm:mt-2 sm:text-sm sm:leading-6">
                      Your wellbeing reflection score is <strong className="text-[#292524]">{result.healingScore} out of 21</strong>. A higher score means these concerns were experienced less often.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1 sm:mt-8 sm:gap-2" aria-label="Chakra score overview">
                    {chakras.map((chakra, index) => (
                      <div key={chakra.name} className="min-w-0 text-center">
                        <div className="flex h-12 items-end overflow-hidden rounded-full bg-parchment/70 p-0.5 sm:h-20 sm:p-1">
                          <div className="w-full rounded-full transition-all duration-700" style={{ height: `${Math.max(12, (result.scores[index] / chakra.questions.length) * 100)}%`, backgroundColor: chakra.color, opacity: index === result.highest ? 1 : 0.48 }} />
                        </div>
                        <span className="mt-1 block truncate text-[0.52rem] font-semibold text-warmgray sm:mt-2 sm:text-[0.56rem]">{chakra.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-9 sm:gap-4">
                    <Link href="/healing/shakti-healing" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#b41414] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#8b0f0f] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-sm">Explore healing support<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Link>
                    <button type="button" onClick={restart} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d8c8ae] px-4 py-2 text-xs font-semibold text-[#292524] transition hover:border-[#ddb829] hover:text-[#981313] active:scale-[0.98] sm:px-6 sm:py-3 sm:text-sm"><RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Retake</button>
                  </div>
                  <p className="mt-3 text-[11px] leading-[1.45] text-[#57534e] sm:mt-5 sm:text-xs sm:leading-5">This result offers reflective guidance, not a diagnosis. For persistent physical or emotional concerns, consult a qualified healthcare professional.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
