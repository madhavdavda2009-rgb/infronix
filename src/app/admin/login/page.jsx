"use client";
import { Warning } from "@phosphor-icons/react";
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
        showToast('Signed in successfully', 'success');
        router.push('/admin');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Invalid ID or Password.');
        setError(friendlyMsg);
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Connection error. Please try again.');
      setError(friendlyMsg);
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Sign In | InfronixWeb" description="Executive Portal Sign In" />
      <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-xl">
          {/* Exact Logo for light background */}
          <div className="flex justify-center mb-6">
            <img
              src="/light-web-logo.png"
              alt="InfronixWeb"
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-lg font-light text-slate-900 font-outfit tracking-tight">Founder OS Portal</h1>
            <p className="text-xs text-slate-500 mt-1 font-light">Sign in with executive credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-violet-50 border border-violet-200 text-violet-900 text-xs rounded-xl flex items-center gap-2">
              <Warning className="text-violet-600 text-sm shrink-0" weight="duotone" />
              <span className="font-normal">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin-id" className="block text-[11px] font-normal text-slate-700 uppercase tracking-wider mb-1.5">
                ID / Username
              </label>
              <input
                id="admin-id"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-light"
                placeholder="Enter ID"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-[11px] font-normal text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-light"
                placeholder="Enter Password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full min-h-[44px] bg-violet-600 hover:bg-violet-700 text-white font-normal uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In to Founder OS</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
