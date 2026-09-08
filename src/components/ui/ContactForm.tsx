"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { brand } from "@/lib/data";

/** Premium contact form that opens WhatsApp with a pre-filled message. */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.open(`https://wa.me/919922246111?text=${body}`, "_blank");
  };

  const fieldClasses =
    "w-full rounded-2xl border border-parchment bg-white px-4 py-3.5 text-sm text-ink shadow-[inset_0_1px_2px_rgba(28,25,23,0.04)] placeholder:text-warmgray/50 transition-all duration-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Your name"
            className={fieldClasses}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            placeholder="+91 9XXXXXXXXX"
            className={fieldClasses}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          className={fieldClasses}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-warmgray"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          required
          placeholder="How can Manisha help you on your journey?"
          className={`${fieldClasses} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
      >
        <Heart className="h-4 w-4 text-gold-light transition-transform duration-300 group-hover:scale-110" />
        Send Message
      </button>
      <p className="text-center text-xs text-warmgray/70">
        Your message opens in {brand.name}&apos;s WhatsApp — the fastest way to
        connect.
      </p>
    </form>
  );
}
