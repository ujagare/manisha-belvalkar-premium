"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, MapPin, MessageCircle } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/utils";
import type { UserAddress } from "@/lib/supabase/models";
import { cartWhatsAppMessage, manualReference, whatsappUrl } from "@/lib/manual-flow";
import { cartState } from "@/lib/cart";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } } }

async function loadRazorpay() {
  if (window.Razorpay) return true;
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

const NEW_ADDRESS = "new";

export default function CartCheckoutForm({ userEmail, userName, addresses, manualMode }: { userEmail: string; userName: string | null; addresses: UserAddress[]; manualMode: boolean }) {
  const router = useRouter();
  const { items, ready, subtotal, clearCart } = useCart();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState(userName ?? "");
  const [guestEmail, setGuestEmail] = useState(userEmail);
  const [idempotencyKey] = useState(() => crypto.randomUUID().replaceAll("-", ""));
  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState<string>(addresses.length ? addresses[0].id : NEW_ADDRESS);
  const [showNew, setShowNew] = useState(false);
  const [newAddress, setNewAddress] = useState<{
    recipient_name: string; phone: string; line1: string; line2: string; city: string; state: string; postal_code: string;
  }>({ recipient_name: "", phone: "", line1: "", line2: "", city: "", state: "", postal_code: "" });
  const [pending, startTransition] = useTransition();

  const addressPayload = useMemo(() => {
    if (selectedAddress && selectedAddress !== NEW_ADDRESS && addresses.some((a) => a.id === selectedAddress)) {
      return { savedAddressId: selectedAddress };
    }
    if (showNew || selectedAddress === NEW_ADDRESS) {
      return {
        recipient_name: newAddress.recipient_name.trim(),
        phone: newAddress.phone.trim(),
        line1: newAddress.line1.trim(),
        line2: newAddress.line2.trim() || null,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        postal_code: newAddress.postal_code.trim(),
      };
    }
    return null;
  }, [selectedAddress, showNew, addresses, newAddress]);

  const selectedSavedAddress = addresses.find((address) => address.id === selectedAddress);

  function manualAddress() {
    if (selectedSavedAddress) return `${selectedSavedAddress.recipient_name}, ${selectedSavedAddress.line1}${selectedSavedAddress.line2 ? `, ${selectedSavedAddress.line2}` : ""}, ${selectedSavedAddress.city}, ${selectedSavedAddress.state} ${selectedSavedAddress.postal_code}, Phone: ${selectedSavedAddress.phone}`;
    return `${newAddress.recipient_name}, ${newAddress.line1}${newAddress.line2 ? `, ${newAddress.line2}` : ""}, ${newAddress.city}, ${newAddress.state} ${newAddress.postal_code}, Phone: ${newAddress.phone}`;
  }

  function pay() {
    setError(null);
    if (manualMode) {
      if (!guestName.trim() || !guestEmail.trim() || !/^\S+@\S+\.\S+$/.test(guestEmail.trim())) {
        setError("Enter your name and a valid email address.");
        return;
      }
      if (!selectedSavedAddress && (!newAddress.recipient_name.trim() || !newAddress.phone.trim() || !newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !/^[1-9][0-9]{5}$/.test(newAddress.postal_code.trim()))) {
        setError("Enter a complete delivery address and valid 6-digit PIN code.");
        return;
      }
      const reference = manualReference("ORDER");
      window.open(whatsappUrl(cartWhatsAppMessage({ reference, items, subtotalLabel: formatINR(subtotal), name: guestName.trim(), email: guestEmail.trim(), address: manualAddress() })), "_blank", "noopener,noreferrer");
      setError(`Order ${reference} is prepared but not saved online. Please send the WhatsApp message to confirm it.`);
      return;
    }
    startTransition(async () => {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          items: items.map(({ slug, quantity }) => ({ slug, quantity })),
          address: addressPayload,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.razorpayOrderId) {
        setError(data?.error?.message ?? "Could not start secure payment. Please try again.");
        return;
      }
      if (!(await loadRazorpay()) || !window.Razorpay) {
        setError("Secure payment window could not load. Please check your connection.");
        return;
      }
      new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Manisha Belvalkar",
        description: `${items.length} cart item${items.length === 1 ? "" : "s"}`,
        order_id: data.razorpayOrderId,
        prefill: { name: userName ?? "", email: userEmail },
        theme: { color: "#6b0b0b" },
        modal: { ondismiss: () => router.push(`/checkout/failure?order=${encodeURIComponent(data.orderId)}&reason=cancelled`) },
        handler: async (payment: Record<string, string>) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              internalOrderId: data.orderId,
              razorpayOrderId: payment.razorpay_order_id,
              paymentId: payment.razorpay_payment_id,
              signature: payment.razorpay_signature,
            }),
          });
          if (verify.ok) {
            clearCart();
            router.push(`/thank-you?order=${encodeURIComponent(data.orderId)}`);
          } else router.push(`/checkout/failure?order=${encodeURIComponent(data.orderId)}&reason=verification`);
        },
      }).open();
    });
  }

  if (!ready) return <div className="h-52 animate-pulse rounded-3xl bg-parchment/60" />;
  if (cartState(items) === "empty") return <div className="rounded-3xl border border-parchment bg-white p-8 text-center"><p className="text-warmgray">Your cart is empty.</p><Link href="/products" className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white">Return to shop</Link></div>;

  return <div className="rounded-[28px] border border-parchment bg-white p-7 shadow-xl sm:p-9">
    {manualMode ? <div className="mb-5 rounded-xl bg-gold-soft/70 px-4 py-3 text-xs leading-5 text-gold-deep ring-1 ring-gold/30"><strong>Personal confirmation:</strong> This order will be prepared for WhatsApp. The team will confirm availability, shipping, final amount, and payment instructions.</div> : null}
    {userEmail ? <div className="flex items-center justify-between border-b border-parchment pb-5"><span className="text-warmgray">Signed in as</span><span className="max-w-[60%] truncate font-semibold">{userEmail}</span></div> : (
      <div className="grid gap-3 border-b border-parchment pb-5 sm:grid-cols-2"><div><label htmlFor="cart-name" className="mb-1 block text-xs font-medium text-charcoal">Full name</label><input id="cart-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} autoComplete="name" className="w-full rounded-lg border border-parchment bg-ivory/50 px-3 py-2 text-sm outline-none focus:border-gold" /></div><div><label htmlFor="cart-email" className="mb-1 block text-xs font-medium text-charcoal">Email</label><input id="cart-email" type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} autoComplete="email" className="w-full rounded-lg border border-parchment bg-ivory/50 px-3 py-2 text-sm outline-none focus:border-gold" /></div></div>
    )}
    <div className="mt-5 space-y-3">{items.map((item) => <div key={item.slug} className="flex justify-between gap-4 text-sm"><span>{item.title} × {item.quantity}</span><span className="font-semibold">{formatINR(item.price * item.quantity)}</span></div>)}</div>
    <div className="mt-6 flex justify-between border-t border-parchment pt-5 text-lg"><span>Total</span><span className="font-display text-2xl font-bold text-primary">{formatINR(subtotal)}</span></div>

    {/* Delivery address */}
    <div className="mt-6 rounded-2xl bg-ivory p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-charcoal"><MapPin className="h-4 w-4 text-gold-dark" />Delivery address</p>

      {addresses.length ? (
        <div className="mt-4 space-y-2">
          {addresses.map((a) => (
            <label key={a.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-parchment bg-white p-3.5 text-sm transition has-[:checked]:border-gold has-[:checked]:bg-gold-soft/40">
              <input type="radio" name="address" checked={selectedAddress === a.id} onChange={() => { setSelectedAddress(a.id); setShowNew(false); }} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />
              <span className="min-w-0">
                <span className="block font-semibold text-charcoal">{a.recipient_name}{a.label && a.label !== "Home" ? ` · ${a.label}` : ""}{a.is_default ? " · default" : ""}</span>
                <span className="block text-warmgray">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.postal_code}</span>
                <span className="block text-warmgray/70">{a.phone}</span>
              </span>
            </label>
          ))}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-parchment bg-white p-3.5 text-sm transition has-[:checked]:border-gold has-[:checked]:bg-gold-soft/40">
            <input type="radio" name="address" checked={selectedAddress === NEW_ADDRESS} onChange={() => { setSelectedAddress(NEW_ADDRESS); setShowNew(true); }} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />
            <span className="font-semibold text-primary">+ Use a new address</span>
          </label>
          {(selectedAddress === NEW_ADDRESS || showNew) ? (
            <div className="mt-3 grid gap-3 rounded-xl border border-parchment bg-white p-4 sm:grid-cols-2">
              {([
                ["recipient_name", "Full name"],
                ["phone", "Phone"],
                ["line1", "Address line 1"],
                ["line2", "Address line 2 (optional)"],
                ["city", "City"],
                ["state", "State"],
                ["postal_code", "PIN code"],
              ] as const).map(([name, label]) => (
                <div key={name} className={name === "line1" || name === "line2" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`na-${name}`} className="mb-1 block text-xs font-medium text-charcoal">{label}</label>
                  <input id={`na-${name}`} type="text" value={newAddress[name]} onChange={(e) => setNewAddress((p) => ({ ...p, [name]: e.target.value }))} className="w-full rounded-lg border border-parchment bg-ivory/50 px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 rounded-xl border border-parchment bg-white p-4 sm:grid-cols-2">
          {([
            ["recipient_name", "Full name"],
            ["phone", "Phone"],
            ["line1", "Address line 1"],
            ["line2", "Address line 2 (optional)"],
            ["city", "City"],
            ["state", "State"],
            ["postal_code", "PIN code"],
          ] as const).map(([name, label]) => (
            <div key={name} className={name === "line1" || name === "line2" ? "sm:col-span-2" : ""}>
              <label htmlFor={`na-${name}`} className="mb-1 block text-xs font-medium text-charcoal">{label}</label>
              <input id={`na-${name}`} type="text" value={newAddress[name]} onChange={(e) => setNewAddress((p) => ({ ...p, [name]: e.target.value }))} className="w-full rounded-lg border border-parchment bg-ivory/50 px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] leading-5 text-warmgray/70">Used to ship physical orders (decks, books, rituals).{userEmail ? <> You can save addresses in <Link href="/account/addresses" className="font-semibold text-primary underline">My Account</Link>.</> : null}</p>
    </div>

    <label className="mt-6 flex items-start gap-3 rounded-2xl bg-ivory p-4 text-xs leading-5 text-warmgray"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" /><span>I agree to the <Link href="/terms-and-conditions" target="_blank" className="font-semibold text-primary underline">Terms</Link>, <Link href="/refund-cancellation-policy" target="_blank" className="font-semibold text-primary underline">refund policy</Link> and <Link href="/privacy-policy" target="_blank" className="font-semibold text-primary underline">privacy policy</Link>.</span></label>
    {error ? <p className="mt-5 rounded-xl bg-primary-soft p-4 text-sm text-primary" role="alert">{error}</p> : null}
    {manualMode ? <button type="button" onClick={pay} disabled={!accepted} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><MessageCircle className="h-4 w-4" />Prepare WhatsApp order</button> : (
    <button type="button" onClick={pay} disabled={!accepted || pending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{pending ? "Opening secure payment…" : "Pay securely"}</button>
    )}
    <p className="mt-4 text-center text-xs text-warmgray">{manualMode ? "No payment is taken on this website. Your request is confirmed personally on WhatsApp." : "Final prices are verified securely on the server."}</p>
  </div>;
}
