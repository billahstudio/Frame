'use client';

import React from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  formatDisplay: (val: number) => string;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const SliderRow: React.FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  defaultValue,
  formatDisplay,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (disabled) return;
    const nextVal = Math.max(min, Number((value - step).toFixed(2)));
    onChange(nextVal);
  };

  const handleIncrement = () => {
    if (disabled) return;
    const nextVal = Math.min(max, Number((value + step).toFixed(2)));
    onChange(nextVal);
  };

  const handleReset = () => {
    if (disabled) return;
    onChange(defaultValue);
  };

  const isAtDefault = Math.abs(value - defaultValue) < 0.001;

  return (
    <div className="space-y-1.5 py-1.5">
      {/* Header with Label and Value readout */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-300 select-none">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-zinc-400 text-[11px] min-w-[50px] text-right">
            {formatDisplay(value)}
          </span>
          {!isAtDefault && (
            <button
              type="button"
              onClick={handleReset}
              disabled={disabled}
              title={`Reset ${label}`}
              className="text-zinc-500 hover:text-cyan-400 transition-colors"
              aria-label={`Reset ${label}`}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Control row with [-] ─────●───── [+] */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          className="w-7 h-7 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.06] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          className="w-7 h-7 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.06] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
