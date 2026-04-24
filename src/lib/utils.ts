// ============================================================
// UTILITY FUNCTIONS
// Pure helpers used across the entire app.
// No side effects, no imports from this project.
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merging ───────────────────────────────────
// Usage: className={cn("base-class", condition && "conditional")}
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Currency formatting ──────────────────────────────────────
// Always formats as Indian Rupees
// Usage: formatPrice(199) → "₹199"
// Usage: formatPrice(1999.5) → "₹1,999.50"
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ── Discount percentage ──────────────────────────────────────
// Usage: getDiscountPercent(100, 80) → 20
export function getDiscountPercent(
  actualPrice: number,
  sellingPrice: number
): number {
  if (actualPrice <= 0 || sellingPrice >= actualPrice) return 0;
  return Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);
}

// ── Date formatting ──────────────────────────────────────────
// Usage: formatDate("2024-01-15T10:30:00Z") → "15 Jan 2024"
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

// Usage: formatDateTime("2024-01-15T10:30:00Z") → "15 Jan 2024, 10:30 AM"
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
}

// ── String helpers ───────────────────────────────────────────
// Usage: truncate("Long product name here", 20) → "Long product name..."
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "...";
}

// Usage: slugify("Basmati Rice 5kg") → "basmati-rice-5kg"
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Phone number helpers ─────────────────────────────────────
// Strips country code, spaces, dashes for storage
// Usage: normalizePhone("+91 98765 43210") → "9876543210"
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

// Usage: isValidIndianPhone("9876543210") → true
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(phone));
}

// ── Pincode helpers ──────────────────────────────────────────
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.trim());
}

// ── Stock helpers ────────────────────────────────────────────
export function isInStock(quantity: number): boolean {
  return quantity > 0;
}

export function isLowStock(quantity: number, threshold: number): boolean {
  return quantity > 0 && quantity <= threshold;
}

// ── Order status label ───────────────────────────────────────
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    processing: "Being Packed",
    shipped: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

// ── Order status color ───────────────────────────────────────
// Returns Tailwind color token for badge styling
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50",
    confirmed: "text-blue-600 bg-blue-50",
    processing: "text-purple-600 bg-purple-50",
    shipped: "text-orange-600 bg-orange-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
  };
  return colors[status] ?? "text-gray-600 bg-gray-50";
}
