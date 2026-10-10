import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getMyAddresses } from "@/lib/supabase/session";
import { isPaymentsConfigured } from "@/lib/env";
import CartCheckoutForm from "@/components/cart/CartCheckoutForm";

export const metadata: Metadata = { title: "Secure Payment", robots: { index: false, follow: false } };

export default async function CartCheckoutPage() {
  const manualMode = !isPaymentsConfigured();
  const user = await getCurrentUser();
  if (!manualMode && !user) redirect("/login?next=%2Fcheckout%2Fcart");
  const addresses = user ? await getMyAddresses() : [];
  return <section className="bg-ivory px-6 pb-24 pt-32 lg:pt-40"><div className="mx-auto max-w-2xl">
    <p className="eyebrow text-gold-dark">{manualMode ? "Personal confirmation" : "Secure checkout"}</p>
    <h1 className="mt-4 font-display text-5xl font-bold text-charcoal">{manualMode ? "Order request" : "Payment"}</h1>
    <p className="mt-4 mb-9 leading-7 text-warmgray">{manualMode ? "Add your delivery details, then send the prepared order to our team on WhatsApp. No online payment is taken." : "Review your order and continue through Razorpay's encrypted payment window."}</p>
    <CartCheckoutForm userEmail={user?.email ?? ""} userName={user?.fullName ?? null} addresses={addresses} manualMode={manualMode} />
  </div></section>;
}
