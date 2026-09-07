'use client';

import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  hasImage: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasImage, onReset }) => {
  return (
    <header className="w-full border-b border-white/[0.06] bg-[#000000]/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: ASUS Brand Treatment + ExpertBook Ultra (matching screenshot red box) */}
        <div className="flex items-center space-x-3.5">
          <div className="tracking-[0.25em] font-extrabold text-white text-lg sm:text-xl select-none font-mono">
            ASUS
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="text-xs sm:text-sm font-medium text-zinc-300 tracking-wide select-none">
            ExpertBook Ultra
          </span>
        </div>

        {/* Right: Client-Side Badge & Reset Action side-by-side */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-zinc-300 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.08] select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-Side Only</span>
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={!hasImage}
            className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              hasImage
                ? 'border-white/20 bg-white/[0.05] text-zinc-200 hover:bg-white/[0.1] hover:text-white hover:border-white/30 active:scale-95 cursor-pointer'
                : 'border-white/[0.05] bg-white/[0.02] text-zinc-600 cursor-not-allowed'
            }`}
            title="Reset photo and adjustments"
            aria-label="Reset photo and adjustments"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
