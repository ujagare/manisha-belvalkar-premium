import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
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
    "A holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Space Clearing, and Chakra Therapy. Guidance for the soul.",
  keywords: [
    "Manisha Belvalkar",
    "Tarot Reading",
    "Spiritual Mentor",
    "Soul Purpose Reading",
    "Space Clearing",
    "Chakra Therapy",
    "Holistic Well-being",
    "Mumbai",
  ],
  openGraph: {
    title: "Manisha Belvalkar — Spiritual Mentor",
    description:
      "Guidance For the Soul. Tarot, Healing, and Well-being sessions.",
    type: "website",
    locale: "en_IN",
  },
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
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <main id="top" className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}