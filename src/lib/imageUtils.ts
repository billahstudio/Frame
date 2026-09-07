import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  FRAME_GEOMETRY,
  MAX_FILE_SIZE_BYTES,
} from './constants';
import { UserImageInfo } from '@/types';

/**
 * Validates the uploaded file type and size.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image size must be 20MB or smaller.',
    };
  }

  // Check MIME type or extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType =
    ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase()) ||
    ACCEPTED_EXTENSIONS.includes(extension);

  if (!isValidType) {
    return {
      valid: false,
      error: 'Please upload a JPG, PNG, or WEBP image.',
    };
  }

  return { valid: true };
}

/**
 * Loads a File into an HTMLImageElement and computes its initial cover scale.
 */
export function loadUserImage(file: File): Promise<UserImageInfo> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width === 0 || height === 0) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Invalid image dimensions.'));
        return;
      }

      // "Cover" fit: scaled so the minimum dimension covers the circular aperture diameter (1014px)
      const scaleX = FRAME_GEOMETRY.diameter / width;
      const scaleY = FRAME_GEOMETRY.diameter / height;
      const baseCoverScale = Math.max(scaleX, scaleY);

      resolve({
        file,
        objectUrl,
        imgElement: img,
        width,
        height,
        baseCoverScale,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Something went wrong while processing your image. Please try again.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Loads an image from a URL source with promise wrapping.
 */
export function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from: ${src}`));
    img.src = src;
  });
}

/**
 * Formats bytes into human readable format (e.g. 3.4 MB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
