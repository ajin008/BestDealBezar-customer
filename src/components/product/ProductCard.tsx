// ============================================================
// COMPONENT — ProductCard
// Reusable card for product listing
// Shows image, name, price, discount, add to cart
// ============================================================

"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { ProductWithImages } from "@/types/database";

interface ProductCardProps {
  product: ProductWithImages;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();

  const firstImage = product.product_images?.[0]?.url ?? null;
  const discount = getDiscountPercent(
    product.actual_price,
    product.selling_price
  );
  const inCart = isInCart(product.id);
  const outOfStock = product.stock_quantity === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image_url: firstImage,
      unit: product.unit,
      selling_price: product.selling_price,
      stock_quantity: product.stock_quantity,
    });
  }

  return (
    <Link
      href={ROUTES.product(product.slug)}
      className="flex flex-col bg-white rounded-2xl overflow-hidden group transition-all duration-200 hover:shadow-md"
      style={{ border: "1.5px solid #e8ecef" }}
    >
      {/* Image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1 / 1", backgroundColor: "#f8fafc" }}
      >
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 45vw, 200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart size={28} className="text-gray-200" />
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span
            className="absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded-lg text-white"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            {discount}% OFF
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2.5 flex-1">
        {/* Unit */}
        <span className="text-[10px] text-gray-400 font-medium">
          {product.unit}
        </span>

        {/* Name */}
        <p
          className="text-xs font-semibold leading-tight line-clamp-2 flex-1"
          style={{ color: "var(--color-navy)" }}
        >
          {product.name}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between gap-1 mt-1">
          <div className="flex flex-col">
            <span
              className="text-sm font-black"
              style={{ color: "var(--color-navy)" }}
            >
              {formatPrice(product.selling_price)}
            </span>
            {discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through leading-none">
                {formatPrice(product.actual_price)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="h-7 w-7 flex items-center justify-center rounded-xl transition-all active:scale-90 disabled:opacity-40 shrink-0"
            style={{
              backgroundColor: inCart
                ? "var(--color-brand)"
                : "var(--color-brand-50)",
              color: inCart ? "#fff" : "var(--color-brand)",
              border: "1.5px solid var(--color-brand-200)",
            }}
          >
            {inCart ? <ShoppingCart size={13} /> : <Plus size={13} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
