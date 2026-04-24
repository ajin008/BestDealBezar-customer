// ============================================================
// COMPONENT — ProfileSheet
// Desktop: dropdown below avatar
// Mobile: bottom sheet
// Shows user info, quick links, logout
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  ClipboardList,
  MapPin,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "My Orders",
    description: "Track and view past orders",
    href: ROUTES.orders,
    icon: ClipboardList,
  },
  {
    label: "Saved Addresses",
    description: "Manage delivery addresses",
    href: "/addresses",
    icon: MapPin,
  },
];

export default function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user, logout } = useAuthStore();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on outside click (desktop dropdown)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    onClose();
  }

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
        onClick={onClose}
      />

      {/* Sheet / Dropdown */}
      <div
        ref={sheetRef}
        className="fixed z-50 bg-white w-full md:w-[300px] md:rounded-2xl"
        style={{
          // Mobile — bottom sheet
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.10)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Desktop positioning override via inline style on a wrapper */}
        <style>{`
          @media (min-width: 768px) {
            .profile-sheet {
              position: fixed !important;
              top: 60px !important;
              right: 16px !important;
              bottom: auto !important;
              left: auto !important;
              width: 300px !important;
              border-radius: 16px !important;
              box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
            }
          }
        `}</style>

        <div
          className="profile-sheet fixed bottom-0 left-0 right-0 bg-white w-full md:w-[300px]"
          style={{ borderRadius: "20px 20px 0 0" }}
        >
          {/* Handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--color-brand)" }}
            >
              My Account
            </p>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          {/* User info */}
          <div
            className="mx-4 mb-3 p-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "var(--color-brand-50)" }}
          >
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.name ?? "User"}
                className="h-11 w-11 rounded-full object-cover flex-shrink-0"
                style={{ border: "2px solid var(--color-brand-200)" }}
              />
            ) : (
              <div
                className="h-11 w-11 rounded-full flex items-center justify-center text-white text-base font-black flex-shrink-0"
                style={{ backgroundColor: "var(--color-brand)" }}
              >
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0">
              <p
                className="font-bold text-sm truncate"
                style={{ color: "var(--color-navy)" }}
              >
                {user.name ?? "User"}
              </p>
              {user.email && (
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="px-4 flex flex-col gap-1 mb-3">
            {menuItems.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--color-brand-50)" }}
                >
                  <Icon size={16} style={{ color: "var(--color-brand)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-gray-400 flex-shrink-0"
                />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 mb-3 h-px bg-gray-100" />

          {/* Logout - FIXED: Added pb-20 on mobile to account for bottom nav */}
          <div className="px-4 pb-20 md:pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "#fff1f0",
                color: "#e53e3e",
                border: "1.5px solid #fed7d7",
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
