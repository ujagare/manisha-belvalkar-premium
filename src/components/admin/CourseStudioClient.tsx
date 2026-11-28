"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Download,
  LayoutGrid,
  Lock,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminCourseItem {
  slug: string;
  title: string;
  description: string;
  durationLabel: string;
  priceInr: number;
  image: string;
  highlights: string[];
  suitableFor: string[];
  trackCategory: "practitioner" | "sadhana";
  trackLabel: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminModuleItem {
  id: string;
  courseSlug: string;
  title: string;
  description: string;
  sortOrder: number;
  unlockOffsetDays: number;
  isPublished: boolean;
}

export interface AdminLessonItem {
  id: string;
  moduleId: string;
  courseSlug: string;
  lessonSlug: string;
  title: string;
  durationLabel: string;
  description: string;
  notesMarkdown: string;
  resources: Array<{ title: string; url: string }>;
  isFreePreview: boolean;
  videoProvider: "supabase_private" | "vdocipher" | "bunny" | "external_signed";
  hasVideo: boolean;
  sortOrder: number;
  isPublished: boolean;
  storagePath: string;
  vdocipherVideoId: string;
  bunnyLibraryId: string;
  bunnyVideoId: string;
  externalSourceUrl: string;
}

export interface AdminEnrollmentItem {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  courseSlug: string;
  status: string;
  enrolledAt: string | null;
  deviceCount: number;
}

export interface AdminSecurityEventItem {
  id: number;
  userId: string | null;
  studentEmail: string;
  courseSlug: string;
  lessonId: string | null;
  eventType: string;
  severity: string;
  ipHash: string | null;
  createdAt: string;
}

type StudioTab = "series" | "students" | "security";

const EMPTY_COURSE: AdminCourseItem = {
  slug: "",
  title: "",
  description: "",
  durationLabel: "Self-paced · Recorded video series",
  priceInr: 9999,
  image: "/images/tarot.webp",
  highlights: [
    "Step-by-step recorded video series",
    "Practice notes & guided reflections",
    "Personal account-protected classroom access",
  ],
  suitableFor: ["Beginners & seekers", "Practitioners deepening their study"],
  trackCategory: "sadhana",
  trackLabel: "Recorded Video Series",
  sortOrder: 10,
  isActive: true,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export default function CourseStudioClient({
  initialCourses,
  unimportedStatic,
  initialModules,
  initialLessons,
  initialEnrollments,
  initialSecurityEvents,
  allCourseOptions,
  vdocipherConfigured,
  maxDevicesPerStudent,
}: {
  initialCourses: AdminCourseItem[];
  unimportedStatic: Array<{
    slug: string;
    title: string;
    priceInr: number;
    moduleCount: number;
    lessonCount: number;
  }>;
  initialModules: AdminModuleItem[];
  initialLessons: AdminLessonItem[];
  initialEnrollments: AdminEnrollmentItem[];
  initialSecurityEvents: AdminSecurityEventItem[];
  allCourseOptions: Array<{ slug: string; title: string }>;
  vdocipherConfigured: boolean;
  maxDevicesPerStudent: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StudioTab>("series");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialCourses[0]?.slug ?? "__new__",
  );

  const activeCourseInitial =
    initialCourses.find((c) => c.slug === selectedSlug) ?? EMPTY_COURSE;
  const [courseForm, setCourseForm] = useState<AdminCourseItem>(activeCourseInitial);
  const [highlightsText, setHighlightsText] = useState(
    activeCourseInitial.highlights.join("\n"),
  );
  const [suitableText, setSuitableText] = useState(
    activeCourseInitial.suitableFor.join("\n"),
  );

  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  // Module creation form
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDripDays, setNewModuleDripDays] = useState(0);

  // Lesson Drawer / Editor state
  const [editingLesson, setEditingLesson] = useState<{
    id?: string;
    moduleId: string;
    lessonSlug: string;
    title: string;
    durationLabel: string;
    description: string;
    notesMarkdown: string;
    resourcesText: string;
    isFreePreview: boolean;
    sortOrder: number;
    videoProvider: AdminLessonItem["videoProvider"];
    storagePath: string;
    vdocipherVideoId: string;
    bunnyLibraryId: string;
    bunnyVideoId: string;
    externalSourceUrl: string;
  } | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Manual Enrollment Grant state
  const [grantEmail, setGrantEmail] = useState("");
  const [grantCourseSlug, setGrantCourseSlug] = useState(
    allCourseOptions[0]?.slug ?? "",
  );

  function selectCourse(slug: string) {
    setSelectedSlug(slug);
    setEditingLesson(null);
    setBanner(null);
    const found = initialCourses.find((c) => c.slug === slug) ?? EMPTY_COURSE;
    setCourseForm(found);
    setHighlightsText(found.highlights.join("\n"));
    setSuitableText(found.suitableFor.join("\n"));
  }

  async function postAdminAction(payload: Record<string, unknown>) {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setBanner({
          kind: "err",
          text: data?.error?.message ?? "Operation failed.",
        });
        return null;
      }
      router.refresh();
      return data;
    } catch {
      setBanner({ kind: "err", text: "Network error while saving." });
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    const cleanSlug =
      selectedSlug === "__new__"
        ? courseForm.slug || slugify(courseForm.title)
        : courseForm.slug;
    const result = await postAdminAction({
      action: "upsert_course",
      ...courseForm,
      slug: cleanSlug,
      highlights: highlightsText,
      suitableFor: suitableText,
    });
    if (result?.slug) {
      setSelectedSlug(result.slug);
      setBanner({
        kind: "ok",
        text: `Course "${courseForm.title}" saved. Now add modules & video episodes below.`,
      });
    }
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleTitle.trim() || selectedSlug === "__new__") return;
    const courseModules = initialModules.filter(
      (m) => m.courseSlug === selectedSlug,
    );
    const res = await postAdminAction({
      action: "upsert_module",
      courseSlug: selectedSlug,
      title: newModuleTitle.trim(),
      sortOrder: (courseModules.length + 1) * 10,
      unlockOffsetDays: newModuleDripDays,
      isPublished: true,
    });
    if (res) {
      setNewModuleTitle("");
      setNewModuleDripDays(0);
      setBanner({ kind: "ok", text: "Module added to series." });
    }
  }

  async function handleDirectVaultUpload(file: File) {
    if (!editingLesson || selectedSlug === "__new__") return;
    const epSlug =
      editingLesson.lessonSlug.trim() || slugify(editingLesson.title) || "episode";

    setBanner(null);
    setUploadProgress(1);
    try {
      const signRes = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_upload_url",
          courseSlug: selectedSlug,
          lessonSlug: epSlug,
          mimeType: file.type || "video/mp4",
        }),
      });
      const signData = await signRes.json().catch(() => null);
      if (!signRes.ok || !signData?.signedUrl || !signData?.storagePath) {
        setUploadProgress(null);
        setBanner({
          kind: "err",
          text: signData?.error?.message ?? "Could not start vault upload.",
        });
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signData.signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setUploadProgress(Math.max(2, Math.round((evt.loaded / evt.total) * 100)));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload rejected (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Upload connection failed"));
        xhr.send(file);
      });

      setEditingLesson((prev) =>
        prev
          ? {
              ...prev,
              lessonSlug: epSlug,
              videoProvider: "supabase_private",
              storagePath: signData.storagePath,
            }
          : null,
      );
      setUploadProgress(null);
      setBanner({
        kind: "ok",
        text: `Video uploaded to Private Vault (${signData.storagePath}). Click "Save Episode" below to publish.`,
      });
    } catch (err) {
      setUploadProgress(null);
      setBanner({
        kind: "err",
        text: err instanceof Error ? err.message : "Video upload failed.",
      });
    }
  }

  async function handleSaveLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLesson || selectedSlug === "__new__") return;
    const epSlug =
      editingLesson.lessonSlug.trim() || slugify(editingLesson.title);
    const parsedResources = editingLesson.resourcesText
      .split("\n")
      .map((line) => {
        const [title, url] = line.split("|").map((s) => s.trim());
        return title && url ? { title, url } : null;
      })
      .filter((x): x is { title: string; url: string } => x !== null);

    const res = await postAdminAction({
      action: "upsert_lesson",
      id: editingLesson.id,
      moduleId: editingLesson.moduleId,
      courseSlug: selectedSlug,
      lessonSlug: epSlug,
      title: editingLesson.title,
      durationLabel: editingLesson.durationLabel,
      description: editingLesson.description,
      notesMarkdown: editingLesson.notesMarkdown,
      resources: parsedResources,
      isFreePreview: editingLesson.isFreePreview,
      sortOrder: editingLesson.sortOrder,
      videoProvider: editingLesson.videoProvider,
      storagePath: editingLesson.storagePath,
      vdocipherVideoId: editingLesson.vdocipherVideoId,
      bunnyLibraryId: editingLesson.bunnyLibraryId,
      bunnyVideoId: editingLesson.bunnyVideoId,
      externalSourceUrl: editingLesson.externalSourceUrl,
    });

    if (res) {
      setEditingLesson(null);
      setBanner({ kind: "ok", text: "Video episode saved & protected." });
    }
  }

  const currentModules = initialModules.filter(
    (m) => m.courseSlug === selectedSlug,
  );
  const inputClass =
    "h-10 w-full rounded-xl border border-charcoal/15 bg-white px-3.5 text-sm text-charcoal outline-none focus:border-gold-dark";

  return (
    <div className="mt-6">
      {/* Security Architecture Status Bar */}
      <div className="grid gap-3 rounded-2xl border border-gold/30 bg-white p-4 sm:grid-cols-3 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2f7354]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Private Vault &amp; Signed Proxy
            </p>
            <p className="mt-0.5 text-xs text-warmgray">
              Active · 120s HMAC tokens + IDM/yt-dlp blocker + moving email/ID watermark
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Device &amp; Concurrent Stream Lock
            </p>
            <p className="mt-0.5 text-xs text-warmgray">
              Max {maxDevicesPerStudent} devices/account · Strictly 1 active stream at a time
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Video className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Hardware Widevine/FairPlay DRM
            </p>
            <p className="mt-0.5 text-xs text-warmgray">
              {vdocipherConfigured
                ? "VdoCipher Connected (OS screen-recorders blacked out)"
                : "Optional — add VDOCIPHER_API_SECRET in .env for hardware black-screen DRM"}
            </p>
          </div>
        </div>
      </div>

      {/* Top Studio Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-parchment pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("series")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition",
            activeTab === "series"
              ? "bg-primary text-white"
              : "bg-white text-charcoal ring-1 ring-parchment hover:ring-gold",
          )}
        >
          <LayoutGrid className="h-4 w-4" /> 1. Courses &amp; Video Series ({initialCourses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition",
            activeTab === "students"
              ? "bg-primary text-white"
              : "bg-white text-charcoal ring-1 ring-parchment hover:ring-gold",
          )}
        >
          <Users className="h-4 w-4" /> 2. Student Access &amp; Devices ({initialEnrollments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition",
            activeTab === "security"
              ? "bg-primary text-white"
              : "bg-white text-charcoal ring-1 ring-parchment hover:ring-gold",
          )}
        >
          <ShieldAlert className="h-4 w-4" /> 3. Anti-Piracy Logs ({initialSecurityEvents.length})
        </button>
      </div>

      {banner ? (
        <div
          role="status"
          className={cn(
            "mt-5 rounded-xl border px-4 py-3 text-sm font-medium",
            banner.kind === "ok"
              ? "border-[#2f7354]/30 bg-[#eef7f2] text-[#21543d]"
              : "border-primary/30 bg-primary-soft text-primary",
          )}
        >
          {banner.text}
        </div>
      ) : null}

      {/* TAB 1: SERIES BUILDER */}
      {activeTab === "series" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
          {/* Left Course Selector */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-parchment bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">
                  Studio Courses
                </p>
                <button
                  type="button"
                  onClick={() => selectCourse("__new__")}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white"
                >
                  <Plus className="h-3.5 w-3.5" /> New Course
                </button>
              </div>

              <div className="mt-3 space-y-1.5">
                {initialCourses.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => selectCourse(c.slug)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition",
                      selectedSlug === c.slug
                        ? "bg-charcoal text-white"
                        : "bg-ivory/70 text-charcoal hover:bg-ivory",
                    )}
                  >
                    <span className="truncate">{c.title}</span>
                    {!c.isActive ? (
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
                        Hidden
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {unimportedStatic.length > 0 ? (
              <div className="rounded-2xl border border-parchment bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-warmgray">
                  Existing Website Courses
                </p>
                <p className="mt-1 text-xs text-warmgray">
                  Import into Studio in 1 click to attach recorded video episodes:
                </p>
                <div className="mt-3 space-y-2">
                  {unimportedStatic.map((sc) => (
                    <div
                      key={sc.slug}
                      className="rounded-xl border border-parchment bg-ivory/40 p-2.5"
                    >
                      <p className="text-xs font-semibold text-charcoal">
                        {sc.title}
                      </p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          const res = await postAdminAction({
                            action: "import_static_course",
                            slug: sc.slug,
                          });
                          if (res?.slug) setSelectedSlug(res.slug);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-[11px] font-bold text-gold-deep hover:bg-gold hover:text-charcoal"
                      >
                        <Download className="h-3.5 w-3.5" /> Import to Studio
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          {/* Right Course & Series Curriculum Workspace */}
          <div className="space-y-6">
            {/* Course Details Card */}
            <form
              onSubmit={handleSaveCourse}
              className="rounded-2xl border border-parchment bg-white p-5 sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment pb-4">
                <h2 className="font-display text-2xl font-semibold text-charcoal">
                  {selectedSlug === "__new__"
                    ? "Create New Recorded Course Series"
                    : `Course Settings: ${courseForm.title}`}
                </h2>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal">
                  <input
                    type="checkbox"
                    checked={courseForm.isActive}
                    onChange={(e) =>
                      setCourseForm((p) => ({ ...p, isActive: e.target.checked }))
                    }
                  />
                  Published on `/courses`
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Course Title
                  </label>
                  <input
                    required
                    value={courseForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setCourseForm((p) => ({
                        ...p,
                        title,
                        slug:
                          selectedSlug === "__new__" ? slugify(title) : p.slug,
                      }));
                    }}
                    placeholder="e.g. Tarot Mastery Complete Recorded Batch"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    URL Slug (`/courses/[slug]`)
                  </label>
                  <input
                    required
                    value={courseForm.slug}
                    readOnly={selectedSlug !== "__new__"}
                    onChange={(e) =>
                      setCourseForm((p) => ({ ...p, slug: slugify(e.target.value) }))
                    }
                    className={cn(
                      inputClass,
                      selectedSlug !== "__new__" && "bg-ivory/70",
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={courseForm.priceInr}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        priceInr: Number(e.target.value),
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Format / Duration Badge
                  </label>
                  <input
                    value={courseForm.durationLabel}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        durationLabel: e.target.value,
                      }))
                    }
                    placeholder="Self-paced · 18 recorded lectures"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Catalog Filter Track
                  </label>
                  <select
                    value={courseForm.trackCategory}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        trackCategory:
                          e.target.value === "practitioner"
                            ? "practitioner"
                            : "sadhana",
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="sadhana">Sadhana &amp; Lineage</option>
                    <option value="practitioner">Tarot &amp; 1-on-1 Practitioner</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Cover Image Path or URL
                  </label>
                  <input
                    value={courseForm.image}
                    onChange={(e) =>
                      setCourseForm((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="/images/tarot.webp"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Course Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-sm outline-none focus:border-gold-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Course Highlights (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-xs outline-none focus:border-gold-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal">
                    Who It&apos;s Suitable For (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={suitableText}
                    onChange={(e) => setSuitableText(e.target.value)}
                    className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-xs outline-none focus:border-gold-dark"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save Course Metadata"}
                </button>
              </div>
            </form>

            {/* Video Series Modules & Episodes Builder */}
            {selectedSlug !== "__new__" ? (
              <section className="rounded-2xl border border-parchment bg-white p-5 sm:p-7">
                <div className="border-b border-parchment pb-4">
                  <h3 className="font-display text-2xl font-semibold text-charcoal">
                    Video Series Modules &amp; Episodes
                  </h3>
                  <p className="mt-1 text-xs text-warmgray">
                    Organize your video series into Modules (Chapters) and add unlimited recorded video episodes inside each module.
                  </p>
                </div>

                {/* Add Module Row */}
                <form
                  onSubmit={handleAddModule}
                  className="mt-4 grid gap-3 rounded-xl bg-ivory/70 p-4 sm:grid-cols-[1fr_11rem_auto]"
                >
                  <input
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="New Module Title (e.g. Module 1: Sacred Foundations)"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={newModuleDripDays}
                    onChange={(e) => setNewModuleDripDays(Number(e.target.value))}
                    title="0 = instant unlock upon enrollment; 7 = unlocks 7 days after enrollment"
                    placeholder="Drip days (0 = instant)"
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={busy || !newModuleTitle.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-charcoal px-4 py-2 text-xs font-bold text-white hover:bg-primary disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" /> Add Module
                  </button>
                </form>

                {/* Modules List */}
                <div className="mt-5 space-y-4">
                  {currentModules.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-charcoal/20 p-6 text-center text-sm text-warmgray">
                      No modules yet. Create &ldquo;Module 1&rdquo; above to start uploading your video series.
                    </p>
                  ) : (
                    currentModules.map((mod, mIdx) => {
                      const modLessons = initialLessons.filter(
                        (l) => l.moduleId === mod.id,
                      );
                      return (
                        <div
                          key={mod.id}
                          className="overflow-hidden rounded-2xl border border-parchment"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-ivory/80 px-4 py-3.5">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">
                                Module {mIdx + 1}
                                {mod.unlockOffsetDays > 0
                                  ? ` · Drip: Day +${mod.unlockOffsetDays}`
                                  : " · Instant Unlock"}
                              </span>
                              <h4 className="font-display text-lg font-semibold text-charcoal">
                                {mod.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingLesson({
                                    moduleId: mod.id,
                                    lessonSlug: `ep-${modLessons.length + 1}`,
                                    title: "",
                                    durationLabel: "20 min",
                                    description: "",
                                    notesMarkdown: "",
                                    resourcesText: "",
                                    isFreePreview: false,
                                    sortOrder: (modLessons.length + 1) * 10,
                                    videoProvider: vdocipherConfigured
                                      ? "vdocipher"
                                      : "supabase_private",
                                    storagePath: "",
                                    vdocipherVideoId: "",
                                    bunnyLibraryId: "",
                                    bunnyVideoId: "",
                                    externalSourceUrl: "",
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Video Episode
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete module ${mod.title}`}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete "${mod.title}" and all its episodes?`,
                                    )
                                  ) {
                                    void postAdminAction({
                                      action: "delete_module",
                                      moduleId: mod.id,
                                      courseSlug: selectedSlug,
                                    });
                                  }
                                }}
                                className="grid h-8 w-8 place-items-center rounded-full text-warmgray hover:bg-primary-soft hover:text-primary"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <ul className="divide-y divide-parchment bg-white">
                            {modLessons.length === 0 ? (
                              <li className="px-4 py-4 text-xs text-warmgray">
                                No episodes in this module yet. Click &ldquo;+ Add Video Episode&rdquo;.
                              </li>
                            ) : (
                              modLessons.map((les, lIdx) => (
                                <li
                                  key={les.id}
                                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-xs text-warmgray">
                                        {lIdx + 1}.
                                      </span>
                                      <span className="font-semibold text-sm text-charcoal">
                                        {les.title}
                                      </span>
                                      <span className="rounded-full bg-ivory px-2.5 py-0.5 text-[11px] text-warmgray">
                                        {les.durationLabel}
                                      </span>
                                      {les.isFreePreview ? (
                                        <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-bold uppercase text-gold-deep">
                                          Free Preview
                                        </span>
                                      ) : null}
                                      {les.hasVideo ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef7f2] px-2.5 py-0.5 text-[10px] font-bold text-[#21543d]">
                                          <CheckCircle2 className="h-3 w-3" />
                                          {les.videoProvider === "vdocipher"
                                            ? "VdoCipher DRM"
                                            : les.videoProvider === "bunny"
                                              ? "Bunny Signed"
                                              : "Vault Protected"}
                                        </span>
                                      ) : (
                                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                          Awaiting Video
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingLesson({
                                          id: les.id,
                                          moduleId: les.moduleId,
                                          lessonSlug: les.lessonSlug,
                                          title: les.title,
                                          durationLabel: les.durationLabel,
                                          description: les.description,
                                          notesMarkdown: les.notesMarkdown,
                                          resourcesText: les.resources
                                            .map((r) => `${r.title} | ${r.url}`)
                                            .join("\n"),
                                          isFreePreview: les.isFreePreview,
                                          sortOrder: les.sortOrder,
                                          videoProvider: les.videoProvider,
                                          storagePath: les.storagePath,
                                          vdocipherVideoId: les.vdocipherVideoId,
                                          bunnyLibraryId: les.bunnyLibraryId,
                                          bunnyVideoId: les.bunnyVideoId,
                                          externalSourceUrl:
                                            les.externalSourceUrl,
                                        })
                                      }
                                      className="rounded-full border border-parchment px-3 py-1 text-xs font-semibold text-charcoal hover:border-gold"
                                    >
                                      Edit / Upload Video
                                    </button>
                                    <button
                                      type="button"
                                      aria-label={`Delete episode ${les.title}`}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Delete episode "${les.title}"?`,
                                          )
                                        ) {
                                          void postAdminAction({
                                            action: "delete_lesson",
                                            lessonId: les.id,
                                          });
                                        }
                                      }}
                                      className="grid h-7 w-7 place-items-center rounded-full text-warmgray hover:text-primary"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Episode Editor Modal/Panel */}
                {editingLesson ? (
                  <form
                    onSubmit={handleSaveLesson}
                    className="mt-6 rounded-2xl border-2 border-gold bg-[#fdfaf3] p-5 shadow-lg sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-gold/25 pb-3">
                      <h4 className="font-display text-xl font-bold text-charcoal">
                        {editingLesson.id
                          ? `Edit Episode: ${editingLesson.title}`
                          : "Add New Video Episode"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingLesson(null)}
                        className="text-xs font-semibold text-warmgray hover:text-charcoal"
                      >
                        Cancel ✕
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Episode Title
                        </label>
                        <input
                          required
                          value={editingLesson.title}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p ? { ...p, title: e.target.value } : null,
                            )
                          }
                          placeholder="Episode 1: Invoking Sacred Intention"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Duration (e.g. 24 min)
                        </label>
                        <input
                          value={editingLesson.durationLabel}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p ? { ...p, durationLabel: e.target.value } : null,
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Episode ID Slug (`a-z, 0-9, -`)
                        </label>
                        <input
                          required
                          value={editingLesson.lessonSlug}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p
                                ? { ...p, lessonSlug: slugify(e.target.value) }
                                : null,
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Protected Video Engine
                        </label>
                        <select
                          value={editingLesson.videoProvider}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p
                                ? {
                                    ...p,
                                    videoProvider: e.target
                                      .value as AdminLessonItem["videoProvider"],
                                  }
                                : null,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="supabase_private">
                            1. Direct Upload to Private Vault (Built-in)
                          </option>
                          <option value="vdocipher">
                            2. VdoCipher Hardware DRM (Anti-Screen-Record)
                          </option>
                          <option value="bunny">
                            3. Bunny Stream Signed HLS
                          </option>
                          <option value="external_signed">
                            4. Private Cloud MP4 URL (Proxied &amp; Hidden)
                          </option>
                        </select>
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-charcoal">
                          <input
                            type="checkbox"
                            checked={editingLesson.isFreePreview}
                            onChange={(e) =>
                              setEditingLesson((p) =>
                                p
                                  ? { ...p, isFreePreview: e.target.checked }
                                  : null,
                              )
                            }
                          />
                          Free Demo Preview Lesson
                        </label>
                      </div>
                    </div>

                    {/* Provider-specific secure media box */}
                    <div className="mt-4 rounded-xl border border-parchment bg-white p-4">
                      {editingLesson.videoProvider === "supabase_private" ? (
                        <div>
                          <label className="block text-xs font-bold text-charcoal">
                            Upload Episode Video (`.mp4`, `.webm`, `.mov` up to 512 MB)
                          </label>
                          <p className="mt-0.5 text-xs text-warmgray">
                            Stored in private bucket `course-videos-private` — never publicly accessible, streamed only via 120s signed byte-range tokens.
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-xs font-bold text-white hover:bg-primary">
                              <Upload className="h-3.5 w-3.5" />
                              Choose Video File
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void handleDirectVaultUpload(file);
                                }}
                              />
                            </label>
                            {uploadProgress !== null ? (
                              <span className="text-xs font-bold text-primary">
                                Uploading to Private Vault: {uploadProgress}%
                              </span>
                            ) : editingLesson.storagePath ? (
                              <span className="font-mono text-xs text-[#21543d]">
                                ✓ Vault object: {editingLesson.storagePath}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      {editingLesson.videoProvider === "vdocipher" ? (
                        <div>
                          <label className="mb-1 block text-xs font-bold text-charcoal">
                            VdoCipher Video ID (Google Widevine + Apple FairPlay Hardware DRM)
                          </label>
                          <input
                            value={editingLesson.vdocipherVideoId}
                            onChange={(e) =>
                              setEditingLesson((p) =>
                                p
                                  ? { ...p, vdocipherVideoId: e.target.value }
                                  : null,
                              )
                            }
                            placeholder="e.g. 8f9d2a1b4c6e7f8a9b0c1d2e3f4a5b6c"
                            className={inputClass}
                          />
                        </div>
                      ) : null}

                      {editingLesson.videoProvider === "bunny" ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-bold text-charcoal">
                              Bunny Stream Library ID
                            </label>
                            <input
                              value={editingLesson.bunnyLibraryId}
                              onChange={(e) =>
                                setEditingLesson((p) =>
                                  p
                                    ? { ...p, bunnyLibraryId: e.target.value }
                                    : null,
                                )
                              }
                              placeholder="e.g. 241890"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold text-charcoal">
                              Bunny Video GUID
                            </label>
                            <input
                              value={editingLesson.bunnyVideoId}
                              onChange={(e) =>
                                setEditingLesson((p) =>
                                  p
                                    ? { ...p, bunnyVideoId: e.target.value }
                                    : null,
                                )
                              }
                              placeholder="e.g. 9a1d4f22-..."
                              className={inputClass}
                            />
                          </div>
                        </div>
                      ) : null}

                      {editingLesson.videoProvider === "external_signed" ? (
                        <div>
                          <label className="mb-1 block text-xs font-bold text-charcoal">
                            Private Origin `.mp4` URL (Hidden behind `/api/courses/stream/[token]`)
                          </label>
                          <input
                            value={editingLesson.externalSourceUrl}
                            onChange={(e) =>
                              setEditingLesson((p) =>
                                p
                                  ? { ...p, externalSourceUrl: e.target.value }
                                  : null,
                              )
                            }
                            placeholder="https://private-r2-or-s3-bucket.../episode-1.mp4"
                            className={inputClass}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Episode Summary (Overview Tab)
                        </label>
                        <textarea
                          rows={3}
                          value={editingLesson.description}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p ? { ...p, description: e.target.value } : null,
                            )
                          }
                          className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Sadhana / Mantra / Lecture Notes (Notes Tab)
                        </label>
                        <textarea
                          rows={3}
                          value={editingLesson.notesMarkdown}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p ? { ...p, notesMarkdown: e.target.value } : null,
                            )
                          }
                          placeholder="Key mantras, spread layouts, or daily practice instructions…"
                          className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-xs outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-charcoal">
                          Protected Resources (`Title | https://link` — 1 per line)
                        </label>
                        <textarea
                          rows={2}
                          value={editingLesson.resourcesText}
                          onChange={(e) =>
                            setEditingLesson((p) =>
                              p ? { ...p, resourcesText: e.target.value } : null,
                            )
                          }
                          placeholder="Workbook PDF | https://..."
                          className="w-full rounded-xl border border-charcoal/15 bg-white p-3 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="submit"
                        disabled={busy || uploadProgress !== null}
                        className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-dark disabled:opacity-50"
                      >
                        {busy ? "Saving…" : "Save Episode"}
                      </button>
                    </div>
                  </form>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* TAB 2: STUDENT ENROLLMENTS & DEVICE LOCK */}
      {activeTab === "students" ? (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await postAdminAction({
                action: "grant_enrollment",
                email: grantEmail,
                courseSlug: grantCourseSlug,
              });
              if (res?.granted) {
                setGrantEmail("");
                setBanner({
                  kind: "ok",
                  text: `Course access unlocked for ${res.studentName}.`,
                });
              }
            }}
            className="rounded-2xl border border-parchment bg-white p-5 sm:p-6"
          >
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Grant Manual Course Access (WhatsApp / Offline Enrollment)
            </h2>
            <p className="mt-1 text-xs text-warmgray">
              Online Razorpay orders unlock automatically. Use this form to unlock access for students who paid via bank transfer or WhatsApp.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="email"
                required
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="Student registered email (e.g. student@gmail.com)"
                className={inputClass}
              />
              <select
                value={grantCourseSlug}
                onChange={(e) => setGrantCourseSlug(e.target.value)}
                className={inputClass}
              >
                {allCourseOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" /> Unlock Access
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-parchment bg-white">
            <div className="border-b border-parchment px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-charcoal">
                Enrolled Learners &amp; Device Locks
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-parchment bg-ivory/70 uppercase tracking-wider text-warmgray">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Devices</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment">
                  {initialEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-warmgray">
                        No enrollments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    initialEnrollments.map((enr) => (
                      <tr key={enr.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal">
                            {enr.studentName}
                          </p>
                          <p className="text-warmgray">{enr.studentEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-charcoal">
                          {enr.courseSlug}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-ivory px-2.5 py-1 font-mono font-semibold text-charcoal">
                            {enr.deviceCount}/{maxDevicesPerStudent}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                              enr.status === "active" || enr.status === "completed"
                                ? "bg-[#eef7f2] text-[#21543d]"
                                : "bg-primary-soft text-primary",
                            )}
                          >
                            {enr.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void postAdminAction({
                                  action: "reset_student_devices",
                                  userId: enr.userId,
                                }).then((r) => {
                                  if (r)
                                    setBanner({
                                      kind: "ok",
                                      text: "Registered devices reset for student.",
                                    });
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-full border border-parchment px-3 py-1 font-semibold text-charcoal hover:border-gold"
                            >
                              <RefreshCw className="h-3 w-3" /> Reset Devices
                            </button>
                            {enr.status === "active" ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  void postAdminAction({
                                    action: "set_enrollment_status",
                                    enrollmentId: enr.id,
                                    status: "cancelled",
                                  })
                                }
                                className="rounded-full bg-primary-soft px-3 py-1 font-bold text-primary hover:bg-primary hover:text-white"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  void postAdminAction({
                                    action: "set_enrollment_status",
                                    enrollmentId: enr.id,
                                    status: "active",
                                  })
                                }
                                className="rounded-full bg-[#eef7f2] px-3 py-1 font-bold text-[#21543d]"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* TAB 3: ANTI-PIRACY FORENSIC LOGS */}
      {activeTab === "security" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-parchment bg-white">
          <div className="border-b border-parchment px-5 py-4">
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Anti-Piracy &amp; Stream Tamper Alerts
            </h2>
            <p className="mt-0.5 text-xs text-warmgray">
              Automatically logs DevTools watermark tampering, direct stream URL scraping (IDM / yt-dlp / curl), capture hotkeys, and multi-device sharing attempts.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-parchment bg-ivory/70 uppercase tracking-wider text-warmgray">
                <tr>
                  <th className="px-4 py-3">Time (IST)</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Course / Lecture</th>
                  <th className="px-4 py-3">IP Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment">
                {initialSecurityEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-warmgray">
                      No piracy or tamper alerts recorded. All streams clean.
                    </td>
                  </tr>
                ) : (
                  initialSecurityEvents.map((ev) => (
                    <tr key={ev.id}>
                      <td className="px-4 py-3 font-mono text-warmgray">
                        {new Date(ev.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                            ev.severity === "critical"
                              ? "bg-primary text-white"
                              : "bg-gold-soft text-gold-deep",
                          )}
                        >
                          {ev.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-charcoal">
                        {ev.eventType}
                      </td>
                      <td className="px-4 py-3 text-charcoal">
                        {ev.studentEmail}
                      </td>
                      <td className="px-4 py-3 font-mono text-warmgray">
                        {ev.courseSlug}
                        {ev.lessonId ? ` / ${ev.lessonId}` : ""}
                      </td>
                      <td className="px-4 py-3 font-mono text-warmgray">
                        {ev.ipHash ? ev.ipHash.slice(0, 10) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
