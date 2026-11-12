import Link from "next/link";
import { CircleAlert } from "lucide-react";

export const metadata = { title: "Payment not completed", robots: { index: false, follow: false } };

export default function CheckoutFailurePage() {
  return <section className="bg-ivory px-4 sm:px-6 pb-24 pt-24 sm:pt-36"><div className="mx-auto max-w-xl rounded-2xl sm:rounded-[28px] border border-parchment bg-white p-6 sm:p-9 text-center shadow-xl">
    <CircleAlert className="mx-auto h-12 w-12 sm:h-14 sm:w-14 text-primary" />
    <h1 className="mt-4 sm:mt-5 font-display text-2xl sm:text-4xl font-bold text-charcoal">Payment not completed</h1>
    <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">No booking is confirmed from this screen. Check My Account before retrying so you do not create a duplicate request.</p>
    <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3"><Link href="/account" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-semibold text-white">Check account</Link><Link href="/support" className="inline-flex min-h-11 items-center rounded-full border border-parchment px-6 py-3 text-sm sm:text-base font-semibold text-charcoal">Get support</Link></div>
  </div></section>;
}
