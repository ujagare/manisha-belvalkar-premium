import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroLoader from "@/components/layout/IntroLoader";
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
  metadataBase: new URL("https://www.manishabelvalkar.com"),
  title: {
    default: "Manisha Belvalkar — Tarot Reading & Spiritual Healing in Mumbai",
    template: "%s | Manisha Belvalkar",
  },
  description:
    "A holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Goddess Attunement, and Chakra Therapy. Guidance for the soul.",
  authors: [{ name: "Dr. Manisha Belvalkar", url: "/about" }],
  creator: "Dr. Manisha Belvalkar",
  publisher: "Manisha Belvalkar",
  category: "Spiritual wellbeing",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
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
    url: "https://www.manishabelvalkar.com",
    siteName: "Manisha Belvalkar",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/manisha-portrait.webp",
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
    images: ["/images/manisha-portrait.webp"],
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
  url: "https://www.manishabelvalkar.com",
  image: "https://www.manishabelvalkar.com/images/manisha-portrait.webp",
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
  url: "https://www.manishabelvalkar.com",
  image: "https://www.manishabelvalkar.com/images/manisha-portrait.webp",
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
  url: "https://www.manishabelvalkar.com",
  inLanguage: "en-IN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
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
        <IntroLoader />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WBZVC9Q4"
            height="0"
            width="0"
            className="hidden invisible"
            title="Google Tag Manager"
          />
        </noscript>
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
      <Script id="google-tag-manager" strategy="lazyOnload" nonce={nonce}>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WBZVC9Q4');
        `}
      </Script>
    </html>
  );
}
