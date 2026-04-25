// components/layout/AnnouncementBar.tsx
"use client";

import { useState } from "react";
import { X, ChevronRight, Zap } from "lucide-react";

interface AnnouncementBarProps {
  /**
   * Whether the bar should be dismissible by the user.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Custom message to display.
   * @default "⚡ Weekend Deal: Up to 20% OFF on FMCG essentials | Ends tonight!"
   */
  message?: string;
  /**
   * URL to navigate to when clicking the bar (optional).
   */
  href?: string;
  /**
   * Background color (Tailwind class or custom).
   * @default "bg-gradient-to-r from-brand-600 to-brand-700"
   */
  bgColor?: string;
  /**
   * Text color (Tailwind class).
   * @default "text-white"
   */
  textColor?: string;
}

/**
 * Mobile-responsive announcement bar with optional dismissal.
 * Features:
 * - Dismissible but reappears on page refresh (no localStorage)
 * - Reduced height for compact display
 * - Minimal left/right padding on mobile
 * - Gradient background
 * - Clickable link support
 * - Animated exit
 */
export default function AnnouncementBar({
  dismissible = true,
  message = "⚡ Weekend Deal: Up to 20% OFF on FMCG essentials | Ends tonight!",
  href = "/deals/weekend-sale",
  bgColor = "bg-gradient-to-r from-brand-600 to-brand-700",
  textColor = "text-white",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  const handleClick = () => {
    if (href && isVisible) {
      window.location.href = href;
    }
  };

  if (!isVisible) return null;

  const Wrapper = href ? "a" : "div";

  return (
    <div
      className={`
        relative overflow-hidden
        transition-all duration-200 ease-in-out
        ${
          isAnimatingOut
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }
      `}
      style={{ transformOrigin: "top" }}
    >
      <Wrapper
        href={href}
        onClick={
          !href
            ? undefined
            : (e) => {
                if ((e.target as HTMLElement).closest(".dismiss-button")) {
                  e.preventDefault();
                  return;
                }
              }
        }
        className={`
          block w-full ${bgColor} ${textColor}
          transition-all duration-200
          ${
            href
              ? "cursor-pointer hover:brightness-105 active:brightness-95"
              : ""
          }
        `}
      >
        <div className="relative w-full px-1.5 sm:px-4">
          <div className="flex items-center justify-between gap-1 sm:gap-4">
            {/* Left spacer - reduced on mobile */}
            {dismissible && <div className="w-4 sm:w-6 shrink-0" />}

            {/* Main content - centered with reduced height and gaps */}
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 flex-wrap py-1.5 sm:py-2">
              {/* Flash icon for attention */}

              <span className="text-[11px] sm:text-xs font-medium text-center leading-tight sm:leading-relaxed">
                {message}
              </span>

              {/* Arrow indicator on clickable bars */}
              {href && (
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 ml-0.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="dismiss-button flex-shrink-0 p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close announcement"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Wrapper>

      {/* Subtle bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
    </div>
  );
}
