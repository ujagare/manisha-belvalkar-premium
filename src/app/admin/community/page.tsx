import Link from "next/link";
import { requireStaff } from "@/lib/supabase/staff";
import { createAdminClient } from "@/lib/supabase/admin";
import CommunityApplicationStatusForm from "@/components/admin/CommunityApplicationStatusForm";

export const metadata = {
  title: "Community Applications · Operations",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function CommunityApplicationsAdminPage() {
  await requireStaff(["owner", "admin", "booking_manager", "support"]);
  const admin = createAdminClient();
  const { data: applications } = await admin
    .from("community_applications")
    .select("id, name, email, phone, intention, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = applications ?? [];
  const summary = {
    pending: list.filter((item) => item.status === "pending").length,
    approved: list.filter((item) => item.status === "approved").length,
    waitlisted: list.filter((item) => item.status === "waitlisted").length,
  };

  return (
    <main className="min-h-[100dvh] bg-ivory px-4 pb-24 pt-20 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-deep">Private operations</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:mt-4 sm:text-5xl">
              Magic Community applications
            </h1>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-primary"
          >
            Back to operations
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:max-w-xl sm:gap-4">
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Pending</p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">{summary.pending}</p>
          </div>
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Approved</p>
            <p className="mt-1 font-display text-2xl font-bold text-charcoal">{summary.approved}</p>
          </div>
          <div className="rounded-2xl border border-parchment bg-white p-4">
            <p className="text-xs text-warmgray">Waitlisted</p>
            <p className="mt-1 font-display text-2xl font-bold text-charcoal">{summary.waitlisted}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
          {list.length ? (
            list.map((item) => {
              const reference = item.id.slice(0, 8);
              const createdLabel = new Date(item.created_at).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-parchment bg-white p-5 sm:rounded-3xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-warmgray">
                        Ref {reference} · {createdLabel} IST
                      </p>
                      <h2 className="mt-1.5 font-display text-xl font-semibold text-charcoal">
                        {item.name}
                      </h2>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-warmgray">
                        {item.email ? (
                          <a href={`mailto:${item.email}`} className="underline hover:text-primary">
                            {item.email}
                          </a>
                        ) : null}
                        {item.phone ? <span className="font-mono">{item.phone}</span> : null}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold capitalize text-primary">
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 rounded-xl bg-ivory/70 p-3.5 text-sm leading-6 text-charcoal">
                    {item.intention || "No intention note shared."}
                  </p>

                  <CommunityApplicationStatusForm
                    applicationId={item.id}
                    applicantName={item.name}
                    phone={item.phone}
                    reference={reference}
                    initialStatus={item.status}
                  />
                </article>
              );
            })
          ) : (
            <p className="text-warmgray">No Magic Community applications yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
