// ============================================================
// COMPONENT — Footer
// ============================================================

import Link from "next/link";
import { APP_NAME, BUSINESS_NAME, BUSINESS_LOCATION } from "@/lib/constants";
import { MapPin, ShoppingBag, Package, Home, Heart } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Cart", href: "/cart", icon: Package },
  { label: "Orders", href: "/orders", icon: Heart },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto bg-white pb-20 md:pb-0"
      style={{ borderTop: "1px solid #e8ecef" }}
    >
      <div className="container-app py-8">
        <div className="flex flex-col gap-6">
          {/* Top — Brand + Links */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Brand */}
            <div className="flex flex-col gap-2">
              <h3
                className="text-lg font-black tracking-tight"
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "var(--color-navy)",
                }}
              >
                {APP_NAME}
              </h3>
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-navy)" }}
              >
                <MapPin size={13} />
                <span>
                  by {BUSINESS_NAME}, {BUSINESS_LOCATION}
                </span>
              </div>
              <p className="text-xs max-w-xs" style={{ color: "#888" }}>
                Your trusted partner for quality groceries and daily essentials
                at wholesale prices.
              </p>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {footerLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: "#555" }}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#e8ecef" }} />

          {/* Bottom — Copyright + Info */}
          <div
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs"
            style={{ color: "#888" }}
          >
            <p>
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-brand)" }}
                />
                Delivery within Kozhikode district only
              </span>
              <Link
                href="/terms"
                className="hover:underline underline-offset-2 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
