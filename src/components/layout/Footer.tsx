// ============================================================
// COMPONENT — Footer
// Editorial colophon & store directory footer
// ============================================================

import Link from "next/link";
import { APP_NAME, BUSINESS_NAME, BUSINESS_LOCATION } from "@/lib/constants";
import { MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

const storeLinks = [
  { label: "Storefront", href: "/" },
  { label: "Full Catalog", href: "/products" },
  { label: "Featured Picks", href: "/products?featured=true" },
  { label: "New Arrivals", href: "/products?new_arrival=true" },
];

const accountLinks = [
  { label: "Shopping Bag", href: "/cart" },
  { label: "Order History", href: "/orders" },
  { label: "Saved Addresses", href: "/addresses" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t border-[#e6e4df] pb-20 md:pb-0">
      <div className="container-app py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#f1f0ec]">
          {/* Col 1: Brand & Provenance */}
          <div className="md:col-span-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <h3
                  className="text-xl font-bold tracking-tight text-[#061b49]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  BestDeal<span className="text-[#2a66f4]">Bazar</span>
                </h3>
                <span className="text-[11px] font-medium text-slate-400">
                  by {BUSINESS_NAME}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                Direct wholesale and retail grocery distribution across{" "}
                {BUSINESS_LOCATION}. Supplying households with quality staples,
                FMCG, and daily provisions at honest prices.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-[#f7f7f5] border border-[#e6e4df] text-[#061b49]">
                <MapPin size={12} />
              </span>
              <span>Serving all pincodes within {BUSINESS_LOCATION}</span>
            </div>
          </div>

          {/* Col 2: Catalog Directory */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Directory
            </h4>
            <ul className="flex flex-col gap-2">
              {storeLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#061b49] transition-colors"
                  >
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Account */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Customer
            </h4>
            <ul className="flex flex-col gap-2">
              {accountLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#061b49] transition-colors"
                  >
                    <span>{label}</span>
                    <ArrowUpRight size={11} className="text-slate-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>
              © {currentYear} {APP_NAME} ({BUSINESS_NAME}). All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="hover:text-slate-700 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-700 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
