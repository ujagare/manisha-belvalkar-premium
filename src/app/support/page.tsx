import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarClock, CircleUserRound, Mail, MessageCircle, PackageSearch, ShieldAlert } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { brand } from "@/lib/data";
import SupportTicketForm from "@/components/backend/SupportTicketForm";

export const metadata: Metadata = { title: "Customer Support", description: "Help with bookings, orders, delivery, account access, refunds, and grievances.", alternates: { canonical: "/support" } };

const topics = [
  { icon: CalendarClock, title: "Booking help", text: "Confirmation, timing, format, preparation, cancellation, or rescheduling.", href: "/how-it-works" },
  { icon: PackageSearch, title: "Order & delivery", text: "Order status, tracking, damaged parcel, wrong item, return, or refund.", href: "/shipping-delivery-policy" },
  { icon: CircleUserRound, title: "Account access", text: "Sign-in, password reset, order history, personal information, or deletion request.", href: "/account" },
  { icon: BookOpen, title: "Course access", text: "Course format, access delivery, workshop schedule, or material issue.", href: "/courses" },
];

export default function SupportPage() {
  return <>
    <PageHero eyebrow="Customer care" image="/images/page-heroes/contact-hero.webp" imageAlt="A calm desk ready to help with a customer question" title={<>Support that keeps your <span className="text-gold-shimmer">next step clear</span></>} subtitle="Find the right answer, check your request, or contact the team with the details needed to help quickly." />
    <section className="bg-ivory py-12 sm:py-20 lg:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">{topics.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group grid gap-4 sm:gap-5 rounded-2xl sm:rounded-[26px] border border-parchment bg-white p-5 sm:p-7 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_60px_-38px_rgba(221,184,41,0.65)] sm:grid-cols-[3.5rem_1fr]"><span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></span><div><h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal">{title}</h2><p className="mt-1.5 sm:mt-2 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">{text}</p></div></Link>)}</div>

      <div className="mt-8 sm:mt-16 grid gap-5 sm:gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl sm:rounded-[30px] bg-charcoal p-5 sm:p-8 lg:p-10 text-white"><p className="eyebrow text-gold-light">Contact support</p><h2 className="mt-3 sm:mt-4 font-display text-2xl font-bold sm:text-4xl">Include the reference. Get a clearer answer.</h2><p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-white/65">Share your registered name, order or booking reference, relevant date, a short explanation, and the resolution you need. Never send passwords, PINs, CVVs, or one-time passwords.</p><div className="mt-5 sm:mt-7 flex flex-wrap gap-3 sm:gap-4"><a href={brand.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-primary-deeper"><MessageCircle className="h-4 w-4" />WhatsApp support</a><a href={brand.emailHref} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:border-gold hover:text-gold"><Mail className="h-4 w-4" />Email support</a></div></div>
        <div className="rounded-2xl sm:rounded-[30px] border border-gold/25 bg-gold-soft p-5 sm:p-8 lg:p-10"><ShieldAlert className="h-6 w-6 sm:h-7 sm:w-7 text-primary" /><h2 className="mt-3.5 sm:mt-5 font-display text-2xl sm:text-3xl font-bold text-charcoal">Need to escalate?</h2><p className="mt-2.5 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">If a consumer or privacy concern remains unresolved, submit it through the grievance process. We aim to acknowledge a grievance within 48 hours.</p><Link href="/grievance-redressal" className="mt-4 sm:mt-6 inline-flex min-h-10 items-center font-semibold text-primary underline underline-offset-4">Grievance redressal</Link></div>
      </div>
      <SupportTicketForm />
    </div></section>
  </>;
}
