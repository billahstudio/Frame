'use client';

import React from 'react';
import { RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  hasImage: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasImage, onReset }) => {
  return (
    <header className="w-full border-b border-white/[0.08] bg-[#0b0c0e]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: ASUS Brand Treatment */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center tracking-[0.25em] font-extrabold text-white text-lg sm:text-xl select-none font-mono">
            ASUS
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium hidden sm:inline-block">
            Commercial Studio
          </span>
        </div>

        {/* Center: Title / Product Badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <h1 className="text-xs sm:text-sm font-medium text-zinc-200 tracking-wide">
              ExpertBook Ultra <span className="text-zinc-400 font-normal">Frame Generator</span>
            </h1>
          </div>
        </div>

        {/* Right: Reset Action & Privacy Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-zinc-400 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.05]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-Side Only</span>
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={!hasImage}
            className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
              hasImage
                ? 'border-white/20 text-zinc-200 hover:bg-white/[0.08] hover:text-white hover:border-white/30 active:scale-95'
                : 'border-white/[0.05] text-zinc-600 cursor-not-allowed'
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
