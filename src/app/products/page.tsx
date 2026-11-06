// ============================================================
// PAGE — /products
// Editorial product catalog with department filter, sort & grid
// ============================================================

import { Suspense } from "react";
import CategoryFilterBar from "@/components/product/CategoryFilterBar";
import ProductGrid from "@/components/product/ProductGrid";

export const metadata = {
  title: "Catalog — Groceries & Daily Essentials",
  description:
    "Browse all groceries, FMCG and daily essentials at wholesale prices in Kozhikode",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Editorial Header + Sticky Department & Sort Bar */}
      <Suspense
        fallback={
          <div className="bg-white border-b border-[#e6e4df]">
            <div className="container-app py-6">
              <div className="h-3 w-28 bg-slate-100 rounded mb-2 animate-pulse" />
              <div className="h-8 w-64 bg-slate-100 rounded mb-2 animate-pulse" />
              <div className="h-4 w-96 max-w-full bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-13 border-t border-[#f1f0ec] bg-white" />
          </div>
        }
      >
        <CategoryFilterBar />
      </Suspense>

      {/* Product catalog grid */}
      <main className="container-app pt-5 pb-24 md:pb-12">
        <Suspense fallback={null}>
          <ProductGrid />
        </Suspense>
      </main>
    </div>
  );
}
