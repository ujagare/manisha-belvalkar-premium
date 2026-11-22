import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TrackOrderClient from "@/components/shipping/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order — Live Shiprocket Courier Tracking",
  description:
    "Track your Manisha Belvalkar sacred shop order live using your Shiprocket AWB tracking number or Order Reference.",
  alternates: { canonical: "/track-order" },
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ awb?: string; order?: string }>;
}) {
  const query = await searchParams;
  const initialAwb = query?.awb?.trim() ?? "";
  const initialOrderRef = query?.order?.trim() ?? "";

  return (
    <section className="min-h-[100dvh] bg-ivory pb-20 pt-20 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <Link
          href="/products"
          className="inline-flex h-9 items-center gap-2 text-xs text-warmgray transition-colors duration-150 hover:text-charcoal sm:h-10 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to shop
        </Link>

        <header className="mt-4 max-w-2xl sm:mt-6">
          <p className="text-xs text-warmgray sm:text-sm">Order tracking</p>
          <h1 className="mt-1.5 font-display text-[1.85rem] font-medium tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-5xl">
            Track your shipment
          </h1>
          <p className="mt-2.5 text-sm leading-6 text-warmgray sm:mt-4 sm:text-base sm:leading-7">
            Enter your Shiprocket AWB number or order reference to check live courier scans, transit hubs, and expected delivery date.
          </p>
        </header>

        <div className="mt-6 sm:mt-8">
          <TrackOrderClient initialAwb={initialAwb} initialOrderRef={initialOrderRef} />
        </div>
      </div>
    </section>
  );
}
