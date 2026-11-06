"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

interface AnnouncementBarProps {
  dismissible?: boolean;
  message?: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AnnouncementBar({
  dismissible = true,
  message = "Weekend Deal · Up to 20% OFF on FMCG essentials",
  href = "/deals/weekend-sale",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#061b49] text-white border-b border-white/10">
      <div className="container-app h-8 flex items-center justify-between gap-2 text-[11px]">
        {href ? (
          <Link
            href={href}
            className="flex-1 min-w-0 flex items-center justify-center sm:justify-start gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="font-medium truncate">{message}</span>
            <ArrowRight size={11} className="flex-shrink-0 opacity-75" />
          </Link>
        ) : (
          <div className="flex-1 min-w-0 flex items-center justify-center sm:justify-start gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="font-medium truncate">{message}</span>
          </div>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="h-5 w-5 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
