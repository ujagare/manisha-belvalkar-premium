import type { Metadata } from "next";
import { requireUser, getMyAddresses } from "@/lib/supabase/session";
import CartCheckoutForm from "@/components/cart/CartCheckoutForm";

export const metadata: Metadata = { title: "Secure Payment", robots: { index: false, follow: false } };

export default async function CartCheckoutPage() {
  const user = await requireUser("/checkout/cart");
  const addresses = await getMyAddresses();
  return <section className="bg-ivory px-6 pb-24 pt-32 lg:pt-40"><div className="mx-auto max-w-2xl">
    <p className="eyebrow text-gold-dark">Secure checkout</p>
    <h1 className="mt-4 font-display text-5xl font-bold text-charcoal">Payment</h1>
    <p className="mt-4 mb-9 leading-7 text-warmgray">Review your order and continue through Razorpay&apos;s encrypted payment window.</p>
    <CartCheckoutForm userEmail={user.email ?? ""} userName={user.fullName} addresses={addresses} />
  </div></section>;
}
