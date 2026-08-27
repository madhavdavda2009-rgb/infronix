"use client";
import { Warning, X, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite" 
        className="fixed top-24 right-4 md:right-8 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 shadow-2xl border backdrop-blur-md transform transition-all duration-300 animate-slide-in rounded-none ${
              toast.type === 'error'
                ? 'bg-red-950/95 border-red-500/50 text-red-100'
                : toast.type === 'warning'
                ? 'bg-navy-muted/95 border-secondary/60 text-champagne-light shadow-2xl border-l-4 border-l-secondary'
                : 'bg-navy-muted/95 border-champagne-light/50 text-champagne-light'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'error' ? <WarningCircle className="text-xl mt-0.5" /> : toast.type === 'warning' ? <Warning className="text-xl mt-0.5" /> : <CheckCircle className="text-xl mt-0.5" />}
              <div className="font-body-md text-sm leading-snug">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-outline-variant hover:text-surface transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="text-lg" weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
