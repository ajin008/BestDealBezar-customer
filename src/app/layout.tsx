import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/layout/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import AuthModal from "@/components/layout/AuthModal";

const BASE_URL = "https://www.bestdealbazar.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BestDealBazar — Groceries & Essentials at Wholesale Prices",
    template: "%s | BestDealBazar",
  },
  description:
    "Shop groceries, FMCG, and daily essentials at wholesale prices. Fast delivery across Kozhikode district by Adithya Trading.",
  keywords: [
    "grocery delivery Kozhikode",
    "FMCG wholesale Kozhikode",
    "online grocery Kerala",
    "best deals grocery",
    "daily essentials delivery",
    "Adithya Trading",
    "BestDealBazar",
  ],
  authors: [{ name: "BestDealBazar", url: BASE_URL }],
  creator: "BestDealBazar",
  publisher: "Adithya Trading",
  category: "Shopping",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "BestDealBazar",
    title: "BestDealBazar — Groceries & Essentials at Wholesale Prices",
    description:
      "Shop groceries, FMCG, and daily essentials at wholesale prices. Fast delivery across Kozhikode district.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BestDealBazar — Groceries at Wholesale Prices in Kozhikode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestDealBazar — Groceries at Wholesale Prices",
    description:
      "Shop groceries and daily essentials at wholesale prices in Kozhikode.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "BestDealBazar",
  alternateName: "Adithya Trading",
  url: BASE_URL,
  description:
    "Shop groceries, FMCG, and daily essentials at wholesale prices with fast delivery across Kozhikode district.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kozhikode",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Kozhikode District",
  },
  priceRange: "₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, UPI",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "22:00",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className="min-h-dvh flex flex-col"
        style={{ backgroundColor: "#f7f7f5" }}
      >
        <AuthProvider>
          <AnnouncementBar
            dismissible={true}
            message="⚡ Weekend Deal: Up to 20% OFF on FMCG essentials | Ends tonight!"
            href="/deals/weekend-sale"
          />
          <Navbar />
          <main className="flex-1 w-full pb-24 md:pb-0">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
