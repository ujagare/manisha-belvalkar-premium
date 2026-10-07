import { redirect } from "next/navigation";

export const metadata = { title: "Payment received", robots: { index: false, follow: false } };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  redirect(order ? `/thank-you?order=${encodeURIComponent(order)}` : "/thank-you");
}
