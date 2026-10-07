import Link from "next/link";
import { CircleAlert } from "lucide-react";

export const metadata = { title: "Payment not completed", robots: { index: false, follow: false } };

export default function CheckoutFailurePage() {
  return <section className="bg-ivory px-6 pb-24 pt-36"><div className="mx-auto max-w-xl rounded-[28px] border border-parchment bg-white p-9 text-center shadow-xl">
    <CircleAlert className="mx-auto h-14 w-14 text-primary" />
    <h1 className="mt-5 font-display text-4xl font-bold text-charcoal">Payment not completed</h1>
    <p className="mt-4 leading-7 text-warmgray">No booking is confirmed from this screen. Check My Account before retrying so you do not create a duplicate request.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/account" className="rounded-full bg-primary px-6 py-3 font-semibold text-white">Check account</Link><Link href="/support" className="rounded-full border border-parchment px-6 py-3 font-semibold text-charcoal">Get support</Link></div>
  </div></section>;
}
