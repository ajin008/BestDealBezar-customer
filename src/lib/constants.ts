// ============================================================
// APP CONSTANTS
// Delivery config, routes, Kozhikode pincodes
// Change business rules here — nowhere else
// ============================================================

// ── App identity ─────────────────────────────────────────────
export const APP_NAME = "BestDealBazar";
export const APP_DOMAIN = "bestdealbazar.com";
export const BUSINESS_NAME = "Adithya Trading";
export const BUSINESS_LOCATION = "Kozhikode, Kerala";

// ── Delivery ─────────────────────────────────────────────────
// Delivery only within Kozhikode district
export const KOZHIKODE_PINCODES: string[] = [
  "673001",
  "673002",
  "673003",
  "673004",
  "673005",
  "673006",
  "673007",
  "673008",
  "673009",
  "673010",
  "673011",
  "673012",
  "673013",
  "673014",
  "673015",
  "673016",
  "673017",
  "673018",
  "673019",
  "673020",
  "673021",
  "673028",
  "673029",
  "673032",
  "673101",
  "673102",
  "673103",
  "673104",
  "673105",
  "673106",
  "673301",
  "673302",
  "673303",
  "673304",
  "673305",
  "673306",
  "673307",
  "673308",
  "673309",
  "673310",
  "673311",
  "673312",
  "673314",
  "673315",
  "673316",
  "673317",
  "673318",
  "673321",
  "673323",
  "673324",
  "673501",
  "673502",
  "673503",
  "673504",
  "673505",
  "673506",
  "673507",
  "673508",
  "673521",
  "673522",
  "673523",
  "673524",
  "673525",
  "673526",
  "673527",
  "673528",
  "673541",
  "673542",
  "673543",
  "673544",
  "673571",
  "673572",
  "673573",
  "673574",
  "673575",
  "673576",
  "673577",
  "673578",
  "673579",
  "673580",
  "673581",
  "673582",
  "673583",
  "673584",
  "673585",
  "673586",
  "673587",
  "673588",
  "673591",
  "673592",
  "673593",
  "673594",
  "673595",
  "673596",
  "673597",
  "673598",
  "673601",
  "673602",
  "673603",
  "673604",
  "673605",
  "673606",
  "673607",
  "673608",
  "673611",
  "673612",
  "673613",
  "673614",
  "673615",
  "673616",
  "673617",
  "673618",
  "673619",
  "673620",
  "673621",
  "673622",
  "673623",
  "673624",
  "673625",
  "673626",
  "673627",
  "673628",
  "673629",
  "673630",
  "673631",
  "673632",
  "673633",
  "673634",
  "673635",
  "673636",
  "673637",
  "673638",
  "673639",
  "673640",
  "673641",
  "673642",
  "673643",
  "673645",
  "673647",
  "673651",
  "673655",
];

export function isValidKozhikodePincode(pincode: string): boolean {
  return KOZHIKODE_PINCODES.includes(pincode.trim());
}

// ── Pagination ───────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 20;
export const ORDERS_PER_PAGE = 10;

// ── Cart ─────────────────────────────────────────────────────
export const MAX_CART_QUANTITY = 99;
export const CART_STORAGE_KEY = "bestdealbazar_cart";

// ── Auth ─────────────────────────────────────────────────────
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const AUTH_STORAGE_KEY = "bestdealbazar_auth";

// ── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  products: "/products",
  product: (slug: string) => `/products/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,
  login: "/auth/login",
  authCallback: "/auth/callback",
} as const;
