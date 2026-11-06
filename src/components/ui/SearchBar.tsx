// ============================================================
// COMPONENT — SearchBar
// Native-app style mobile search & compact desktop search
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
    inputRef.current?.blur();
    onClose?.();
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  if (variant === "full") {
    return (
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl w-full bg-[#f4f3ef] border border-transparent focus-within:bg-white focus-within:border-[#061b49] transition-all">
          <Search size={15} className="flex-shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rice, oil, snacks, household..."
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-[13px] font-medium text-[#061b49] placeholder:text-slate-400 outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-300/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </form>
    );
  }

  // Compact variant — shown in desktop navbar
  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md" role="search">
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg w-full bg-[#f7f7f5] border border-[#e6e4df] hover:border-slate-300 focus-within:bg-white focus-within:border-[#061b49] transition-all">
        <Search size={14} className="flex-shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog (e.g. Matta rice, coconut oil, tea)..."
          className="flex-1 bg-transparent text-xs font-medium text-[#061b49] placeholder:text-slate-400 outline-none min-w-0"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={13} />
          </button>
        ) : (
          <span className="hidden lg:inline-block text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded border border-[#e6e4df] bg-white leading-none">
            ↵
          </span>
        )}
      </div>
    </form>
  );
}
