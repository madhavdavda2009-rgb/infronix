"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Warning, ArrowRight, LockSimple, Clock } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

const LS_KEY = 'infronix_client_login_attempts';
const MAX_ATTEMPTS = 3;
const LOCK_MS = 60 * 60 * 1000; // 1 hour

function getAttemptState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function isLockedOut(state) {
  return state.lockedUntil && Date.now() < state.lockedUntil;
}

function getLockRemainingText(lockedUntil) {
  if (!lockedUntil) return '';
  const remaining = lockedUntil - Date.now();
  if (remaining <= 0) return '';
  const mins = Math.ceil(remaining / 60000);
  return `${mins} minute${mins !== 1 ? 's' : ''}`;
}

function recordFailedAttempt() {
  const state = getAttemptState();
  const newCount = state.count + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : state.lockedUntil;
  localStorage.setItem(LS_KEY, JSON.stringify({ count: newCount, lockedUntil }));
  return { count: newCount, lockedUntil };
}

function clearAttempts() {
  localStorage.removeItem(LS_KEY);
}

export default function ClientLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [lockedText, setLockedText] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    function refreshState() {
      const state = getAttemptState();
      if (isLockedOut(state)) {
        setLocked(true);
        setLockedText(getLockRemainingText(state.lockedUntil));
        setAttemptsLeft(0);
      } else {
        if (state.lockedUntil && Date.now() >= state.lockedUntil) {
          clearAttempts();
        }
        setLocked(false);
        setAttemptsLeft(Math.max(0, MAX_ATTEMPTS - state.count));
      }
    }
    refreshState();
    const interval = setInterval(refreshState, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const state = getAttemptState();
    if (isLockedOut(state)) {
      setLocked(true);
      setLockedText(getLockRemainingText(state.lockedUntil));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/client/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearAttempts();
        showToast('Signed in successfully', 'success');
        router.push(data.redirectTo || '/client/dashboard');
      } else {
        // Handle server-side lockout (429) separately
        if (res.status === 429) {
          setError(data.error || 'Too many attempts. Please try again later.');
          showToast(data.error || 'Too many attempts', 'error');
          return;
        }

        const newState = recordFailedAttempt();
        const remaining = Math.max(0, MAX_ATTEMPTS - newState.count);

        if (newState.lockedUntil && Date.now() < newState.lockedUntil) {
          setLocked(true);
          setLockedText(getLockRemainingText(newState.lockedUntil));
          setAttemptsLeft(0);
          const msg = 'Too many failed attempts. Access locked for 1 hour.';
          setError(msg);
          showToast(msg, 'error');
        } else {
          setAttemptsLeft(remaining);
          const errorMsg = data.error || 'Invalid Client ID/email or password.';
          const attemptMsg = remaining > 0
            ? `${errorMsg} ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
            : errorMsg;
          setError(attemptMsg);
          showToast(errorMsg, 'error');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = 'Connection error. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-violet-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm bg-white p-6 sm:p-8 border border-slate-200 rounded-3xl shadow-xl">
        {/* Logo */}
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

        <div className="text-center mb-5">
          <h1 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">Client Portal Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">Access your live project milestones &amp; staging preview</p>
        </div>

        {/* Lockout Banner */}
        {locked && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3">
            <LockSimple size={18} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="text-xs font-bold text-rose-800">Access Temporarily Locked</p>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                Too many failed attempts. Please try again in{' '}
                <strong>{lockedText || '60 minutes'}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !locked && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
            <Warning className="text-rose-600 text-sm shrink-0 mt-0.5" weight="duotone" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Attempts remaining warning */}
        {!locked && attemptsLeft < MAX_ATTEMPTS && attemptsLeft > 0 && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
            <Clock size={13} className="text-amber-600 shrink-0" weight="bold" />
            <span>{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left before 1-hour lockout</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label htmlFor="client-identifier" className="block font-semibold text-slate-700 mb-1.5">
              Client ID or Email Address
            </label>
            <div className="relative">
              <input
                id="client-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. IW-CL-7K9P2D or name@company.com"
                required
                disabled={locked}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-3.5 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="client-password" className="font-semibold text-slate-700">
                Password
              </label>
              <Link
                href="/client/forgot-password"
                className="text-[11px] text-violet-600 hover:text-violet-700 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="client-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={locked}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-3.5 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || locked}
            className="mt-2 w-full min-h-[44px] bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : locked ? (
              <>
                <LockSimple size={14} weight="fill" />
                <span>Account Locked</span>
              </>
            ) : (
              <>
                <span>Sign In to Client Portal</span>
                <ArrowRight size={14} weight="bold" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Need portal credentials? Contact your <strong className="text-slate-600">InfronixWeb</strong> project lead.
          </p>
        </div>
      </div>
    </main>
  );
}
