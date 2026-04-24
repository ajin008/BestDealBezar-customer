// ============================================================
// APP TYPES
// UI state, API responses, cart — not tied to DB schema
// ============================================================

import type { ProductWithImages } from "./database";

// ── Cart ─────────────────────────────────────────────────────

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  unit: string;
  selling_price: number;
  quantity: number;
  stock_quantity: number;
}

// ── API Responses ────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Checkout ─────────────────────────────────────────────────

export interface CheckoutAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
}

// ── Auth ─────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

// ── Product filters ──────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  new_arrival?: boolean;
  page?: number;
  limit?: number;
}
