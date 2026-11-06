// ============================================================
// COMPONENT — HeroBanner
// Editorial retail hero showcase + auto-sliding banner carousel
// Images fetched from Supabase storage bucket "banners"
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { ROUTES, BUSINESS_NAME } from "@/lib/constants";

interface Banner {
  name: string;
  url: string;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        const json = await res.json();
        if (json.data) setBanners(json.data);
      } catch {
        // silently fail — fallback editorial showcase is rendered
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  // Skeleton
  if (isLoading) {
    return (
      <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-2xl bg-white border border-[#e6e4df] p-2">
        <div className="w-full h-full rounded-xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  // Fallback Editorial Retail Showcase if no image banners exist
  if (banners.length === 0) {
    return (
      <section className="relative w-full overflow-hidden rounded-2xl bg-[#061b49] text-white border border-[#061b49]">
        {/* Subtle architectural grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 px-6 py-8 md:px-10 md:py-11 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-semibold tracking-wide uppercase text-sky-200 mb-3">
              <ShieldCheck size={13} />
              <span>{BUSINESS_NAME} · Direct Wholesale</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.12]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Everyday Pantry &amp; Household Essentials, Priced Honestly.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-md leading-relaxed">
              Curated groceries, staples, and FMCG supplies delivered directly
              across Kozhikode district at transparent wholesale rates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              href={ROUTES.products}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-[#061b49] hover:bg-slate-100 text-xs font-bold transition-all active:scale-[0.98]"
            >
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href={`${ROUTES.products}?featured=true`}
              className="inline-flex items-center h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-colors"
            >
              Weekly Picks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Promotional highlights"
      className="relative w-full overflow-hidden rounded-2xl bg-white border border-[#e6e4df] p-1.5 md:p-2 shadow-2xs group"
    >
      <div className="relative w-full h-[185px] sm:h-[230px] md:h-[280px] rounded-xl overflow-hidden bg-[#f4f3ef]">
        {/* Slides */}
        {banners.map((banner, i) => (
          <div
            key={banner.name}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <Image
              src={banner.url}
              alt={`Featured promotion ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1240px"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Subtle bottom-right editorial controls + slide counter */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="h-5 w-5 flex items-center justify-center rounded hover:bg-white/15 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[11px] font-semibold tabular-nums px-1 select-none">
              {current + 1} / {banners.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="h-5 w-5 flex items-center justify-center rounded hover:bg-white/15 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Minimal progress ticks */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1">
            {banners.map((b, i) => (
              <button
                key={b.name}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
