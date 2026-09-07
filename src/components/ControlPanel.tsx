'use client';

import React from 'react';
import {
  Download,
  FileImage,
  ImagePlus,
  LocateFixed,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SliderRow } from './Sliders';
import { TRANSFORM_LIMITS } from '@/lib/constants';
import { formatBytes } from '@/lib/imageUtils';
import { OutputFormat, TransformState, UserImageInfo } from '@/types';

interface ControlPanelProps {
  userImage: UserImageInfo | null;
  transform: TransformState;
  outputFormat: OutputFormat;
  jpegQuality: number;
  isExporting: boolean;
  onTransformChange: (updates: Partial<TransformState>) => void;
  onResetPosition: () => void;
  onResetAdjustments: () => void;
  onFormatChange: (format: OutputFormat) => void;
  onQualityChange: (quality: number) => void;
  onTriggerUpload: () => void;
  onDownload: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  userImage,
  transform,
  outputFormat,
  jpegQuality,
  isExporting,
  onTransformChange,
  onResetPosition,
  onResetAdjustments,
  onFormatChange,
  onQualityChange,
  onTriggerUpload,
  onDownload,
}) => {
  const hasImage = !!userImage;

  return (
    <aside
      className="flex flex-col space-y-4 w-full max-w-[520px] lg:max-w-[430px] mx-auto select-none"
      aria-label="Image adjustment controls"
    >
      {/* SECTION 1: PHOTO SOURCE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f13]/90 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            01 / Photo Source
          </span>
          {hasImage && (
            <span className="text-[11px] font-mono text-zinc-500">
              {userImage.width}×{userImage.height} ({formatBytes(userImage.file.size)})
            </span>
          )}
        </div>

        {!hasImage ? (
          <button
            type="button"
            onClick={onTriggerUpload}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm text-zinc-900 bg-[#ebedf0] hover:bg-white active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer"
          >
            <ImagePlus className="w-4 h-4 text-zinc-800" />
            <span>Upload Photo</span>
          </button>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center space-x-2.5 truncate">
                <FileImage className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-zinc-200 truncate font-medium max-w-[200px]">
                  {userImage.file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={onTriggerUpload}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded hover:bg-cyan-950/40 cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onResetPosition}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.06] transition-colors cursor-pointer"
                title="Reset position to center"
              >
                <LocateFixed className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset Position</span>
              </button>

              <button
                type="button"
                onClick={onResetAdjustments}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.06] transition-colors cursor-pointer"
                title="Reset all adjustments"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: ADJUSTMENTS */}
      <div
        className={`p-4 sm:p-5 rounded-2xl bg-[#0d0f13]/90 border border-white/[0.08] shadow-xl transition-opacity duration-300 ${
          hasImage ? 'opacity-100' : 'opacity-40 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            02 / Adjustments
          </span>
          <button
            type="button"
            onClick={onResetAdjustments}
            disabled={!hasImage}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Reset Adjustments
          </button>
        </div>

        <div className="space-y-1">
          {/* Zoom */}
          <SliderRow
            label="Zoom"
            value={transform.zoom}
            min={TRANSFORM_LIMITS.zoom.min}
            max={TRANSFORM_LIMITS.zoom.max}
            step={TRANSFORM_LIMITS.zoom.step}
            defaultValue={1.0}
            formatDisplay={(val) => `${val.toFixed(2)}x`}
            onChange={(zoom) => onTransformChange({ zoom })}
            disabled={!hasImage}
          />

          {/* Horizontal Position */}
          <SliderRow
            label="Horizontal"
            value={transform.panX}
            min={TRANSFORM_LIMITS.panX.min}
            max={TRANSFORM_LIMITS.panX.max}
            step={TRANSFORM_LIMITS.panX.step}
            defaultValue={0}
            formatDisplay={(val) => (val > 0 ? `+${val}px` : `${val}px`)}
            onChange={(panX) => onTransformChange({ panX })}
            disabled={!hasImage}
          />

          {/* Vertical Position */}
          <SliderRow
            label="Vertical"
            value={transform.panY}
            min={TRANSFORM_LIMITS.panY.min}
            max={TRANSFORM_LIMITS.panY.max}
            step={TRANSFORM_LIMITS.panY.step}
            defaultValue={0}
            formatDisplay={(val) => (val > 0 ? `+${val}px` : `${val}px`)}
            onChange={(panY) => onTransformChange({ panY })}
            disabled={!hasImage}
          />

          {/* Rotation */}
          <SliderRow
            label="Rotation"
            value={transform.rotation}
            min={TRANSFORM_LIMITS.rotation.min}
            max={TRANSFORM_LIMITS.rotation.max}
            step={TRANSFORM_LIMITS.rotation.step}
            defaultValue={0}
            formatDisplay={(val) => (val > 0 ? `+${val}°` : `${val}°`)}
            onChange={(rotation) => onTransformChange({ rotation })}
            disabled={!hasImage}
          />
        </div>
      </div>

      {/* SECTION 3: EXPORT FORMAT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f13]/90 border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            03 / Export Format
          </span>
          <span className="text-[11px] font-mono text-zinc-500">1254 × 1254 px</span>
        </div>

        {/* Format Selector Radio Cards */}
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Output format selection">
          <button
            type="button"
            role="radio"
            aria-checked={outputFormat === 'png'}
            onClick={() => onFormatChange('png')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              outputFormat === 'png'
                ? 'border-cyan-500/80 bg-[#0a1218] text-white shadow-sm shadow-cyan-500/10'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-sm text-white">PNG</span>
              <span className="text-[10px] text-zinc-400">Lossless & Sharp</span>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                outputFormat === 'png'
                  ? 'border-cyan-400 bg-transparent'
                  : 'border-zinc-700'
              }`}
            >
              {outputFormat === 'png' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={outputFormat === 'jpeg'}
            onClick={() => onFormatChange('jpeg')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              outputFormat === 'jpeg'
                ? 'border-cyan-500/80 bg-[#0a1218] text-white shadow-sm shadow-cyan-500/10'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-sm text-white">JPEG</span>
              <span className="text-[10px] text-zinc-400">Compact File</span>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                outputFormat === 'jpeg'
                  ? 'border-cyan-400 bg-transparent'
                  : 'border-zinc-700'
              }`}
            >
              {outputFormat === 'jpeg' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
            </div>
          </button>
        </div>

        {/* JPEG Quality Slider (visible if format is jpeg) */}
        {outputFormat === 'jpeg' && (
          <div className="pt-2 border-t border-white/[0.05] animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-300 font-medium">JPEG Quality</span>
              <span className="font-mono text-zinc-400 text-[11px]">{jpegQuality}%</span>
            </div>
            <input
              type="range"
              min={TRANSFORM_LIMITS.jpegQuality.min}
              max={TRANSFORM_LIMITS.jpegQuality.max}
              step={TRANSFORM_LIMITS.jpegQuality.step}
              value={jpegQuality}
              onChange={(e) => onQualityChange(parseInt(e.target.value, 10))}
              aria-label="JPEG Quality"
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>
        )}

        {/* PROMINENT DOWNLOAD BUTTON */}
        <button
          type="button"
          onClick={onDownload}
          disabled={isExporting}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-zinc-950 bg-white hover:bg-zinc-100 active:scale-[0.99] transition-all duration-200 shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Download high-resolution composite image"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>Rendering 1254px Export...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-zinc-900" />
              <span>DOWNLOAD IMAGE</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 ml-0.5" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
