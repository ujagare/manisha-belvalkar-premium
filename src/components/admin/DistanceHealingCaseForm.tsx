"use client";
import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";

export default function DistanceHealingCaseForm({ caseId, initialStatus, initialNotes }: { caseId: string; initialStatus: string; initialNotes: string | null }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [resultPhoto, setResultPhoto] = useState<File | null>(null);
  const [music, setMusic] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  function save() { setMessage(null); startTransition(async () => { const body = new FormData(); body.set("status", status); body.set("staffNotes", notes); if (resultPhoto) body.set("resultPhoto", resultPhoto); if (music) body.set("music", music); const response = await fetch(`/api/admin/distance-healing/${caseId}`, { method: "POST", body }); const data = await response.json().catch(() => null); setMessage(response.ok ? "Case updated successfully." : data?.error?.message ?? "Update failed."); if (response.ok) window.location.reload(); }); }
  return <div className="mt-5 grid gap-3 border-t border-parchment pt-5"><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-parchment bg-white px-3 text-sm"><option value="submitted">Submitted</option><option value="in_progress">In progress</option><option value="ready">Ready</option><option value="delivered">Delivered</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Private staff notes" className="rounded-xl border border-parchment px-3 py-2 text-sm" /><label className="text-xs font-semibold text-warmgray">Completed photograph<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setResultPhoto(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-xs" /></label><label className="text-xs font-semibold text-warmgray">Healing music<input type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav" onChange={(event) => setMusic(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-xs" /></label>{message ? <p className="text-xs text-primary">{message}</p> : null}<button type="button" onClick={save} disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Save workflow</button></div>;
}
