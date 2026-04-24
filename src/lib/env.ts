// ============================================================
// ENVIRONMENT VARIABLES
// Single source of truth for all env vars
// ============================================================

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    // Only throw on server side — client can't access server vars
    if (typeof window === "undefined") {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
          `Add it to your .env.local file.`
      );
    }
    return "";
  }
  return value;
}

function optional(key: string, fallback: string = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  supabase: {
    url: required("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  },
  whatsapp: {
    phoneNumberId: required("META_WHATSAPP_PHONE_NUMBER_ID"),
    accessToken: required("META_WHATSAPP_ACCESS_TOKEN"),
    templateName: optional("META_WHATSAPP_TEMPLATE_NAME", "bestdealbazar_otp"),
  },
  razorpay: {
    keyId: required("RAZORPAY_KEY_ID"),
    keySecret: required("RAZORPAY_KEY_SECRET"),
    webhookSecret: required("RAZORPAY_WEBHOOK_SECRET"),
  },
  app: {
    url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    nodeEnv: optional("NODE_ENV", "development"),
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
} as const;
