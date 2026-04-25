"use client";

import { Suspense } from "react";
import HeroBanner from "@/components/ui/HeroBanner";
import CategoryScroll from "@/components/ui/CategoryScroll";
import DeliveryInfoBanner from "@/components/ui/DeliveryInfoBanner";
import FeaturedProducts from "@/components/ui/FeaturedProducts";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <div className="container-app py-4">
        <HeroBanner />
        <CategoryScroll />
        <DeliveryInfoBanner />
        <FeaturedProducts
          title="Featured Products"
          subtitle="Best picks for you"
          filters={{ featured: true, limit: 8 }}
          seeAllHref="/products?featured=true"
        />
        <FeaturedProducts
          title="New Arrivals"
          subtitle="Just landed in store"
          filters={{ new_arrival: true, limit: 8 }}
          seeAllHref="/products?new_arrival=true"
        />
        <FeaturedProducts
          title="All Products"
          subtitle="Browse everything"
          filters={{ limit: 8 }}
          seeAllHref="/products"
        />
      </div>
    </Suspense>
  );
}
