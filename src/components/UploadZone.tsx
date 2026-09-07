'use client';

import React from 'react';
import { ACCEPTED_EXTENSIONS } from '@/lib/constants';
import { validateImageFile } from '@/lib/imageUtils';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  onError: (errorMsg: string) => void;
}

export const UploadInput: React.FC<UploadZoneProps> = ({
  onFileSelected,
  onError,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file.');
      e.target.value = '';
      return;
    }

    onFileSelected(file);
    e.target.value = '';
  };

  return (
    <input
      id="photo-upload-input"
      type="file"
      accept={ACCEPTED_EXTENSIONS.join(',')}
      onChange={handleFileChange}
      className="sr-only"
      aria-label="Upload photo file input"
    />
  );
};
