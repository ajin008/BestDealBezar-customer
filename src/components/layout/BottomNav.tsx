// ============================================================
// COMPONENT — BottomNav
// Mobile bottom navigation bar
// Fixed at bottom — main navigation for mobile users
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, ShoppingCart, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { label: "Home", href: ROUTES.home, icon: Home },
  { label: "Products", href: ROUTES.products, icon: Grid3x3 },
  { label: "Cart", href: ROUTES.cart, icon: ShoppingCart },
  { label: "Orders", href: ROUTES.orders, icon: ClipboardList },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuthStore();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        backgroundColor: "var(--color-nav-bg)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Safe area padding for iOS */}
      <div className="max-w-md mx-auto flex items-center justify-around pb-safe">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === ROUTES.home
              ? pathname === ROUTES.home
              : pathname.startsWith(href);

          const isCart = href === ROUTES.cart;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px]"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive
                      ? "var(--color-brand)"
                      : "var(--color-text-muted)",
                  }}
                />
                {isCart && itemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full px-1"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span
                className={cn("text-[10px] font-medium")}
                style={{
                  color: isActive
                    ? "var(--color-brand)"
                    : "var(--color-text-muted)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Profile — separate because it has auth logic */}
        {user ? (
          <Link
            href={ROUTES.orders}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px]"
          >
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.name ?? "User"}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <User
                size={22}
                strokeWidth={1.8}
                style={{ color: "var(--color-text-muted)" }}
              />
            )}
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              Profile
            </span>
          </Link>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px]"
          >
            <User
              size={22}
              strokeWidth={1.8}
              style={{ color: "var(--color-text-muted)" }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              Login
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
