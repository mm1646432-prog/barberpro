import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


/* ─────────────────────────────────────────────────────────────────────────────
   Fonts — loaded via next/font, zero layout shift, auto-hosted on Vercel CDN
───────────────────────────────────────────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

/* ─────────────────────────────────────────────────────────────────────────────
   Metadata
───────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BarberPro — Premium Barber Shop",
    template: "%s | BarberPro",
  },
  description:
    "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
  keywords: ["barber", "barbershop", "haircut", "booking", "appointment", "grooming"],
  authors: [{ name: "BarberPro" }],
  creator: "BarberPro",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BarberPro",
    title: "BarberPro — Premium Barber Shop",
    description:
      "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BarberPro — Premium Barber Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BarberPro — Premium Barber Shop",
    description:
      "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Root Layout
───────────────────────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, playfairDisplay.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="bg-bg text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}