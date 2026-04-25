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
    <div>
      {/* Sticky category filter bar */}
      <Suspense
        fallback={<div className="h-12 bg-white border-b border-gray-100" />}
      >
        <CategoryFilterBar />
      </Suspense>

      {/* Product grid */}
      <div className="container-app pb-6">
        <Suspense fallback={null}>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
