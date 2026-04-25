"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Home,
  LayoutGrid,
  ClipboardList,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/lib/constants";
import SearchBar from "@/components/ui/SearchBar";
import ProfileSheet from "@/components/layout/ProfileSheet";

const bottomNavItems = [
  { label: "Home", href: ROUTES.home, icon: Home, exact: true },
  { label: "Products", href: ROUTES.products, icon: LayoutGrid, exact: false },
  { label: "Cart", href: ROUTES.cart, icon: ShoppingCart, exact: false },
  { label: "Orders", href: ROUTES.orders, icon: ClipboardList, exact: false },
];

const desktopNavLinks = [
  { label: "Home", href: ROUTES.home, exact: true },
  { label: "Products", href: ROUTES.products, exact: false },
  { label: "Orders", href: ROUTES.orders, exact: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuthStore();
  const { itemCount } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full bg-white"
        style={{ borderBottom: "2px solid #e8ecef" }}
      >
        <div className="container-app">
          <div className="flex items-center gap-2 h-14">
            {/* Logo */}
            <Link href={ROUTES.home} className="flex-shrink-0">
              <span
                className="text-xl font-black tracking-tight leading-none"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                <span style={{ color: "var(--color-navy)" }}>best</span>
                <span style={{ color: "var(--color-brand)" }}>deal</span>
                <span style={{ color: "var(--color-navy)" }}>bazar</span>
              </span>
            </Link>

            {/* Location pill — mobile only */}
            <button
              className="md:hidden flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-brand-50)",
                border: "1px solid var(--color-brand-200)",
              }}
            >
              <MapPin
                size={10}
                style={{ color: "var(--color-brand)" }}
                className="flex-shrink-0"
              />
              <span
                className="text-[10px] font-bold truncate max-w-[70px]"
                style={{ color: "var(--color-brand-700)" }}
              >
                Kozhikode
              </span>
            </button>

            {/* Search — desktop only */}
            <div className="hidden md:flex flex-1 min-w-0">
              <SearchBar variant="compact" />
            </div>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
              {desktopNavLinks.map(({ label, href, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={
                    isActive(href, exact)
                      ? {
                          backgroundColor: "var(--color-brand)",
                          color: "#ffffff",
                        }
                      : { color: "var(--color-navy)" }
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto md:ml-0">
              {/* Cart */}
              <Link
                href={ROUTES.cart}
                className="relative flex items-center justify-center h-9 w-9 rounded-xl transition-colors"
                style={{ color: "var(--color-navy)" }}
              >
                <ShoppingCart size={19} />
                {/* mounted check prevents hydration mismatch */}
                {mounted && itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center text-[9px] font-black text-white rounded-full px-1 leading-none"
                    style={{ backgroundColor: "var(--color-brand)" }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors hover:opacity-80"
                  >
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt={user.name ?? "User"}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[11px] font-black"
                        style={{ backgroundColor: "var(--color-brand)" }}
                      >
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                  </button>
                  <ProfileSheet
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                  />
                </>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold text-white active:scale-95 transition-all"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  <User size={13} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2 — Search full width (mobile only) */}
        <div
          className="md:hidden pb-2.5 container-app"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          <SearchBar variant="full" />
        </div>
      </header>

      {/* ── BOTTOM NAV (mobile only) ──────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="mx-3 mb-3 bg-white rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavItems.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              const isCart = href === ROUTES.cart;

              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-1 flex-1 py-0.5"
                >
                  <div
                    className="relative flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: active
                        ? "var(--color-brand)"
                        : "transparent",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      paddingLeft: active ? "14px" : "8px",
                      paddingRight: active ? "14px" : "8px",
                    }}
                  >
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.5 : 1.8}
                      style={{ color: active ? "#ffffff" : "#9ca3af" }}
                    />
                    {active && (
                      <span className="text-[11px] font-bold text-white whitespace-nowrap">
                        {label}
                      </span>
                    )}
                    {/* Cart badge — mounted check fixes hydration */}
                    {isCart && mounted && itemCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 min-w-[15px] h-[15px] flex items-center justify-center text-[8px] font-black rounded-full leading-none"
                        style={{
                          backgroundColor: active
                            ? "#fff"
                            : "var(--color-brand)",
                          color: active ? "var(--color-brand)" : "#fff",
                          border: active
                            ? "1px solid var(--color-brand)"
                            : "none",
                        }}
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </div>

                  {!active && (
                    <span
                      className="text-[9px] font-medium leading-none"
                      style={{ color: "#9ca3af" }}
                    >
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
