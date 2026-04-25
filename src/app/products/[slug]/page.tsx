// ============================================================
// PAGE — /products/[slug]
// Single product detail page - Mobile First Design
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ShoppingCart,
  Plus,
  Minus,
  Share2,
  Tag,
  Package,
  AlertCircle,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Copy,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import Skeleton from "@/components/ui/Skeleton";
import type { ProductWithImages } from "@/types/database";

// ── Image Gallery ─────────────────────────────────────────────
function ImageGallery({
  images,
}: {
  images: ProductWithImages["product_images"];
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full rounded-2xl flex items-center justify-center bg-gray-50"
        style={{ aspectRatio: "1/1" }}
      >
        <Package size={48} className="text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-gray-50"
        style={{ aspectRatio: "1/1" }}
      >
        <Image
          src={images[active].url}
          alt="Product image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 500px"
          priority
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-medium">
              {active + 1}/{images.length}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className="relative shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: "70px",
                height: "70px",
                border:
                  i === active
                    ? "2px solid var(--color-brand)"
                    : "2px solid transparent",
                opacity: i === active ? 1 : 0.6,
              }}
            >
              <Image
                src={img.url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="70px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Quantity Selector ─────────────────────────────────────────
function QuantitySelector({
  quantity,
  onQuantityChange,
  maxStock,
}: {
  quantity: number;
  onQuantityChange: (q: number) => void;
  maxStock: number;
}) {
  return (
    <div className="inline-flex items-center rounded-xl bg-gray-50 p-1">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="h-10 w-10 flex items-center justify-center rounded-lg disabled:opacity-40 active:bg-gray-200 transition-colors"
      >
        <Minus size={16} className="text-gray-600" />
      </button>
      <span
        className="w-12 text-center text-base font-semibold"
        style={{ color: "var(--color-navy)" }}
      >
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(Math.min(maxStock, quantity + 1))}
        disabled={quantity >= maxStock}
        className="h-10 w-10 flex items-center justify-center rounded-lg disabled:opacity-40 active:bg-gray-200 transition-colors"
      >
        <Plus size={16} className="text-gray-600" />
      </button>
    </div>
  );
}

// ── Share Modal ───────────────────────────────────────────────
function ShareModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNativeShare() {
    if ("share" in navigator) {
      navigator.share({
        title,
        text: `Check out ${title} on BestDealBazar!`,
        url,
      });
      onClose();
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:top-1/2 md:left-1/2 md:bottom-auto md:rounded-2xl md:max-w-md"
        style={{ transform: "none" }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--color-navy)" }}
            >
              Share this product
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {"share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 p-3 rounded-xl active:scale-95 transition-transform"
                style={{ backgroundColor: "var(--color-brand-50)" }}
              >
                <Share2 size={24} style={{ color: "var(--color-brand)" }} />
                <span
                  className="text-xs"
                  style={{ color: "var(--color-navy)" }}
                >
                  Share
                </span>
              </button>
            )}
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                  )}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 active:scale-95 transition-transform"
            >
              <Share2 size={24} className="text-blue-600" />
              <span className="text-xs" style={{ color: "var(--color-navy)" }}>
                Facebook
              </span>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    title
                  )}&url=${encodeURIComponent(url)}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-sky-50 active:scale-95 transition-transform"
            >
              <Share2 size={24} className="text-sky-500" />
              <span className="text-xs" style={{ color: "var(--color-navy)" }}>
                Twitter
              </span>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    title + " " + url
                  )}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 active:scale-95 transition-transform"
            >
              <Share2 size={24} className="text-green-600" />
              <span className="text-xs" style={{ color: "var(--color-navy)" }}>
                WhatsApp
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent text-xs text-gray-500 outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ color: "var(--color-brand)" }}
            >
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem, getItem, updateQuantity, isInCart } = useCart();

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setProduct(json.data);
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product) {
      const cartItem = getItem(product.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (cartItem) setQuantity(cartItem.quantity);
    }
  }, [product, getItem]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const firstImage = product.product_images?.[0]?.url ?? null;

    if (isInCart(product.id)) {
      updateQuantity(product.id, quantity);
    } else {
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, quantity, isInCart, updateQuantity, addItem]);

  const handleShare = useCallback(() => {
    if ("share" in navigator && window.innerWidth < 768) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      setShowShareModal(true);
    }
  }, [product]);

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container-app py-4">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div
            className="w-full rounded-2xl mb-4 md:mb-0"
            style={{ aspectRatio: "1/1" }}
          >
            <Skeleton />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-10 w-40 rounded" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="container-app py-20 flex flex-col items-center text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <AlertCircle size={40} className="text-gray-400" />
        </div>
        <h2
          className="text-xl font-black mb-2"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: "var(--color-navy)",
          }}
        >
          Product not found
        </h2>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          This product may have been removed or is unavailable
        </p>
        <Link
          href={ROUTES.products}
          className="h-12 px-8 rounded-xl text-sm font-bold text-white inline-flex items-center"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          Browse products
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(
    product.actual_price,
    product.selling_price
  );
  const outOfStock = product.stock_quantity === 0;
  const lowStock =
    product.stock_quantity > 0 &&
    product.stock_quantity <= product.low_stock_threshold;
  const cartItem = getItem(product.id);
  const inCart = isInCart(product.id);

  return (
    <>
      <div className="min-h-screen pb-8" style={{ backgroundColor: "#f7f7f5" }}>
        {/* Sticky header */}
        <div
          className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm"
          style={{ borderBottom: "1px solid #e8ecef" }}
        >
          <div className="container-app">
            <div className="flex items-center justify-between h-14">
              <button
                onClick={() => router.back()}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} style={{ color: "var(--color-navy)" }} />
              </button>
              <h1
                className="text-sm font-semibold truncate max-w-50 md:max-w-md"
                style={{ color: "var(--color-navy)" }}
              >
                {product.name}
              </h1>
              <button
                onClick={handleShare}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Share2 size={18} style={{ color: "var(--color-navy)" }} />
              </button>
            </div>
          </div>
        </div>

        <div className="container-app py-4">
          <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Left — Images */}
            <div>
              <ImageGallery images={product.product_images} />
            </div>

            {/* Right — Info */}
            <div className="mt-5 md:mt-0 flex flex-col gap-4">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.categories && (
                  <Link
                    href={`${ROUTES.products}?category=${product.categories.slug}`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-brand-50)",
                      color: "var(--color-brand)",
                    }}
                  >
                    {product.categories.name}
                  </Link>
                )}
                {product.is_new_arrival && (
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: "var(--color-brand)" }}
                  >
                    🆕 New Arrival
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Name */}
              <h1
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "var(--color-navy)",
                }}
              >
                {product.name}
              </h1>

              {/* Unit */}
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Package size={14} />
                {product.unit}
              </p>

              {/* Price */}
              <div
                className="bg-white rounded-2xl p-4 flex flex-col gap-2"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-end gap-3 flex-wrap">
                  <span
                    className="text-3xl md:text-4xl font-black"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {formatPrice(product.selling_price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.actual_price)}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Save{" "}
                        {formatPrice(
                          product.actual_price - product.selling_price
                        )}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400">Inclusive of all taxes</p>
              </div>

              {/* Stock status */}
              {outOfStock ? (
                <div className="bg-red-50 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    Out of stock
                  </span>
                </div>
              ) : lowStock ? (
                <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-amber-600">
                    Only {product.stock_quantity} left — Order soon
                  </span>
                </div>
              ) : null}

              {/* Short description */}
              {product.short_description && (
                <div
                  className="bg-white rounded-2xl p-4"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.short_description}
                  </p>
                </div>
              )}

              {/* Quantity + Add to cart */}
              {!outOfStock && (
                <div
                  className="bg-white rounded-2xl p-4 flex flex-col gap-3"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                >
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--color-navy)" }}
                  >
                    Quantity
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      maxStock={product.stock_quantity}
                    />
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    >
                      {addedToCart ? (
                        <>
                          <Check size={16} /> Added!
                        </>
                      ) : inCart ? (
                        <>
                          <ShoppingCart size={16} /> Update Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} /> Add to Cart ·{" "}
                          {formatPrice(product.selling_price * quantity)}
                        </>
                      )}
                    </button>
                  </div>

                  {inCart && (
                    <Link
                      href={ROUTES.cart}
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: "1.5px solid var(--color-brand)",
                        color: "var(--color-brand)",
                      }}
                    >
                      View Cart ({cartItem?.quantity} items)
                    </Link>
                  )}
                </div>
              )}

              {/* Features */}
              <div
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              >
                <h3
                  className="text-sm font-bold mb-3 flex items-center gap-2"
                  style={{ color: "var(--color-navy)" }}
                >
                  <Shield size={15} style={{ color: "var(--color-brand)" }} />
                  Why BestDealBazar
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    "Fresh & Premium Quality",
                    "Hygienically Packaged",
                    "Fast Delivery in Kozhikode",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check size={13} className="text-green-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full description */}
          {product.full_description && (
            <div
              className="mt-6 bg-white rounded-2xl p-5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <h3
                className="text-base font-bold mb-3 flex items-center gap-2"
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: "var(--color-navy)",
                }}
              >
                <Tag size={15} style={{ color: "var(--color-brand)" }} />
                Product Details
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.full_description}
              </p>
            </div>
          )}

          {/* Delivery & Returns */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="bg-white rounded-xl p-4 text-center"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <Truck
                size={22}
                className="mx-auto mb-2"
                style={{ color: "var(--color-brand)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                Free Delivery
              </p>
              <p className="text-xs text-gray-400">Above ₹500 in Kozhikode</p>
            </div>
            <div
              className="bg-white rounded-xl p-4 text-center"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <RotateCcw
                size={22}
                className="mx-auto mb-2"
                style={{ color: "var(--color-brand)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                Easy Returns
              </p>
              <p className="text-xs text-gray-400">7 days return policy</p>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-4">
            SKU: {product.sku}
          </p>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}
