import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CartProvider from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://manishabelvalkar.com"),
  title: {
    default: "Manisha Belvalkar — Spiritual Mentor | Guidance For the Soul",
    template: "%s | Manisha Belvalkar",
  },
  description:
    "A holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Goddess Attunement, and Chakra Therapy. Guidance for the soul.",
  keywords: [
    "Manisha Belvalkar",
    "Tarot Reading",
    "Spiritual Mentor",
    "Soul Purpose Reading",
    "Goddess Attunement",
    "Chakra Therapy",
    "Holistic Well-being",
    "Mumbai",
    "Pune",
  ],
  openGraph: {
    title: "Manisha Belvalkar — Spiritual Mentor",
    description:
      "Guidance For the Soul. Tarot, Healing, and Well-being sessions with 30+ years of experience. Mumbai & Pune.",
    url: "https://manishabelvalkar.com",
    siteName: "Manisha Belvalkar",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/manisha-portrait.jpg",
        width: 1200,
        height: 1800,
        alt: "Dr. Manisha Belvalkar — Spiritual Mentor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manisha Belvalkar — Spiritual Mentor",
    description:
      "Guidance For the Soul. Tarot, Healing, and Well-being sessions.",
    images: ["/images/manisha-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dr. Manisha Belvalkar",
  url: "https://manishabelvalkar.com",
  image: "https://manishabelvalkar.com/images/manisha-portrait.jpg",
  jobTitle: "Spiritual Mentor & Holistic Well-being Coach",
  description:
    "A holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Goddess Attunement, and Chakra Therapy.",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "501, New Pushpanjali, Prabhadevi",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400028",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  ],
  telephone: "+91-9922246111",
  email: "manishabelvalkar@gmail.com",
  knowsAbout: [
    "Tarot Consultation",
    "Soul Purpose Reading",
    "Goddess Attunement",
    "Chakra Therapy",
    "Holistic Well-being",
  ],
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Manisha Belvalkar — Guidance For the Soul",
  url: "https://manishabelvalkar.com",
  image: "https://manishabelvalkar.com/images/manisha-portrait.jpg",
  telephone: "+91-9922246111",
  email: "manishabelvalkar@gmail.com",
  priceRange: "₹899 - ₹25,000",
  areaServed: ["Mumbai", "Pune", "India"],
  founder: { "@type": "Person", name: "Dr. Manisha Belvalkar" },
  // sameAs: add real Instagram/Facebook/YouTube profile URLs here when available
};

const webSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Manisha Belvalkar",
  url: "https://manishabelvalkar.com",
  inLanguage: "en-IN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        playfair.variable,
        cormorant.variable,
        inter.variable,
        "antialiased",
      )}
    >
      <body className="grain min-h-screen flex flex-col" suppressHydrationWarning>
        <a href="#main-content" className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-charcoal px-4 py-3 font-semibold text-white focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-gold">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
        />
        <CartProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
