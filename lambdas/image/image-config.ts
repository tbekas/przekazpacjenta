interface ThumbnailParams {
  width: number;
  height: number;
  quality: number;
  label: string;
}

export const thumbnails: ThumbnailParams[] = [
  { width: 64, height: 64, quality: 80, label: '64x64' },
  { width: 128, height: 128, quality: 80, label: '128x128' },
  { width: 256, height: 256, quality: 90, label: '256x256' },
  { width: 512, height: 512, quality: 90, label: '512x512' },
];

export const hires = {
  maxWidth: 3840,
  maxHeight: 2160,
  quality: 95,
  label: 'hires',
};
