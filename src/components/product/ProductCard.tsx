// ============================================================
// COMPONENT — ProductCard
// Editorial retail product card with stretched-link semantics
// Shows image, unit, title, tabular pricing, savings & cart stepper
// ============================================================

"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { ProductWithImages } from "@/types/database";

interface ProductCardProps {
  product: ProductWithImages;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItem, updateQuantity, isInCart } = useCart();

  const firstImage = product.product_images?.[0]?.url ?? null;
  const discount = getDiscountPercent(
    product.actual_price,
    product.selling_price
  );
  const savingsAmount = Math.max(0, product.actual_price - product.selling_price);
  const outOfStock = product.stock_quantity === 0;
  const lowStock =
    !outOfStock && product.stock_quantity <= product.low_stock_threshold;

  const cartItem = getItem(product.id);
  const cartQty = cartItem?.quantity ?? 0;
  const inCart = isInCart(product.id);
  const atMaxStock = cartQty >= product.stock_quantity;

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (outOfStock || atMaxStock) return;
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

  function handleDecrement(e: React.MouseEvent) {
    e.stopPropagation();
    if (cartQty <= 1) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, cartQty - 1);
    }
  }

  return (
    <article
      className={`editorial-card flex flex-col overflow-hidden group ${
        outOfStock ? "opacity-75" : ""
      }`}
    >
      {/* ── Media Region ─────────────────────────────────────── */}
      <div className="relative w-full aspect-square bg-[#f9f9f7] border-b border-[#f1f0ec] overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ease-out ${
              outOfStock ? "grayscale-[35%]" : "group-hover:scale-[1.03]"
            }`}
            sizes="(max-width: 768px) 48vw, (max-width: 1200px) 30vw, 260px"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-300">
            <Package size={26} strokeWidth={1.5} />
            <span className="text-[10px] font-medium tracking-wide uppercase text-slate-400">
              No image
            </span>
          </div>
        )}

        {/* Top-left editorial badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 pointer-events-none">
          {discount > 0 && !outOfStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight bg-emerald-700 text-white shadow-2xs">
              {discount}% OFF
            </span>
          )}
          {product.is_new_arrival && !outOfStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight bg-[#061b49] text-white">
              NEW
            </span>
          )}
        </div>

        {/* Low stock subtle pill */}
        {lowStock && (
          <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50/95 text-amber-800 border border-amber-200/80 backdrop-blur-xs pointer-events-none">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {product.stock_quantity} left
          </span>
        )}

        {/* Out of stock clean pill */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-900/85 text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Content Region ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 md:p-3.5 justify-between gap-2.5">
        <div>
          {/* Unit / Category metadata line */}
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <span className="text-[11px] font-medium text-slate-500 tracking-tight">
              {product.unit}
            </span>
            {savingsAmount > 0 && !outOfStock && (
              <span className="text-[10px] font-semibold text-emerald-700 tabular-nums">
                Save {formatPrice(savingsAmount)}
              </span>
            )}
          </div>

          {/* Product Title with stretched link */}
          <h3 className="text-[13px] md:text-sm font-semibold leading-snug text-[#061b49] line-clamp-2">
            <Link
              href={ROUTES.product(product.slug)}
              className="card-link hover:text-[#2a66f4] transition-colors"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        {/* ── Footer: Price + Independent Cart Control ───────── */}
        <footer className="pt-2 border-t border-[#f3f2ee] flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm md:text-base font-bold text-[#061b49] tabular-nums tracking-tight leading-none">
                {formatPrice(product.selling_price)}
              </span>
              {discount > 0 && (
                <span className="text-[11px] text-slate-400 line-through tabular-nums leading-none">
                  {formatPrice(product.actual_price)}
                </span>
              )}
            </div>
            {inCart && atMaxStock && (
              <span className="text-[10px] font-medium text-amber-700 mt-1 leading-none">
                Max {product.stock_quantity} in stock
              </span>
            )}
          </div>

          {/* Interactive Cart Stepper / Add Button */}
          {!outOfStock ? (
            inCart ? (
              <div
                className="inline-flex items-center h-8 rounded-lg bg-[#061b49] text-white shadow-2xs overflow-hidden flex-shrink-0"
                aria-label={`Quantity for ${product.name}`}
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label={`Decrease quantity of ${product.name}`}
                  className="h-8 w-7 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <Minus size={12} strokeWidth={2.2} />
                </button>
                <span className="min-w-[22px] px-1 text-center text-xs font-bold tabular-nums select-none">
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={atMaxStock}
                  aria-label={`Increase quantity of ${product.name}`}
                  className="h-8 w-7 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors disabled:opacity-35 disabled:pointer-events-none"
                >
                  <Plus size={12} strokeWidth={2.2} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${product.name} to cart`}
                className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold text-[#061b49] bg-[#f4f3ef] hover:bg-[#2a66f4] hover:text-white border border-[#e6e4df] hover:border-[#2a66f4] active:scale-[0.97] transition-all flex-shrink-0"
              >
                <Plus size={13} strokeWidth={2.2} />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="text-[11px] font-medium text-slate-400 py-1">
              Unavailable
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
