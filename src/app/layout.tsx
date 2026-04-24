// app/layout.tsx (updated)
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/layout/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import AuthModal from "@/components/layout/AuthModal";

export const metadata: Metadata = {
  title: {
    default: "BestDealBazar — Best Deals in Kozhikode",
    template: "%s | BestDealBazar",
  },
  description:
    "Shop groceries, FMCG, and daily essentials at wholesale prices. Fast delivery across Kozhikode district.",
  keywords: ["grocery", "FMCG", "Kozhikode", "online shopping", "best deals"],
  authors: [{ name: "BestDealBazar" }],
  creator: "BestDealBazar",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "BestDealBazar",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
