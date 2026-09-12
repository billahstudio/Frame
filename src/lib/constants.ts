import { FrameGeometry, TransformState } from '@/types';

/**
 * Exact geometric constants determined from pixel-level programmatic inspection of Frame.png:
 * - Canvas dimensions: 1024 x 1024
 * - Central circular transparent window:
 *   - Center: (506, 445)
 *   - Radius: 351px (diameter: 702px)
 *   - Transparent bounds: x in [152, 860], y in [99, 786] (with bottom-right covered by laptop artwork)
 */
export const FRAME_GEOMETRY: FrameGeometry = {
  canvasWidth: 1024,
  canvasHeight: 1024,
  centerX: 506,
  centerY: 445,
  radius: 351,
  diameter: 702,
};

export const DEFAULT_TRANSFORM: TransformState = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
  rotation: 0,
};

export const TRANSFORM_LIMITS = {
  zoom: { min: 0.3, max: 3.5, step: 0.01 },
  panX: { min: -700, max: 700, step: 1 },
  panY: { min: -700, max: 700, step: 1 },
  rotation: { min: -180, max: 180, step: 1 },
  jpegQuality: { min: 60, max: 100, step: 1, default: 95 },
};

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const FRAME_ASSET_PATH = '/Frame.png';
