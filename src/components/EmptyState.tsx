'use client';

import React from 'react';
import { UploadCloud, Shield, Image as ImageIcon } from 'lucide-react';

interface EmptyStateProps {
  onTriggerUpload: () => void;
  isDragOver?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onTriggerUpload,
  isDragOver = false,
}) => {
  return (
    <div
      onClick={onTriggerUpload}
      className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${
        isDragOver
          ? 'bg-cyan-500/10 backdrop-blur-[2px]'
          : 'bg-transparent hover:bg-white/[0.02]'
      }`}
      style={{
        // Match the circular photo area: center 49.3% x, 45.3% y, radius ~40.4%
        clipPath: 'circle(40.4% at 49.32% 45.33%)',
      }}
    >
      <div
        className={`flex flex-col items-center text-center p-6 max-w-[280px] sm:max-w-[340px] rounded-2xl border transition-all duration-200 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 scale-105'
            : 'border-white/[0.12] bg-[#0d0f14]/85 hover:border-white/25 hover:bg-[#12151c]/90 shadow-2xl backdrop-blur-md'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
            isDragOver
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'bg-white/[0.06] text-zinc-300 group-hover:text-white'
          }`}
        >
          {isDragOver ? (
            <UploadCloud className="w-7 h-7 animate-bounce" />
          ) : (
            <ImageIcon className="w-7 h-7" />
          )}
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-1">
          {isDragOver ? 'Drop image here' : 'Upload your photo'}
        </h2>

        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          Drag & drop or click to browse. Supports JPG, PNG, WEBP up to 20MB.
        </p>

        <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400/90 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Your photo stays on your device.</span>
        </div>
      </div>
    </div>
  );
};
