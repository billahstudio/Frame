'use client';

import React from 'react';

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

  return (
    <div className="space-y-2 py-2 select-none">
      {/* Label and numerical value on top */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300 font-normal">{label}</span>
        <span className="font-mono text-zinc-400 text-xs text-right">
          {formatDisplay(value)}
        </span>
      </div>

      {/* Slider row: — ─────●───── + */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs font-mono select-none px-1"
        >
          —
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
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs font-mono select-none px-1"
        >
          +
        </button>
      </div>
    </div>
  );
};
