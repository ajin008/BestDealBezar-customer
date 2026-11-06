"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
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
  { label: "Catalog", href: ROUTES.products, icon: LayoutGrid, exact: false },
  { label: "Bag", href: ROUTES.cart, icon: ShoppingBag, exact: false },
  { label: "Orders", href: ROUTES.orders, icon: ClipboardList, exact: false },
];

const desktopNavLinks = [
  { label: "Storefront", href: ROUTES.home, exact: true },
  { label: "All Products", href: ROUTES.products, exact: false },
  { label: "My Orders", href: ROUTES.orders, exact: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuthStore();
  const { itemCount, subtotal } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── TOP HEADER BAR ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e6e4df]">
        <div className="container-app">
          <div className="flex items-center justify-between gap-2 h-13 md:h-14">
            {/* Left: Brand Wordmark + Native-style Delivery Location Subline */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={ROUTES.home}
                className="flex flex-col justify-center min-w-0"
              >
                <span
                  className="text-lg md:text-xl font-bold tracking-tight leading-none text-[#061b49]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  BestDeal<span className="text-[#2a66f4]">Bazar</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 leading-none mt-1">
                  <MapPin size={9} className="text-[#2a66f4] flex-shrink-0" />
                  <span className="truncate">Kozhikode · Wholesale</span>
                </span>
              </Link>
            </div>

            {/* Center: Search — desktop */}
            <div className="hidden md:flex flex-1 justify-center px-4 min-w-0">
              <SearchBar variant="compact" />
            </div>

            {/* Right: Navigation + Cart + Account */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              <nav className="hidden md:flex items-center gap-1 mr-1">
                {desktopNavLinks.map(({ label, href, exact }) => {
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? "bg-[#f4f3ef] text-[#061b49]"
                          : "text-slate-600 hover:text-[#061b49] hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Cart button — desktop shows full pill, mobile shows compact icon */}
              <Link
                href={ROUTES.cart}
                aria-label="Shopping bag"
                className="relative inline-flex items-center justify-center gap-1.5 h-8 md:h-9 px-2.5 md:px-3 rounded-lg bg-[#f4f3ef] hover:bg-[#eae8e1] text-[#061b49] transition-colors"
              >
                <ShoppingBag size={15} strokeWidth={2} />
                {mounted && itemCount > 0 ? (
                  <span className="text-xs font-bold tabular-nums">
                    {itemCount}
                    <span className="hidden lg:inline font-normal text-slate-500 ml-1">
                      · ₹{Math.round(subtotal)}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                    Bag
                  </span>
                )}
              </Link>

              {/* Auth / Profile */}
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    aria-label="Account menu"
                    className="flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-lg border border-[#e6e4df] bg-white hover:border-slate-300 transition-colors"
                  >
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt={user.name ?? "User"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-[#061b49] flex items-center justify-center text-white text-[11px] font-bold">
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
                  type="button"
                  onClick={openAuthModal}
                  className="inline-flex items-center gap-1.5 h-8 md:h-9 px-3 rounded-lg text-xs font-semibold text-white bg-[#061b49] hover:bg-[#2a66f4] active:scale-[0.98] transition-all"
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Row — integrated cleanly without a divider line */}
        <div className="md:hidden pb-2.5 container-app">
          <SearchBar variant="full" />
        </div>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR ────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e6e4df]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4 h-14 px-2">
          {bottomNavItems.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            const isCart = href === ROUTES.cart;

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
                  active
                    ? "text-[#061b49]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#061b49]" />
                )}
                <div className="relative flex items-center justify-center h-6 w-6">
                  <Icon size={18} strokeWidth={active ? 2.3 : 1.75} />
                  {isCart && mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#2a66f4] text-white text-[9px] font-bold flex items-center justify-center tabular-nums leading-none">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] leading-none tracking-tight ${
                    active ? "font-bold text-[#061b49]" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
