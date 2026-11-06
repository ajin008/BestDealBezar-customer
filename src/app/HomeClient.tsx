"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag, Building2 } from "lucide-react";
import HeroBanner from "@/components/ui/HeroBanner";
import CategoryScroll from "@/components/ui/CategoryScroll";
import DeliveryInfoBanner from "@/components/ui/DeliveryInfoBanner";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import { ROUTES, BUSINESS_NAME, BUSINESS_LOCATION } from "@/lib/constants";

export default function HomeClient() {
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-[#f7f7f5] pb-24 md:pb-12">
        {/* ── Top Storefront Masthead Strip (Desktop only) ───── */}
        <div className="hidden md:block bg-white border-b border-[#e6e4df]">
          <div className="container-app py-2 flex items-center justify-between gap-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 size={12} className="text-[#061b49] flex-shrink-0" />
              <span className="font-semibold text-[#061b49]">
                {BUSINESS_NAME}
              </span>
              <span className="text-slate-300">·</span>
              <span>
                Wholesale &amp; Retail Provision Store, {BUSINESS_LOCATION}
              </span>
            </div>

            <Link
              href={ROUTES.products}
              className="inline-flex items-center gap-1 font-semibold text-[#2a66f4] hover:underline flex-shrink-0"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        <div className="container-app pt-3 md:pt-6">
          {/* ── Hero Showcase + Service Guarantees ───────────── */}
          <HeroBanner />
          <DeliveryInfoBanner />

          {/* ── Department Index (4-col app grid on mobile) ──── */}
          <CategoryScroll />

          {/* ── Shelf 1: Curated / Featured Selection ────────── */}
          <FeaturedProducts
            eyebrow="Curated Selection"
            title="Featured Essentials"
            subtitle="Most-ordered staples & favourites"
            filters={{ featured: true, limit: 8 }}
            seeAllHref="/products?featured=true"
            layout="carousel"
          />

          {/* ── Editorial Wholesale Callout Strip ────────────── */}
          <section className="mt-7 md:mt-10 rounded-2xl bg-white border border-[#e6e4df] p-4 md:p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-[#f4f3ef] border border-[#e6e4df] flex items-center justify-center flex-shrink-0 text-[#061b49]">
                <Tag size={16} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs md:text-base font-bold text-[#061b49] truncate">
                    Direct Wholesale Pricing
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex-shrink-0">
                    <Sparkles size={9} /> Wholesale
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-500 mt-0.5 line-clamp-1 md:line-clamp-none">
                  Transparent rates by {BUSINESS_NAME}. Pay online or COD.
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.products}
              className="inline-flex items-center justify-center gap-1 h-8 md:h-9 px-3 md:px-4 rounded-lg md:rounded-xl text-[11px] md:text-xs font-semibold text-white bg-[#061b49] hover:bg-[#2a66f4] transition-colors flex-shrink-0"
            >
              <span>Browse</span>
              <ArrowRight size={12} />
            </Link>
          </section>

          {/* ── Shelf 2: Fresh In Store ──────────────────────── */}
          <FeaturedProducts
            eyebrow="Recently Restocked"
            title="New Arrivals"
            subtitle="Fresh stock & newly added provisions"
            filters={{ new_arrival: true, limit: 8 }}
            seeAllHref="/products?new_arrival=true"
            layout="carousel"
          />

          {/* ── Shelf 3: Everyday Catalog Grid ───────────────── */}
          <FeaturedProducts
            eyebrow="Complete Provision Index"
            title="Everyday Groceries"
            subtitle="Browse our core catalog"
            filters={{ limit: 8 }}
            seeAllHref="/products"
            layout="grid"
          />

          {/* ── Bottom Catalog CTA ───────────────────────────── */}
          <div className="mt-7 md:mt-8 flex justify-center">
            <Link
              href={ROUTES.products}
              className="inline-flex items-center gap-2 h-10 md:h-11 px-6 md:px-7 rounded-xl text-xs font-bold text-[#061b49] bg-white hover:bg-[#061b49] hover:text-white border border-[#d6d3cd] hover:border-[#061b49] shadow-2xs transition-all"
            >
              <span>View Complete Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
