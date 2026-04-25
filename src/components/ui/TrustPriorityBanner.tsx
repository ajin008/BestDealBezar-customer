// components/ui/TrustPriorityBanner.tsx
import React from "react";
import { Shield, Heart, Sparkles } from "lucide-react";

export default function TrustPriorityBanner() {
  return (
    <div className="w-full bg-black py-6 md:py-8 my-4 md:my-6 rounded-2xl">
      <div className="container mx-auto px-4">
        {/* Main message */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge / Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/20 border border-brand/40 mb-4">
            <Shield className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold text-brand uppercase tracking-wide">
              Your Safety First
            </span>
          </div>

          {/* Main heading */}
          <p className="text-white text-base md:text-lg font-medium leading-relaxed mb-2">
            In store or online your health & safety is our top priority
          </p>

          {/* Subheading */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            The only supermarket that makes your life easier, makes you enjoy
            life and makes it better
          </p>

          {/* Optional decorative line */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-8 bg-brand/50" />
            <Sparkles className="w-3 h-3 text-brand/60" />
            <div className="h-px w-8 bg-brand/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
