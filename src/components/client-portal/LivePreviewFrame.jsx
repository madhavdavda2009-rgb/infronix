"use client";
import React, { useState } from 'react';
import { 
  Desktop, 
  DeviceTablet, 
  DeviceMobile, 
  ArrowSquareOut, 
  ArrowsClockwise, 
  ChatCircleText, 
  ShieldCheck, 
  Warning,
  Eye,
  Globe,
  Sparkle
} from '@phosphor-icons/react';

export default function LivePreviewFrame({
  projectId,
  previewUrl,
  previewLabel = 'Live Staging Preview',
  previewStatus = 'Available',
  previewInstructions = '',
  projectName = '',
  onOpenFeedback
}) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [useProxy, setUseProxy] = useState(true);
  const [iframeKey, setIframeKey] = useState(1);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const deviceWidths = {
    desktop: 'w-full max-w-full',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[375px] max-w-full'
  };

  const deviceHeights = {
    desktop: 'h-[680px]',
    tablet: 'h-[750px]',
    mobile: 'h-[667px]'
  };

  function handleReload() {
    setIframeLoaded(false);
    setIframeError(false);
    setIframeKey(k => k + 1);
  }

  // Active iframe source: if proxy enabled and projectId available, use preview-proxy
  const activeSrc = (useProxy && projectId)
    ? `/api/client/projects/${projectId}/preview-proxy`
    : previewUrl;

  if (!previewUrl || previewStatus === 'Not Available' || previewStatus === 'Preparing') {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center">
        <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-100 shadow-2xs">
          <Eye size={28} weight="duotone" />
        </div>
        <h3 className="text-base font-bold text-slate-900 font-outfit mb-1">
          {previewStatus === 'Preparing' ? 'Staging Preview is Being Prepared' : 'Live Preview Not Active Yet'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          {previewInstructions || 'Our engineering team is actively developing and testing this project. Once the staging build passes QA validation, your interactive preview will be enabled right here.'}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Status: {previewStatus}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col space-y-0">
      {/* Top Bar Controls */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Preview Title & Verified Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck size={14} className="text-emerald-600" weight="fill" />
            <span>Secure Staging</span>
          </div>
          <span className="text-xs font-bold text-slate-800 font-outfit hidden sm:inline">
            {previewLabel}
          </span>
        </div>

        {/* Center: Responsive Device Switcher & Mode */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl gap-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-white text-violet-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Desktop View (Full Width)"
            >
              <Desktop size={15} weight={deviceMode === 'desktop' ? 'bold' : 'regular'} />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'tablet'
                  ? 'bg-white text-violet-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tablet View (768px)"
            >
              <DeviceTablet size={15} weight={deviceMode === 'tablet' ? 'bold' : 'regular'} />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-white text-violet-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile View (375px)"
            >
              <DeviceMobile size={15} weight={deviceMode === 'mobile' ? 'bold' : 'regular'} />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (Reload, Open in New Tab, Submit Feedback) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Reload Preview Frame"
          >
            <ArrowsClockwise size={16} weight="bold" />
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
            title="Open live preview in new browser tab"
          >
            <span>Open in New Tab</span>
            <ArrowSquareOut size={14} weight="bold" />
          </a>

          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs shadow-violet-600/20 cursor-pointer"
            >
              <ChatCircleText size={15} weight="bold" />
              <span>Submit Feedback</span>
            </button>
          )}
        </div>
      </div>

      {/* Instructions banner if present */}
      {previewInstructions && (
        <div className="px-4 py-2 bg-violet-50/70 border-b border-violet-100 text-[11px] text-violet-900 flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 bg-violet-200/60 rounded text-violet-800">
            Guide
          </span>
          <span>{previewInstructions}</span>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 bg-slate-900/5 p-4 sm:p-6 flex items-center justify-center min-h-[520px] overflow-auto">
        <div className={`transition-all duration-300 mx-auto ${deviceWidths[deviceMode]} ${deviceHeights[deviceMode]} bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden relative flex flex-col`}>
          {/* Simulated Browser URL bar */}
          <div className="h-9 bg-slate-100 border-b border-slate-200 px-3 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>

            <div className="flex-1 max-w-sm bg-white border border-slate-200 rounded-lg px-2.5 py-0.5 text-[10px] text-slate-600 font-mono truncate text-center flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600 shrink-0" weight="fill" />
              <span className="truncate">{previewUrl}</span>
            </div>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors"
              title="Launch in New Tab"
            >
              <ArrowSquareOut size={13} weight="bold" />
            </a>
          </div>

          {/* Loading Indicator */}
          {!iframeLoaded && !iframeError && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2.5 text-center p-6">
                <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-700 font-semibold font-outfit">Connecting to staging preview...</span>
                <span className="text-[11px] text-slate-400">Loading interactive sandbox</span>
              </div>
            </div>
          )}

          {/* Fallback Display if Iframe Error occurs */}
          {iframeError ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 text-center">
              <div className="max-w-md space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                  <Globe size={24} weight="duotone" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-outfit">
                  Staging Server Frame Restrictions Detected
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The staging deployment host enforces browser frame restrictions (<code>X-Frame-Options</code>). You can launch and test the full live staging website directly in a new tab:
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20"
                >
                  <span>Open {new URL(previewUrl).hostname}</span>
                  <ArrowSquareOut size={15} weight="bold" />
                </a>
              </div>
            </div>
          ) : (
            /* Main Iframe */
            <iframe
              key={iframeKey}
              src={activeSrc}
              title={`${projectName} Staging Preview`}
              className="w-full h-full border-0 flex-1 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              onLoad={() => setIframeLoaded(true)}
              onError={() => { setIframeError(true); setIframeLoaded(true); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
