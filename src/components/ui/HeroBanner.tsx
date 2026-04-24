// ============================================================
// COMPONENT — HeroBanner
// Auto-sliding banner carousel
// Images fetched from Supabase storage bucket "banners"
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  name: string;
  url: string;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        const json = await res.json();
        if (json.data) setBanners(json.data);
      } catch {
        // silently fail — banner is non-critical
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, []);

  // Auto-slide every 4 seconds
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  // Skeleton
  if (isLoading) {
    return (
      <div
        className="w-full rounded-2xl animate-pulse"
        style={{
          height: "180px",
          backgroundColor: "#e8ecef",
        }}
      />
    );
  }

  // No banners uploaded yet
  if (banners.length === 0) {
    return (
      <div
        className="w-full rounded-2xl flex items-center justify-center"
        style={{
          height: "180px",
          background:
            "linear-gradient(135deg, var(--color-brand) 0%, #0d4a2a 100%)",
        }}
      >
        <div className="text-center text-white px-4">
          <p
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Best Deals in Kozhikode
          </p>
          <p className="text-sm opacity-80">
            Fresh groceries at wholesale prices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: "180px" }}
    >
      {/* Slides */}
      {banners.map((banner, i) => (
        <div
          key={banner.name}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={banner.url}
            alt={`Banner ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Navigation arrows — only if multiple banners */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all z-10"
          >
            <ChevronLeft size={16} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all z-10"
          >
            <ChevronRight size={16} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  i === current ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
