// ============================================================
// COMPONENT — AuthModal
// Bottom sheet on mobile, centered modal on desktop
// Tab 1: Google OAuth (active)
// Tab 2: WhatsApp OTP (coming soon — dummy)
// Reads ?next= param to redirect after login
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ShoppingBag, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { APP_NAME } from "@/lib/constants";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"google" | "whatsapp">("google");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    if (isAuthModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  async function handleGoogleLogin() {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const next = searchParams.get("next") ?? "/";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            window.location.origin
          }/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setError("Failed to connect with Google. Please try again.");
        setIsLoading(false);
      }
      // If no error — browser redirects to Google, no need to setIsLoading(false)
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* ── Modal / Bottom sheet ──────────────────────────────── */}
      <div
        className="fixed z-50 bg-white w-full md:w-[420px] md:rounded-2xl"
        style={{
          // Mobile: bottom sheet
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: "20px 20px 0 0",
          // Desktop: centered
        }}
      >
        {/* Desktop override — centered */}
        <style>{`
          @media (min-width: 768px) {
            .auth-modal-inner {
              position: fixed !important;
              top: 50% !important;
              left: 50% !important;
              bottom: auto !important;
              transform: translate(-50%, -50%) !important;
              border-radius: 20px !important;
            }
          }
        `}</style>

        <div
          className="auth-modal-inner fixed bottom-0 left-0 right-0 bg-white w-full md:w-[420px]"
          style={{ borderRadius: "20px 20px 0 0" }}
        >
          {/* Handle bar — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--color-brand-50)" }}
              >
                <ShoppingBag
                  size={18}
                  style={{ color: "var(--color-brand)" }}
                />
              </div>
              <div>
                <h2
                  className="text-base font-black leading-tight"
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    color: "var(--color-navy)",
                  }}
                >
                  Sign in to {APP_NAME}
                </h2>
                <p className="text-xs text-gray-400">
                  To place orders and track deliveries
                </p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-5 pt-3">
            <button
              onClick={() => setActiveTab("google")}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={
                activeTab === "google"
                  ? { backgroundColor: "var(--color-brand)", color: "#fff" }
                  : { backgroundColor: "#f1f5f9", color: "#555" }
              }
            >
              Google
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all relative"
              style={
                activeTab === "whatsapp"
                  ? { backgroundColor: "var(--color-brand)", color: "#fff" }
                  : { backgroundColor: "#f1f5f9", color: "#555" }
              }
            >
              WhatsApp
              <span
                className="absolute -top-1.5 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "var(--color-brand-300)" }}
              >
                Soon
              </span>
            </button>
          </div>

          {/* Tab content */}
          <div
            className="px-5 pt-4 pb-6"
            style={{
              paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            }}
          >
            {/* Google tab */}
            {activeTab === "google" && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{
                    border: "2px solid #e8ecef",
                    backgroundColor: "#fff",
                    color: "var(--color-navy)",
                  }}
                >
                  {isLoading ? (
                    <span
                      className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
                      style={{ color: "var(--color-brand)" }}
                    />
                  ) : (
                    <>
                      {/* Google icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-xs text-center text-red-500">{error}</p>
                )}

                <p className="text-[11px] text-center text-gray-400 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <a href="/terms" className="underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}

            {/* WhatsApp tab — coming soon */}
            {activeTab === "whatsapp" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "#e8f5ee" }}
                >
                  <Lock size={28} style={{ color: "var(--color-brand)" }} />
                </div>
                <div className="text-center">
                  <p
                    className="font-bold text-sm mb-1"
                    style={{ color: "var(--color-navy)" }}
                  >
                    Coming Soon
                  </p>
                  <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed">
                    WhatsApp OTP login is being set up and will be available in
                    the next update. Please use Google to sign in for now.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("google")}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  Use Google instead
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
