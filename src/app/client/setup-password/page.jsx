"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockSimple, CheckCircle, Warning, ArrowRight } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

function SetupPasswordContent() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    // 1. Read token from URL hash (preferred) or query parameter
    let extractedToken = '';
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.includes('token=')) {
        const match = hash.match(/token=([a-zA-Z0-9_-]+)/);
        if (match) extractedToken = match[1];
      }

      if (!extractedToken) {
        extractedToken = searchParams?.get('token') || '';
      }

      if (extractedToken) {
        setToken(extractedToken);
        // Clean token from address bar for security
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      setError('Setup token is missing. Please use the original invitation link provided in your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try setup-password first, fallback to reset-password
      let res = await fetch('/api/client/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      let data = await res.json();

      if (!res.ok || !data.success) {
        // Try reset-password
        res = await fetch('/api/client/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword })
        });
        data = await res.json();
      }

      if (res.ok && data.success) {
        setSuccess(true);
        showToast('Password configured successfully! Welcome.', 'success');
        setTimeout(() => {
          router.push(data.redirectTo || '/client/dashboard');
        }, 1200);
      } else {
        setError(data.error || 'Failed to setup password. The link may have expired.');
        showToast(data.error || 'Setup failed', 'error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="relative z-10 w-full max-w-sm bg-white p-6 sm:p-8 border border-slate-200 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <img
            src="/light-web-logo.webp"
            alt="InfronixWeb"
            width={160}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            className="h-9 w-auto object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200 mb-2">
            <LockSimple size={13} weight="bold" />
            Security Setup
          </div>
          <h1 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">Create Portal Password</h1>
          <p className="text-xs text-slate-500 mt-1">Set up your secure credentials for the Client Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
            <Warning className="text-rose-600 text-sm shrink-0 mt-0.5" weight="duotone" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs text-center space-y-2">
            <CheckCircle size={32} weight="fill" className="text-emerald-600 mx-auto" />
            <p className="font-bold text-xs">Password Set Successfully!</p>
            <p className="text-[11px] text-emerald-800">Redirecting to your project dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="setup-new-password" className="block font-semibold text-slate-700 mb-1.5">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="setup-new-password"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="setup-confirm-password" className="block font-semibold text-slate-700 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="setup-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Password & Enter Portal</span>
                  <ArrowRight size={14} weight="bold" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function SetupPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SetupPasswordContent />
    </React.Suspense>
  );
}
