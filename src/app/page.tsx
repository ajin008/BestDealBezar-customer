import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const BASE_URL = "https://www.bestdealbazar.com";

export const metadata: Metadata = {
  title: "BestDealBazar — Groceries & Essentials at Wholesale Prices in Kozhikode",
  description:
    "Shop groceries, FMCG, snacks, and daily essentials at wholesale prices. Free delivery above ₹500 across Kozhikode district. Order online from Adithya Trading Company.",
  keywords: [
    "grocery delivery Kozhikode",
    "wholesale groceries Kerala",
    "online grocery Kozhikode",
    "FMCG delivery Kozhikode",
    "daily essentials online",
    "best deals grocery Kozhikode",
    "Adithya Trading Company Kozhikode",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "BestDealBazar — Groceries at Wholesale Prices in Kozhikode",
    description:
      "Shop groceries, FMCG, and daily essentials at wholesale prices. Free delivery above ₹500 across Kozhikode district.",
    url: BASE_URL,
    type: "website",
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
      "Shop groceries and daily essentials at wholesale prices. Fast delivery in Kozhikode.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
