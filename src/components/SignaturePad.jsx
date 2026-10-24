"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowCounterClockwise, UploadSimple } from '@phosphor-icons/react';

const INK = '#0B0D12';

/** Crops transparent margins so the saved signature sits tightly in its box. */
function trimmedDataUrl(canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const pixels = ctx.getImageData(0, 0, width, height).data;
  let top = height, left = width, right = 0, bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] > 0) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < left) return '';
  const pad = 12;
  left = Math.max(left - pad, 0);
  top = Math.max(top - pad, 0);
  right = Math.min(right + pad, width);
  bottom = Math.min(bottom + pad, height);
  const out = document.createElement('canvas');
  out.width = right - left;
  out.height = bottom - top;
  out.getContext('2d').drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height);
  return out.toDataURL('image/png');
}

/**
 * Draw-your-signature pad. Calls onChange(dataUrl) after each stroke ('' when cleared).
 * allowUpload lets the user pick a PNG/JPG of their signature instead.
 */
export default function SignaturePad({ value = '', onChange, height = 160, allowUpload = false, disabled = false }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = INK;
    if (value) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min((rect.width - 24) / img.width, (height - 24) / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (rect.width - w) / 2, (height - h) / 2, w, h);
      };
      img.src = value;
    }
  }, [height]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  function point(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, p: e.pressure || 0.5 };
  }

  function start(e) {
    if (disabled) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  }

  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = point(e);
    const prev = last.current;
    const speed = Math.hypot(p.x - prev.x, p.y - prev.y);
    ctx.lineWidth = Math.max(1.4, Math.min(3.2, 3.4 - speed * 0.08)) * (e.pointerType === 'pen' ? p.p * 1.6 : 1);
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    const url = trimmedDataUrl(canvasRef.current);
    setIsEmpty(!url);
    onChange?.(url);
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.('');
  }

  function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !/^image\/(png|jpeg)$/.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Re-encode at a sensible size so stored signatures stay small.
        const scale = Math.min(600 / img.width, 200 / img.height, 1);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const url = c.toDataURL('image/png');
        clear();
        const ctx = canvasRef.current.getContext('2d');
        const rect = canvasRef.current.getBoundingClientRect();
        const s = Math.min((rect.width - 24) / c.width, (height - 24) / c.height, 1);
        ctx.drawImage(c, (rect.width - c.width * s) / 2, (height - c.height * s) / 2, c.width * s, c.height * s);
        setIsEmpty(false);
        onChange?.(url);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="relative rounded-xl border-2 border-dashed border-violet-200 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{ height, width: '100%', touchAction: 'none', cursor: disabled ? 'not-allowed' : 'crosshair', display: 'block' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
        <div className="pointer-events-none absolute left-6 right-6 bottom-9 border-b border-slate-300" />
        {isEmpty && (
          <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs text-slate-400">
            Sign here with your mouse, finger or stylus
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        {allowUpload ? (
          <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-700 cursor-pointer">
            <UploadSimple size={13} weight="bold" /> Upload image instead
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={upload} disabled={disabled} />
          </label>
        ) : <span />}
        <button type="button" onClick={clear} disabled={disabled} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">
          <ArrowCounterClockwise size={13} weight="bold" /> Clear
        </button>
      </div>
    </div>
  );
}
