import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser, getMyAddresses } from "@/lib/supabase/session";
import AddressBook from "@/components/account/AddressBook";

export const metadata: Metadata = {
  title: "Saved addresses",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/addresses");

  const addresses = await getMyAddresses();

  return (
    <section className="relative overflow-hidden bg-ivory pb-24 pt-32 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-warmgray hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to My Account
        </Link>
        <div className="mt-6 border-b border-parchment pb-6">
          <p className="eyebrow text-gold-dark">Address book</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">Saved addresses</h1>
          <p className="mt-3 text-warmgray">Manage the delivery and contact addresses used for your shop orders.</p>
        </div>
        <AddressBook addresses={addresses} />
      </div>
    </section>
  );
}
