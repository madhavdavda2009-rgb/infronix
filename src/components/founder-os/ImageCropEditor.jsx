'use client';
import { DEFAULT_IMAGE_CROP, imageCropStyle, normalizeImageCrop } from '@/lib/image-crop';

export default function ImageCropEditor({ src, value, onChange }) {
  const crop = normalizeImageCrop(value);
  return <div className="mt-3 flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 p-3 bg-slate-50">
    <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg bg-slate-200">
      <img src={src} alt="Website photo framing preview" className="h-full w-full object-cover" style={imageCropStyle(crop)} />
    </div>
    <div className="flex-1 space-y-3 text-xs text-slate-700">
      <p className="font-semibold text-slate-900">Website photo framing</p>
      <p>Keep the face near the top third. This preview matches the website; save the profile to apply it.</p>
      {[['zoom', 'Zoom', 1, 2.5, 0.05], ['x', 'Horizontal position', 0, 100, 1], ['y', 'Vertical position', 0, 100, 1]].map(([key, label, min, max, step]) =>
        <label key={key} className="block">
          <span className="flex justify-between mb-1"><span>{label}</span><span>{key === 'zoom' ? `${crop[key].toFixed(2)}×` : `${crop[key]}%`}</span></span>
          <input aria-label={label} type="range" min={min} max={max} step={step} value={crop[key]} onChange={event => onChange({ ...crop, [key]: Number(event.target.value) })} className="w-full accent-violet-700 min-h-8" />
        </label>)}
      <button type="button" onClick={() => onChange({ ...DEFAULT_IMAGE_CROP })} className="py-2 font-semibold text-violet-700">Reset framing</button>
    </div>
  </div>;
}
