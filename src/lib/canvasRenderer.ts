import { FRAME_GEOMETRY } from './constants';
import { OutputFormat, TransformState, UserImageInfo } from '@/types';

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  userImage: UserImageInfo | null;
  frameImage: HTMLImageElement | null;
  transform: TransformState;
  showEmptyGuide?: boolean;
}

/**
 * High-fidelity rendering engine for both live preview and native export.
 * Renders into a 1254 x 1254 context.
 */
export function renderCompositedFrame({
  canvas,
  userImage,
  frameImage,
  transform,
}: RenderCanvasOptions): void {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const width = FRAME_GEOMETRY.canvasWidth;
  const height = FRAME_GEOMETRY.canvasHeight;

  // Always ensure canvas internal size is exactly 1254 x 1254
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // Configure high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clear existing buffer
  ctx.clearRect(0, 0, width, height);

  // 1. LAYER BOTTOM: User Photo (if available)
  if (userImage && userImage.imgElement) {
    ctx.save();

    // Clip strictly to the circular photo aperture
    // Radius is 507, centered at (618.5, 568.5)
    ctx.beginPath();
    ctx.arc(
      FRAME_GEOMETRY.centerX,
      FRAME_GEOMETRY.centerY,
      FRAME_GEOMETRY.radius,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    // Calculate effective scale combining base cover scale and user zoom
    const effectiveScale = userImage.baseCoverScale * transform.zoom;

    // Apply translations: center + user pan offsets
    ctx.translate(
      FRAME_GEOMETRY.centerX + transform.panX,
      FRAME_GEOMETRY.centerY + transform.panY
    );

    // Apply rotation around the center
    if (transform.rotation !== 0) {
      ctx.rotate((transform.rotation * Math.PI) / 180);
    }

    // Apply scaling
    ctx.scale(effectiveScale, effectiveScale);

    // Draw user image centered at origin
    ctx.drawImage(
      userImage.imgElement,
      -userImage.width / 2,
      -userImage.height / 2,
      userImage.width,
      userImage.height
    );

    ctx.restore();
  }

  // 2. LAYER TOP: ASUS Frame Overlay
  // Frame.png is rendered strictly at (0, 0, 1254, 1254)
  if (frameImage) {
    ctx.drawImage(frameImage, 0, 0, width, height);
  }
}

/**
 * Creates an offscreen 1254 x 1254 canvas, renders the final composition,
 * and triggers a native high-quality download.
 */
export async function exportCompositeImage({
  userImage,
  frameImage,
  transform,
  format,
  jpegQuality = 0.95,
}: {
  userImage: UserImageInfo | null;
  frameImage: HTMLImageElement | null;
  transform: TransformState;
  format: OutputFormat;
  jpegQuality?: number;
}): Promise<void> {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = FRAME_GEOMETRY.canvasWidth;
  exportCanvas.height = FRAME_GEOMETRY.canvasHeight;

  // Render composite
  renderCompositedFrame({
    canvas: exportCanvas,
    userImage,
    frameImage,
    transform,
  });

  // Timestamp formatting for filename: YYYYMMDD-HHmmss
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const filename = `ASUS-ExpertBook-Ultra-${timestamp}.${extension}`;

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob.'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke after a short delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        resolve();
      },
      mimeType,
      format === 'jpeg' ? jpegQuality : undefined
    );
  });
}
