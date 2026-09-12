'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { renderCompositedFrame } from '@/lib/canvasRenderer';
import { FRAME_GEOMETRY, TRANSFORM_LIMITS } from '@/lib/constants';
import { validateImageFile } from '@/lib/imageUtils';
import { TransformState, UserImageInfo } from '@/types';
import { EmptyState } from './EmptyState';
import { Move, ZoomIn } from 'lucide-react';

interface CanvasPreviewProps {
  userImage: UserImageInfo | null;
  frameImage: HTMLImageElement | null;
  transform: TransformState;
  onTransformChange: (newTransform: Partial<TransformState>) => void;
  onFileDrop: (file: File) => void;
  onError: (msg: string) => void;
  onTriggerUpload: () => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  userImage,
  frameImage,
  transform,
  onTransformChange,
  onFileDrop,
  onError,
  onTriggerUpload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging & gesture states
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDragOverFile, setIsDragOverFile] = useState(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const initialPinchZoom = useRef<number>(1.0);

  // Re-render canvas whenever image, frame, or transform changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderCompositedFrame({
      canvas,
      userImage,
      frameImage,
      transform,
    });
  }, [userImage, frameImage, transform]);

  // Compute scale ratio between canvas native resolution (1254) and rendered DOM width
  const getCanvasScaleRatio = useCallback(() => {
    if (!canvasRef.current) return 1;
    const rect = canvasRef.current.getBoundingClientRect();
    return rect.width > 0 ? FRAME_GEOMETRY.canvasWidth / rect.width : 1;
  }, []);

  // --- MOUSE & TOUCH EVENT HANDLERS FOR DIRECT DRAGGING ---

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!userImage) return;
    setIsPointerDown(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown || !lastPointerPos.current || !userImage) return;

    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    const ratio = getCanvasScaleRatio();
    const newPanX = Math.max(
      TRANSFORM_LIMITS.panX.min,
      Math.min(TRANSFORM_LIMITS.panX.max, transform.panX + dx * ratio)
    );
    const newPanY = Math.max(
      TRANSFORM_LIMITS.panY.min,
      Math.min(TRANSFORM_LIMITS.panY.max, transform.panY + dy * ratio)
    );

    onTransformChange({
      panX: Math.round(newPanX),
      panY: Math.round(newPanY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPointerDown(false);
    lastPointerPos.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if not captured
    }
  };

  // --- MOUSE WHEEL ZOOM ---
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!userImage) return;
    e.preventDefault();

    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    const nextZoom = Math.max(
      TRANSFORM_LIMITS.zoom.min,
      Math.min(TRANSFORM_LIMITS.zoom.max, Number((transform.zoom + zoomDelta).toFixed(2)))
    );

    onTransformChange({ zoom: nextZoom });
  };

  // --- TOUCH PINCH-TO-ZOOM FOR MOBILE ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && userImage) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDist.current = dist;
      initialPinchZoom.current = transform.zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialPinchDist.current && userImage) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialPinchDist.current;
      const nextZoom = Math.max(
        TRANSFORM_LIMITS.zoom.min,
        Math.min(
          TRANSFORM_LIMITS.zoom.max,
          Number((initialPinchZoom.current * ratio).toFixed(2))
        )
      );
      onTransformChange({ zoom: nextZoom });
    }
  };

  const handleTouchEnd = () => {
    initialPinchDist.current = null;
  };

  // --- FILE DRAG & DROP ON CANVAS ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file uploaded.');
      return;
    }

    onFileDrop(file);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[620px] mx-auto">
      {/* Aspect-square responsive canvas container */}
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 bg-[#07080a] ${
          isDragOverFile
            ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-cyan-900/30'
            : 'border-white/[0.1] hover:border-white/20'
        } ${userImage ? (isPointerDown ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        tabIndex={0}
        role="region"
        aria-label="Frame preview canvas. Click and drag or pinch to adjust your photo."
      >
        {/* Master HTML Canvas at 1254 x 1254 */}
        <canvas
          ref={canvasRef}
          width={FRAME_GEOMETRY.canvasWidth}
          height={FRAME_GEOMETRY.canvasHeight}
          className="w-full h-full object-contain pointer-events-none block select-none"
        />

        {/* Empty State Overlay */}
        {!userImage && (
          <EmptyState
            onTriggerUpload={onTriggerUpload}
            isDragOver={isDragOverFile}
          />
        )}

        {/* Quick Interaction Hint (Desktop) */}
        {userImage && (
          <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
            <span className="flex items-center space-x-1 text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md px-2 py-1 rounded text-zinc-300 border border-white/10">
              <Move className="w-2.5 h-2.5 mr-0.5" /> Drag to move
            </span>
            <span className="hidden sm:flex items-center space-x-1 text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md px-2 py-1 rounded text-zinc-300 border border-white/10">
              <ZoomIn className="w-2.5 h-2.5 mr-0.5" /> Scroll to zoom
            </span>
          </div>
        )}
      </div>

      {/* Resolution & Ratio Subtitle */}
      <div className="flex items-center justify-between w-full px-2 mt-3 text-[11px] text-zinc-400">
        <span>Output Canvas: {FRAME_GEOMETRY.canvasWidth} × {FRAME_GEOMETRY.canvasHeight} px (1:1)</span>
        <span className="text-zinc-400">ASUS Pixel-Perfect Overlay</span>
      </div>
    </div>
  );
};
