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
      className="absolute inset-0 flex items-center justify-center p-4 cursor-pointer select-none z-10"
    >
      <div
        className={`flex flex-col items-center text-center p-6 sm:p-7 max-w-[310px] sm:max-w-[330px] rounded-2xl border transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-[#0c141d]/90 shadow-2xl shadow-cyan-500/20 scale-105'
            : 'border-white/[0.08] bg-[#0c0e12]/80 hover:border-white/20 hover:bg-[#0f1217]/85 shadow-2xl backdrop-blur-md'
        }`}
      >
        {/* Icon box */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3.5 border transition-colors ${
            isDragOver
              ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
              : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
          }`}
        >
          {isDragOver ? (
            <UploadCloud className="w-6 h-6 animate-bounce" />
          ) : (
            <ImageIcon className="w-6 h-6" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-tight mb-1.5">
          {isDragOver ? 'Drop image here' : 'Upload your photo'}
        </h3>

        {/* Subtext */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          Drag & drop or click to browse. Supports JPG, PNG, WEBP up to 20MB.
        </p>

        {/* Privacy Pill */}
        <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Your photo stays on your device.</span>
        </div>
      </div>
    </div>
  );
};
