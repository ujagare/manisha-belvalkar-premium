"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, LockKeyhole, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { brand } from "@/lib/data";
import { cn, formatINR } from "@/lib/utils";
import type { OrderItemType } from "@/lib/supabase/database.types";
import type { UserAddress } from "@/lib/supabase/models";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type AddressFields = {
  recipient_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
};

const EMPTY_ADDRESS: AddressFields = {
  recipient_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
};

async function loadRazorpayCheckout() {
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

export default function CheckoutForm({
  type,
  slug,
  itemTitle,
  price,
  priceLabel,
  userEmail,
  userName,
  addresses,
  manualMode,
  strictPayment = false,
}: {
  type: OrderItemType;
  slug: string;
  itemTitle: string;
  price: number | null;
  priceLabel: string;
  userEmail: string;
  userName: string | null;
  addresses: UserAddress[];
  manualMode: boolean;
  strictPayment?: boolean;
}) {
  const router = useRouter();
  const isPhysicalProduct = type === "product";
  const isCourse = type === "course";
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ id: string; manual: boolean } | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [acceptedCourseDisclaimer, setAcceptedCourseDisclaimer] = useState(false);
  const [guestName, setGuestName] = useState(userName ?? "");
  const [guestEmail, setGuestEmail] = useState(userEmail);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id ?? "new");
  const [address, setAddress] = useState<AddressFields>({ ...EMPTY_ADDRESS, recipient_name: userName ?? "" });
  const [courseDetails, setCourseDetails] = useState({
    phone: "",
    preferredLanguage: "English",
    preferredContact: "WhatsApp",
    experienceLevel: "Beginning my journey",
    learningGoal: "",
  });
  const [idempotencyKey] = useState(() => crypto.randomUUID().replaceAll("-", ""));
  const [isPending, startTransition] = useTransition();

  const selectedSavedAddress = addresses.find((entry) => entry.id === selectedAddress);
  const totalLabel = price ? formatINR(price * quantity) : priceLabel;
  const addressPayload = useMemo(() => {
    if (!isPhysicalProduct) return null;
    if (selectedSavedAddress) return { savedAddressId: selectedSavedAddress.id };
    return { ...address, line2: address.line2.trim() || null };
  }, [address, isPhysicalProduct, selectedSavedAddress]);

  function updateAddress(field: keyof AddressFields, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const activeName = userEmail ? userName?.trim() ?? "" : guestName.trim();
    const activeEmail = userEmail || guestEmail.trim();
    if (!activeName) nextErrors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(activeEmail)) nextErrors.email = "Enter a valid email address.";
    if (isCourse) {
      if (!/^[+0-9][0-9\s-]{7,18}$/.test(courseDetails.phone.trim())) nextErrors.coursePhone = "Enter a valid phone number.";
      if (courseDetails.learningGoal.trim().length < 20) nextErrors.learningGoal = "Please share at least a few sentences so we can guide you well.";
      if (!acceptedCourseDisclaimer) nextErrors.courseDisclaimer = "Please confirm the course acknowledgement.";
    }
    if (isPhysicalProduct && !selectedSavedAddress) {
      if (!address.recipient_name.trim()) nextErrors.recipient_name = "Recipient name is required.";
      if (!/^[+0-9][0-9\s-]{7,18}$/.test(address.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
      if (!address.line1.trim()) nextErrors.line1 = "Street address is required.";
      if (!address.city.trim()) nextErrors.city = "City is required.";
      if (!address.state.trim()) nextErrors.state = "State is required.";
      if (!/^[1-9][0-9]{5}$/.test(address.postal_code.trim())) nextErrors.postal_code = "Enter a valid 6-digit PIN code.";
    }
    if (!acceptedPolicies) nextErrors.policies = "Please accept the policies to continue.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleConfirm() {
    setError(null);
    if (!validate()) return;
    const activeName = userEmail ? userName?.trim() ?? "" : guestName.trim();
    const activeEmail = userEmail || guestEmail.trim();

    if (manualMode && strictPayment) {
      setError("Distance Healing requires a verified online payment before photograph submission.");
      return;
    }
    if (manualMode) {
      setCreated({ id: `MANUAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, manual: true });
      return;
    }

    startTransition(async () => {
      const requestBody = {
        type,
        slug,
        quantity,
        guestEmail: userEmail ? "" : activeEmail,
        guestName: userEmail ? "" : activeName,
        address: addressPayload,
        customerDetails: isCourse ? {
          phone: courseDetails.phone.trim(),
          preferredLanguage: courseDetails.preferredLanguage,
          preferredContact: courseDetails.preferredContact,
          experienceLevel: courseDetails.experienceLevel,
          learningGoal: courseDetails.learningGoal.trim(),
        } : null,
      };
      const paymentResponse = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(requestBody),
      });
      const paymentData = await paymentResponse.json().catch(() => null);

      if (paymentResponse.ok && paymentData?.razorpayOrderId) {
        const loaded = await loadRazorpayCheckout();
        if (!loaded || !window.Razorpay) {
          setError("Secure payment window could not load. Please check your connection and retry.");
          return;
        }
        new window.Razorpay({
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "Manisha Belvalkar",
          description: itemTitle,
          order_id: paymentData.razorpayOrderId,
          prefill: { name: activeName, email: activeEmail, contact: isCourse ? courseDetails.phone : selectedSavedAddress?.phone ?? address.phone },
          theme: { color: "#6b0b0b" },
          modal: { ondismiss: () => router.push(`/checkout/failure?order=${encodeURIComponent(paymentData.orderId)}&reason=cancelled`) },
          handler: async (response: Record<string, string>) => {
            const verify = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                internalOrderId: paymentData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verify.json().catch(() => null);
            router.push(verify.ok
              ? (isCourse && verifyData?.learningUrl
                ? verifyData.learningUrl
                : verifyData?.healingUrl
                  ? verifyData.healingUrl
                : `/thank-you?order=${encodeURIComponent(paymentData.orderId)}`)
              : `/checkout/failure?order=${encodeURIComponent(paymentData.orderId)}&reason=verification`);
          },
        }).open();
        return;
      }

      if (![409, 503].includes(paymentResponse.status)) {
        setError(paymentData?.error?.message ?? "Could not start checkout. Please try again.");
        return;
      }

      if (strictPayment) {
        setError(paymentData?.error?.message ?? "Verified online payment is required for Distance Healing.");
        return;
      }

      const fallbackResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const fallbackData = await fallbackResponse.json().catch(() => null);
      if (!fallbackResponse.ok || !fallbackData?.order?.id) {
        setError(fallbackData?.error?.message ?? fallbackData?.error ?? "Could not create the order. Please try again.");
        return;
      }
      setCreated({ ...fallbackData.order, manual: false });
    });
  }

  const deliverySummary = isPhysicalProduct
    ? selectedSavedAddress
      ? `${selectedSavedAddress.recipient_name}, ${selectedSavedAddress.line1}, ${selectedSavedAddress.city}, ${selectedSavedAddress.state} ${selectedSavedAddress.postal_code}, ${selectedSavedAddress.phone}`
      : `${address.recipient_name}, ${address.line1}${address.line2 ? `, ${address.line2}` : ""}, ${address.city}, ${address.state} ${address.postal_code}, ${address.phone}`
    : "";
  const whatsappUrl = created
    ? `https://wa.me/919922246111?text=${encodeURIComponent(`Namaste Manisha ji, I would like to confirm my ${isCourse ? "enrollment request" : "order"}:\n\nOrder ID: ${created.id}\nItem: ${itemTitle}\nTotal: ${totalLabel}\n\nName: ${userEmail ? userName : guestName}\nEmail: ${userEmail || guestEmail}${isCourse ? `\nPhone: ${courseDetails.phone}\nPreferred contact: ${courseDetails.preferredContact}` : ""}${deliverySummary ? `\nDelivery: ${deliverySummary}` : ""}\n\nPlease share the next steps.`)}`
    : brand.whatsappHref;

  if (created) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft text-gold-deep ring-1 ring-gold/30"><Check className="h-8 w-8" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-deep">{created.manual ? "Request prepared" : "Order received"}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-charcoal">Reference #{created.id}</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-warmgray">{created.manual ? "Continue on WhatsApp to send these details to the team. This request is not saved online until the team confirms it." : "Your details are saved. Continue on WhatsApp and our team will personally confirm payment and dispatch."}</p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark">Continue on WhatsApp</a>
      </div>
    );
  }

  const inputClass = "h-12 w-full rounded-xl border border-parchment bg-white px-4 text-sm text-charcoal outline-none transition placeholder:text-warmgray/45 focus:border-gold-dark focus:ring-4 focus:ring-gold/10";
  const field = (name: keyof AddressFields, label: string, options?: { wide?: boolean; optional?: boolean; autoComplete?: string; inputMode?: "text" | "tel" | "numeric" }) => (
    <div className={options?.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`checkout-${name}`} className="mb-2 block text-xs font-semibold text-charcoal">{label}{options?.optional ? <span className="ml-1 font-normal text-warmgray">(optional)</span> : null}</label>
      <input id={`checkout-${name}`} value={address[name]} onChange={(event) => updateAddress(name, event.target.value)} autoComplete={options?.autoComplete} inputMode={options?.inputMode} aria-invalid={Boolean(fieldErrors[name])} className={cn(inputClass, fieldErrors[name] && "border-primary focus:border-primary focus:ring-primary/10")} />
      {fieldErrors[name] ? <p className="mt-1.5 text-xs text-primary">{fieldErrors[name]}</p> : null}
    </div>
  );

  return (
    <div>
      {manualMode ? <div className="mb-5 rounded-xl bg-gold-soft/70 px-4 py-3 text-xs leading-5 text-gold-deep ring-1 ring-gold/30"><strong>Personal confirmation:</strong> Online payment is not active yet. Complete the details below, then send the prepared request on WhatsApp. The team will confirm availability, final amount, and payment instructions.</div> : null}
      <div className="flex items-center gap-3 border-b border-parchment pb-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
        <div><h2 className="text-sm font-semibold text-charcoal">Contact information</h2><p className="mt-0.5 text-xs text-warmgray">For order updates and delivery communication</p></div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="checkout-name" className="mb-2 block text-xs font-semibold text-charcoal">Full name</label>
          <input id="checkout-name" value={userEmail ? userName ?? "" : guestName} onChange={(event) => { setGuestName(event.target.value); setFieldErrors((current) => ({ ...current, name: "" })); }} readOnly={Boolean(userEmail)} autoComplete="name" className={cn(inputClass, userEmail && "bg-ivory/70", fieldErrors.name && "border-primary")} />
          {fieldErrors.name ? <p className="mt-1.5 text-xs text-primary">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="checkout-email" className="mb-2 block text-xs font-semibold text-charcoal">Email address</label>
          <input id="checkout-email" type="email" value={userEmail || guestEmail} onChange={(event) => { setGuestEmail(event.target.value); setFieldErrors((current) => ({ ...current, email: "" })); }} readOnly={Boolean(userEmail)} autoComplete="email" className={cn(inputClass, userEmail && "bg-ivory/70", fieldErrors.email && "border-primary")} />
          {fieldErrors.email ? <p className="mt-1.5 text-xs text-primary">{fieldErrors.email}</p> : null}
        </div>
      </div>

      {isCourse ? (
        <div className="mt-8">
          <div className="flex items-center gap-3 border-b border-parchment pb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
            <div><h2 className="text-sm font-semibold text-charcoal">Your learning preferences</h2><p className="mt-0.5 text-xs text-warmgray">Helps us prepare your personalized onboarding</p></div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="course-phone" className="mb-2 block text-xs font-semibold text-charcoal">Phone / WhatsApp number</label>
              <input id="course-phone" inputMode="tel" autoComplete="tel" value={courseDetails.phone} onChange={(event) => { setCourseDetails((current) => ({ ...current, phone: event.target.value })); setFieldErrors((current) => ({ ...current, coursePhone: "" })); }} placeholder="+91 98765 43210" className={cn(inputClass, fieldErrors.coursePhone && "border-primary")} />
              {fieldErrors.coursePhone ? <p className="mt-1.5 text-xs text-primary">{fieldErrors.coursePhone}</p> : null}
            </div>
            <div>
              <label htmlFor="course-contact" className="mb-2 block text-xs font-semibold text-charcoal">Preferred contact</label>
              <select id="course-contact" value={courseDetails.preferredContact} onChange={(event) => setCourseDetails((current) => ({ ...current, preferredContact: event.target.value }))} className={inputClass}><option>WhatsApp</option><option>Phone call</option><option>Email</option></select>
            </div>
            <div>
              <label htmlFor="course-language" className="mb-2 block text-xs font-semibold text-charcoal">Preferred language</label>
              <select id="course-language" value={courseDetails.preferredLanguage} onChange={(event) => setCourseDetails((current) => ({ ...current, preferredLanguage: event.target.value }))} className={inputClass}><option>English</option><option>Hindi</option><option>Marathi</option><option>Hindi + English</option></select>
            </div>
            <div>
              <label htmlFor="course-experience" className="mb-2 block text-xs font-semibold text-charcoal">Experience level</label>
              <select id="course-experience" value={courseDetails.experienceLevel} onChange={(event) => setCourseDetails((current) => ({ ...current, experienceLevel: event.target.value }))} className={inputClass}><option>Beginning my journey</option><option>Some prior experience</option><option>Regular practitioner</option><option>Professional practitioner</option></select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="course-goal" className="mb-2 block text-xs font-semibold text-charcoal">What would you like support with?</label>
              <textarea id="course-goal" rows={4} value={courseDetails.learningGoal} onChange={(event) => { setCourseDetails((current) => ({ ...current, learningGoal: event.target.value.slice(0, 1000) })); setFieldErrors((current) => ({ ...current, learningGoal: "" })); }} placeholder="Share your current goals, challenges, or what you hope to receive from this program…" className={cn("w-full resize-none rounded-xl border border-parchment bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-warmgray/45 focus:border-gold-dark focus:ring-4 focus:ring-gold/10", fieldErrors.learningGoal && "border-primary")} />
              <div className="mt-1.5 flex justify-between gap-3"><p className="text-xs text-primary">{fieldErrors.learningGoal}</p><span className="ml-auto text-[11px] tabular-nums text-warmgray">{courseDetails.learningGoal.length}/1000</span></div>
            </div>
          </div>
          <div className="mt-5 flex gap-3 rounded-xl bg-gold-soft/60 p-4 text-xs leading-5 text-gold-deep"><UserRound className="mt-0.5 h-4 w-4 shrink-0" /><p>Your responses remain private and are used only to assess fit and personalize your onboarding.</p></div>
        </div>
      ) : null}

      {isPhysicalProduct ? (
        <div className="mt-8">
          <div className="flex items-center gap-3 border-b border-parchment pb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
            <div><h2 className="text-sm font-semibold text-charcoal">Delivery address</h2><p className="mt-0.5 text-xs text-warmgray">Where should we send your order?</p></div>
          </div>

          {addresses.length ? (
            <div className="relative mt-5">
              <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-gold-deep" />
              <select value={selectedAddress} onChange={(event) => setSelectedAddress(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-parchment bg-white pl-11 pr-10 text-sm text-charcoal outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/10">
                {addresses.map((entry) => <option key={entry.id} value={entry.id}>{entry.label || "Saved address"} — {entry.line1}, {entry.city}</option>)}
                <option value="new">Use a new address</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-warmgray" />
            </div>
          ) : null}

          {!selectedSavedAddress ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field("recipient_name", "Recipient name", { autoComplete: "shipping name" })}
              {field("phone", "Phone number", { autoComplete: "shipping tel", inputMode: "tel" })}
              {field("line1", "House / flat, street", { wide: true, autoComplete: "shipping address-line1" })}
              {field("line2", "Landmark or area", { wide: true, optional: true, autoComplete: "shipping address-line2" })}
              {field("city", "City", { autoComplete: "shipping address-level2" })}
              {field("state", "State", { autoComplete: "shipping address-level1" })}
              {field("postal_code", "PIN code", { autoComplete: "shipping postal-code", inputMode: "numeric" })}
              <div><label className="mb-2 block text-xs font-semibold text-charcoal">Country</label><div className="flex h-12 items-center rounded-xl border border-parchment bg-ivory/70 px-4 text-sm text-charcoal">India</div></div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-ivory/70 p-4 text-sm leading-6 text-warmgray"><span className="font-semibold text-charcoal">{selectedSavedAddress.recipient_name}</span><br />{selectedSavedAddress.line1}{selectedSavedAddress.line2 ? `, ${selectedSavedAddress.line2}` : ""}<br />{selectedSavedAddress.city}, {selectedSavedAddress.state} {selectedSavedAddress.postal_code}<br />{selectedSavedAddress.phone}</div>
          )}
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl bg-ivory/70 p-5">
        <div className="flex items-center justify-between gap-4 text-sm"><span className="text-warmgray">{itemTitle}</span><span className="shrink-0 font-semibold text-charcoal">{priceLabel}</span></div>
        {isPhysicalProduct ? <div className="mt-4 flex items-center justify-between border-t border-parchment pt-4 text-sm"><label htmlFor="checkout-quantity" className="text-warmgray">Quantity</label><select id="checkout-quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="rounded-lg border border-parchment bg-white px-3 py-2 font-semibold outline-none focus:border-gold-dark">{[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}</select></div> : null}
        <div className="mt-4 flex items-end justify-between border-t border-parchment pt-4"><span className="text-sm font-semibold text-charcoal">Order total</span><span className="font-display text-2xl font-semibold tabular-nums text-primary">{totalLabel}</span></div>
        <p className="mt-2 text-right text-[11px] text-warmgray">{isCourse ? (price ? "Inclusive of all taxes · Access details shared after confirmation" : "Fee and schedule are confirmed personally after review") : "Inclusive of all taxes · Shipping confirmed before dispatch"}</p>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-warmgray">
        <input type="checkbox" checked={acceptedPolicies} onChange={(event) => { setAcceptedPolicies(event.target.checked); setFieldErrors((current) => ({ ...current, policies: "" })); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
        <span>I agree to the <Link className="font-semibold text-primary underline underline-offset-2" href="/terms-and-conditions" target="_blank">Terms</Link>, <Link className="font-semibold text-primary underline underline-offset-2" href="/refund-cancellation-policy" target="_blank">refund policy</Link>, and <Link className="font-semibold text-primary underline underline-offset-2" href="/privacy-policy" target="_blank">privacy policy</Link>.</span>
      </label>
      {fieldErrors.policies ? <p className="mt-2 text-xs text-primary">{fieldErrors.policies}</p> : null}
      {isCourse ? (
        <>
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-xs leading-5 text-warmgray">
            <input type="checkbox" checked={acceptedCourseDisclaimer} onChange={(event) => { setAcceptedCourseDisclaimer(event.target.checked); setFieldErrors((current) => ({ ...current, courseDisclaimer: "" })); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
            <span>I understand this is an educational and wellbeing program, not medical or psychological treatment. Enrollment and the personalized schedule are confirmed after a suitability conversation.</span>
          </label>
          {fieldErrors.courseDisclaimer ? <p className="mt-2 text-xs text-primary">{fieldErrors.courseDisclaimer}</p> : null}
        </>
      ) : null}
      {error ? <div role="alert" className="mt-5 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">{error}</div> : null}

      <button type="button" onClick={handleConfirm} disabled={isPending} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(107,11,11,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_18px_36px_-14px_rgba(107,11,11,0.85)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
        {isPending ? "Preparing your request…" : manualMode ? (isCourse ? "Prepare enrollment request" : "Prepare WhatsApp order") : price ? `Pay ${totalLabel} securely` : isCourse ? "Request enrollment" : "Confirm order"}
      </button>
      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-warmgray"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gold-deep" />{manualMode ? "No payment is taken on this website in personal-confirmation mode" : price ? "Payments are encrypted and processed by Razorpay" : "No payment is taken until your enrollment is confirmed"}</div>
    </div>
  );
}
