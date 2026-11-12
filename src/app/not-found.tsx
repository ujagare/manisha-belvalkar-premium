import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 sm:px-6 text-center">
      <span className="font-display text-6xl sm:text-9xl font-bold text-gold">404</span>
      <h1 className="mt-3 sm:mt-4 font-display text-2xl sm:text-4xl font-bold text-charcoal">
        Page not found
      </h1>
      <p className="mt-2.5 sm:mt-3 max-w-md text-sm sm:text-base text-warmgray">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 sm:mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
