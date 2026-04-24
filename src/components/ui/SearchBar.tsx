// ============================================================
// COMPONENT — SearchBar
// Standalone search input with navigation
// Used in Navbar (compact) and as full-width on mobile
// ============================================================

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface SearchBarProps {
  variant?: "compact" | "full";
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function SearchBar({
  variant = "compact",
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(
      `${ROUTES.products}?search=${encodeURIComponent(query.trim())}`
    );
    onClose?.();
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  if (variant === "full") {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="flex items-center gap-2 h-11 px-4 rounded-2xl w-full"
          style={{
            border: "2px solid var(--color-brand)",
            backgroundColor: "#ffffff",
          }}
        >
          <Search
            size={16}
            style={{ color: "var(--color-brand)" }}
            className="flex-shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groceries, snacks, brands..."
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-sm outline-none min-w-0"
            style={{ color: "var(--color-text)" }}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0"
            >
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </div>
      </form>
    );
  }

  // Compact variant — shown in desktop navbar
  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
      <div
        className="flex items-center gap-2 h-9 px-3 rounded-xl w-full transition-all"
        style={{
          border: "2px solid #e8ecef",
          backgroundColor: "#f8fafc",
          color: "#888",
        }}
      >
        <Search size={13} className="flex-shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groceries, snacks, essentials..."
          className="flex-1 bg-transparent text-xs outline-none min-w-0 text-gray-600 placeholder:text-gray-400"
        />
        {query && (
          <button type="button" onClick={handleClear}>
            <X size={12} className="text-gray-400" />
          </button>
        )}
      </div>
    </form>
  );
}
