export const DEFAULT_IMAGE_CROP = { x: 50, y: 50, zoom: 1 };

export function normalizeImageCrop(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...DEFAULT_IMAGE_CROP };
  return {
    x: Number.isFinite(Number(value.x)) ? Math.min(100, Math.max(0, Number(value.x))) : 50,
    y: Number.isFinite(Number(value.y)) ? Math.min(100, Math.max(0, Number(value.y))) : 50,
    zoom: Number.isFinite(Number(value.zoom)) ? Math.min(2.5, Math.max(1, Number(value.zoom))) : 1,
  };
}

export function imageCropStyle(value) {
  const crop = normalizeImageCrop(value);
  return { objectPosition: `${crop.x}% ${crop.y}%`, transform: `scale(${crop.zoom})`, transformOrigin: `${crop.x}% ${crop.y}%` };
}
