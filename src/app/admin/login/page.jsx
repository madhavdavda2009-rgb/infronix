"use client";
import { Warning, LockOpen } from "@phosphor-icons/react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SEO from '@/components/SEO';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { showToast } = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        showToast('Authentication successful. Welcome to Admin Portal.', 'success');
        router.push('/admin');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Authentication failed. Please verify your credentials.');
        setError(friendlyMsg);
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Connection failed. Please ensure network connectivity.');
      setError(friendlyMsg);
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Admin Login" description="Secure Administrator Authentication Portal for Infronix Web Agency." />
      <main className="min-h-screen w-full bg-navy-muted flex items-center justify-center px-margin-mobile py-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-muted via-navy-muted/90 to-navy-muted/60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne-light/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md bg-surface-container-lowest p-8 md:p-10 border border-champagne-light/40 shadow-2xl">
          <div className="text-center mb-8 border-b border-outline-variant/30 pb-6">
            <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest block mb-2 font-bold">Restricted Portal</span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">Admin Portal</h1>
            <p className="font-body-md text-xs text-slate-700 font-semibold mt-2">
              Authorized personnel only. Credentials required.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-sm rounded-none flex items-center gap-3 font-medium">
              <Warning className="text-red-400 text-lg shrink-0" weight="bold" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Administrator login form">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-username" className="font-label-caps text-xs uppercase tracking-widest text-slate-800 font-bold">
                Username
              </label>
              <div className="relative">
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-champagne-light transition-colors font-medium placeholder:text-slate-500"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="font-label-caps text-xs uppercase tracking-widest text-slate-800 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-champagne-light transition-colors font-medium placeholder:text-slate-500"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-champagne-light text-navy-muted font-label-caps uppercase tracking-widest py-3.5 hover:bg-white transition-all shadow-md border border-champagne-light flex items-center justify-center gap-2 font-bold disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-muted border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LockOpen className="text-lg" weight="bold" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
            <span>Infronix Admin Panel</span>
          </div>
        </div>
      </main>
    </>
  );
}
