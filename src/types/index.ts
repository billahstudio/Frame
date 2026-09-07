export type OutputFormat = 'png' | 'jpeg';

export interface TransformState {
  zoom: number; // 0.2 to 4.0 (multiplier relative to base cover scale)
  panX: number; // in native canvas pixels (-600 to 600)
  panY: number; // in native canvas pixels (-600 to 600)
  rotation: number; // in degrees (-180 to 180)
}

export interface UserImageInfo {
  file: File;
  objectUrl: string;
  imgElement: HTMLImageElement;
  width: number;
  height: number;
  baseCoverScale: number; // scale that fits the 1014px circle aperture
}

export interface FrameGeometry {
  canvasWidth: number;
  canvasHeight: number;
  centerX: number;
  centerY: number;
  radius: number;
  diameter: number;
}

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'info';
  message: string;
}
