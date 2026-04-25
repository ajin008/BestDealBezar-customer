// ============================================================
// PAGE — /products
// Product listing with category filter + sort + load more
// ============================================================

import { Suspense } from "react";
import CategoryFilterBar from "@/components/product/CategoryFilterBar";
import ProductGrid from "@/components/product/ProductGrid";

export const metadata = {
  title: "Products",
  description:
    "Browse all groceries, FMCG and daily essentials at best prices in Kozhikode",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f7f5" }}>
      {/* Sticky filter bar — sticks below the main navbar */}
      <Suspense
        fallback={
          <div
            className="h-12 bg-white w-full"
            style={{ borderBottom: "1.5px solid #e8ecef" }}
          />
        }
      >
        <CategoryFilterBar />
      </Suspense>

      {/* Product grid */}
      <div className="container-app pb-8 pt-4">
        <Suspense fallback={null}>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
