"use client";
import React from 'react';
import { Plus, Tray, ArrowRight } from '@phosphor-icons/react';

export default function EmptyState({
  icon: Icon = Tray,
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 my-4 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4 shadow-xs">
        <Icon size={28} weight="duotone" className="text-violet-600" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1.5 tracking-tight font-outfit">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm shadow-violet-600/20 cursor-pointer active:scale-98 min-h-[42px]"
          >
            <Plus size={15} weight="bold" />
            <span>{actionLabel}</span>
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs tracking-wider uppercase transition-all border border-slate-200 shadow-xs cursor-pointer active:scale-98 min-h-[42px]"
          >
            <span>{secondaryActionLabel}</span>
            <ArrowRight size={14} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
