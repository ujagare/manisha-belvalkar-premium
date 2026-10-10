"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Download, ImageUp, Loader2, MessageCircle, Music2, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type CaseView = {
  id: string;
  status: string;
  submission_method: "website" | "whatsapp" | null;
  intention: string | null;
  source_photo_path: string | null;
};

export default function DistanceHealingPortal({ orderId, reference, initialCase, resultUrl, musicUrl, hasFeedback }: {
  orderId: string; reference: string; initialCase: CaseView;
  resultUrl: string | null; musicUrl: string | null; hasFeedback: boolean;
}) {
  const [healingCase, setHealingCase] = useState(initialCase);
  const [method, setMethod] = useState<"website" | "whatsapp">(initialCase.submission_method ?? "website");
  const [intention, setIntention] = useState(initialCase.intention ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSaved, setFeedbackSaved] = useState(hasFeedback);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [publicationConsent, setPublicationConsent] = useState("private");
  const [pending, startTransition] = useTransition();

  const submitted = healingCase.status !== "awaiting_submission";
  const delivered = ["ready", "delivered", "completed"].includes(healingCase.status);
  const whatsappUrl = `https://wa.me/919922246111?text=${encodeURIComponent(`Namaste Manisha ji, I have completed payment for Distance Healing.\n\nBooking reference: ${reference}\nSubmission method: WhatsApp\n\nI will share my recent photograph here.`)}`;

  function submit() {
    setError(null);
    if (intention.trim().length < 10) return setError("Please share your healing intention in at least 10 characters.");
    if (method === "website" && !photo && !healingCase.source_photo_path) return setError("Please choose a recent photograph.");
    if (!consent) return setError("Please confirm the privacy consent.");
    startTransition(async () => {
      const body = new FormData();
      body.set("orderId", orderId); body.set("method", method); body.set("intention", intention.trim()); body.set("consent", "true");
      if (photo) body.set("photo", photo);
      const response = await fetch("/api/distance-healing/submit", { method: "POST", body });
      const data = await response.json().catch(() => null);
      if (!response.ok) return setError(data?.error?.message ?? "Submission could not be saved.");
      setHealingCase((current) => ({ ...current, ...data.case, intention: intention.trim() }));
      if (method === "whatsapp") window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  function submitFeedback() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/distance-healing/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId: healingCase.id, rating, message, publicationConsent }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) return setError(data?.error?.message ?? "Feedback could not be saved.");
      setFeedbackSaved(true);
    });
  }

  return <div className="space-y-8">
    <div className="rounded-3xl border border-parchment bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">Paid booking</p><p className="mt-2 font-mono text-sm font-semibold text-charcoal">{reference}</p></div><span className="rounded-full bg-primary-soft px-4 py-2 text-xs font-bold capitalize text-primary">{healingCase.status.replaceAll("_", " ")}</span></div>
    </div>

    {!submitted ? <section className="rounded-3xl border border-parchment bg-white p-6 sm:p-8">
      <h2 className="font-display text-3xl font-semibold text-charcoal">Share your photograph privately</h2>
      <p className="mt-3 text-sm leading-6 text-warmgray">Choose website upload or WhatsApp. Both options are linked to your verified paid booking.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {([['website', ImageUp, 'Upload on website'], ['whatsapp', MessageCircle, 'Send on WhatsApp']] as const).map(([value, Icon, label]) => <button key={value} type="button" onClick={() => setMethod(value)} className={cn("flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left text-sm font-semibold transition", method === value ? "border-primary bg-primary-soft text-primary" : "border-parchment text-charcoal hover:border-gold")}><Icon className="h-5 w-5" />{label}</button>)}
      </div>
      <label className="mt-6 block text-sm font-semibold text-charcoal" htmlFor="healing-intention">Healing intention</label>
      <textarea id="healing-intention" rows={5} value={intention} onChange={(event) => setIntention(event.target.value.slice(0, 2000))} className="mt-2 w-full rounded-2xl border border-parchment px-4 py-3 text-sm leading-6 outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/10" placeholder="Please share what you would like support with." />
      {method === "website" ? <div className="mt-5"><label htmlFor="healing-photo" className="block text-sm font-semibold text-charcoal">Recent clear photograph</label><input id="healing-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-2xl border border-dashed border-gold/50 bg-ivory p-4 text-sm text-warmgray file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white" /><p className="mt-2 text-xs text-warmgray">JPG, PNG or WebP, maximum 10 MB.</p></div> : null}
      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-warmgray"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" /><span>I consent to my photograph and intention being used privately for this Distance Healing service. Media is scheduled for deletion after the retention period.</span></label>
      {error ? <p className="mt-4 rounded-xl bg-primary-soft p-3 text-sm text-primary" role="alert">{error}</p> : null}
      <button type="button" disabled={pending} onClick={submit} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : method === "website" ? <ImageUp className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}{pending ? "Saving securely…" : method === "website" ? "Submit photograph securely" : "Verify and continue on WhatsApp"}</button>
    </section> : <section className="rounded-3xl border border-gold/30 bg-gold-soft/45 p-6 sm:p-8"><CheckCircle2 className="h-8 w-8 text-primary" /><h2 className="mt-4 font-display text-3xl font-semibold text-charcoal">Submission received</h2><p className="mt-3 text-sm leading-6 text-warmgray">Your submission is connected to {reference}. The team will update this page as the healing progresses.</p>{healingCase.submission_method === "whatsapp" ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"><MessageCircle className="h-4 w-4" />Open paid WhatsApp handoff</a> : null}</section>}

    {delivered ? <section className="rounded-3xl bg-charcoal p-6 text-white sm:p-8"><ShieldCheck className="h-7 w-7 text-gold" /><h2 className="mt-4 font-display text-3xl font-semibold">Your private healing delivery</h2><p className="mt-3 text-sm leading-6 text-white/65">These secure links expire shortly. Refresh this page to generate new links.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row">{resultUrl ? <a href={resultUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-primary-deeper"><Download className="h-4 w-4" />Download photograph</a> : null}{musicUrl ? <a href={musicUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"><Music2 className="h-4 w-4" />Open healing music</a> : null}</div></section> : null}

    {delivered && !feedbackSaved ? <section className="rounded-3xl border border-parchment bg-white p-6 sm:p-8"><h2 className="font-display text-3xl font-semibold text-charcoal">Share private feedback</h2><div className="mt-5 flex gap-2">{[1,2,3,4,5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} stars`}><Star className={cn("h-7 w-7", value <= rating ? "fill-gold text-gold-deep" : "text-parchment")} /></button>)}</div><textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value.slice(0, 2000))} className="mt-5 w-full rounded-2xl border border-parchment px-4 py-3 text-sm outline-none focus:border-gold-dark" placeholder="How did you feel after the experience?" /><select value={publicationConsent} onChange={(event) => setPublicationConsent(event.target.value)} className="mt-4 h-12 w-full rounded-xl border border-parchment bg-white px-4 text-sm"><option value="private">Keep my feedback private</option><option value="anonymous">May publish anonymously</option><option value="first_name">May publish with my first name</option></select>{error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}<button type="button" disabled={pending || message.trim().length < 10} onClick={submitFeedback} className="mt-5 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white disabled:opacity-50">Submit feedback</button></section> : null}
    {feedbackSaved ? <div className="rounded-2xl bg-green-50 p-5 text-sm font-medium text-green-800">Thank you. Your feedback has been saved with your selected privacy preference.</div> : null}
  </div>;
}
