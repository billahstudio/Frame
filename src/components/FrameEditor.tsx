'use client';

import React, { useEffect, useState } from 'react';
import { CanvasPreview } from './CanvasPreview';
import { ControlPanel } from './ControlPanel';
import { Header } from './Header';
import { ToastContainer } from './Toast';
import { UploadInput } from './UploadZone';
import { exportCompositeImage } from '@/lib/canvasRenderer';
import { DEFAULT_TRANSFORM, FRAME_ASSET_PATH, TRANSFORM_LIMITS } from '@/lib/constants';
import { loadImageFromUrl, loadUserImage } from '@/lib/imageUtils';
import { OutputFormat, ToastMessage, TransformState, UserImageInfo } from '@/types';

export const FrameEditor: React.FC = () => {
  // Master image states
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [userImage, setUserImage] = useState<UserImageInfo | null>(null);

  // Transform controls
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);

  // Export settings
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [jpegQuality, setJpegQuality] = useState<number>(TRANSFORM_LIMITS.jpegQuality.default);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // UI notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'error' | 'success' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerFileInput = () => {
    document.getElementById('photo-upload-input')?.click();
  };

  // Load Frame.png on initial mount
  useEffect(() => {
    loadImageFromUrl(FRAME_ASSET_PATH)
      .then((img) => {
        setFrameImage(img);
      })
      .catch((err) => {
        console.error('Failed to load Frame.png:', err);
        addToast(
          'error',
          'Failed to load the ASUS frame asset. Please verify /public/Frame.png is present.'
        );
      });
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (userImage?.objectUrl) {
        URL.revokeObjectURL(userImage.objectUrl);
      }
    };
  }, [userImage]);

  // Handle new photo selection
  const handleFileSelected = async (file: File) => {
    try {
      // Clean up previous image if exists
      if (userImage?.objectUrl) {
        URL.revokeObjectURL(userImage.objectUrl);
      }

      const loadedInfo = await loadUserImage(file);
      setUserImage(loadedInfo);
      setTransform(DEFAULT_TRANSFORM);
      addToast('success', 'Photo loaded. Drag or adjust sliders to position.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load photo.';
      addToast('error', msg);
    }
  };

  const handleTransformChange = (updates: Partial<TransformState>) => {
    setTransform((prev) => ({ ...prev, ...updates }));
  };

  const handleResetPosition = () => {
    setTransform((prev) => ({ ...prev, panX: 0, panY: 0 }));
    addToast('info', 'Position centered.');
  };

  const handleResetAdjustments = () => {
    setTransform(DEFAULT_TRANSFORM);
    addToast('info', 'Adjustments reset to defaults.');
  };

  const handleFullReset = () => {
    if (userImage?.objectUrl) {
      URL.revokeObjectURL(userImage.objectUrl);
    }
    setUserImage(null);
    setTransform(DEFAULT_TRANSFORM);
    addToast('info', 'Canvas reset to initial state.');
  };

  const handleDownload = async () => {
    if (!frameImage) {
      addToast('error', 'Frame image is not yet loaded.');
      return;
    }

    try {
      setIsExporting(true);
      await exportCompositeImage({
        userImage,
        frameImage,
        transform,
        format: outputFormat,
        jpegQuality: jpegQuality / 100,
      });
      addToast('success', `Export complete! Downloaded 1254×1254 ${outputFormat.toUpperCase()}.`);
    } catch (err: unknown) {
      console.error('Export error:', err);
      addToast('error', 'Something went wrong during export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080a] text-zinc-100 selection:bg-cyan-500/30 selection:text-white">
      <UploadInput
        onFileSelected={handleFileSelected}
        onError={(msg) => addToast('error', msg)}
      />

      <Header hasImage={!!userImage} onReset={handleFullReset} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center">
        {/* Top Subtitle / Product Brief */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-1 block">
            ASUS ExpertBook Ultra
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Official Event Frame Generator
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Seamlessly place and align your portrait behind the ASUS ExpertBook Ultra
            frame artwork. All compositing happens privately on your device.
          </p>
        </div>

        {/* Desktop 2-Column / Mobile Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center">
          {/* LEFT: Square Preview Canvas */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <CanvasPreview
              userImage={userImage}
              frameImage={frameImage}
              transform={transform}
              onTransformChange={handleTransformChange}
              onFileDrop={handleFileSelected}
              onError={(msg) => addToast('error', msg)}
              onTriggerUpload={triggerFileInput}
            />
          </div>

          {/* RIGHT: Control Panel */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <ControlPanel
              userImage={userImage}
              transform={transform}
              outputFormat={outputFormat}
              jpegQuality={jpegQuality}
              isExporting={isExporting}
              onTransformChange={handleTransformChange}
              onResetPosition={handleResetPosition}
              onResetAdjustments={handleResetAdjustments}
              onFormatChange={setOutputFormat}
              onQualityChange={setJpegQuality}
              onTriggerUpload={triggerFileInput}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.05] py-4 mt-12 bg-[#050608] text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© ASUS ExpertBook Ultra Frame Studio. All rights reserved.</p>
          <p className="text-[11px] text-zinc-400">
            1254 × 1254 Native Canvas • Zero Cloud Uploads • 100% Client-Side
          </p>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
