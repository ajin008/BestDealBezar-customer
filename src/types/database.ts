// ============================================================
// DATABASE TYPES
// Mirror of Supabase table schemas — keep in sync with DB
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "razorpay";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ── Tables ──────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  short_description: string | null;
  full_description: string | null;
  unit: string;
  actual_price: number;
  selling_price: number;
  tax_percent: number;
  stock_quantity: number;
  low_stock_threshold: number;
  weight_grams: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  categories?: Category;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total_amount: number;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  collected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "flat" | "percent";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  flat_delivery_charge: number;
  free_delivery_above: number;
  default_tax_percent: number;
  is_cod_enabled: boolean;
  is_online_payment_enabled: boolean;
  updated_at: string;
}
