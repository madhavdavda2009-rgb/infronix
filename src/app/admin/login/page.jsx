"use client";
import { Warning, LockSimple, Clock } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';

const LS_KEY = 'infronix_admin_login_attempts';
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

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [lockedText, setLockedText] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  const { showToast } = useToast();
  const router = useRouter();

  // Check lockout state on mount and set up countdown
  useEffect(() => {
    function refreshState() {
      const state = getAttemptState();
      if (isLockedOut(state)) {
        setLocked(true);
        setLockedText(getLockRemainingText(state.lockedUntil));
        setAttemptsLeft(0);
      } else {
        // Lock expired — reset
        if (state.lockedUntil && Date.now() >= state.lockedUntil) {
          clearAttempts();
        }
        setLocked(false);
        setAttemptsLeft(Math.max(0, MAX_ATTEMPTS - state.count));
      }
    }
    refreshState();
    const interval = setInterval(refreshState, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    // Re-check lockout on every submission
    const state = getAttemptState();
    if (isLockedOut(state)) {
      setLocked(true);
      setLockedText(getLockRemainingText(state.lockedUntil));
      return;
    }

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
        clearAttempts();
        showToast('Signed in successfully', 'success');
        router.push('/admin');
      } else {
        // Record failed attempt
        const newState = recordFailedAttempt();
        const remaining = Math.max(0, MAX_ATTEMPTS - newState.count);

        if (newState.lockedUntil && Date.now() < newState.lockedUntil) {
          setLocked(true);
          setLockedText(getLockRemainingText(newState.lockedUntil));
          setAttemptsLeft(0);
          const msg = `Too many failed attempts. Access locked for 1 hour.`;
          setError(msg);
          showToast(msg, 'error');
        } else {
          setAttemptsLeft(remaining);
          const friendlyMsg = getFriendlyErrorMessage(data.error, 'Invalid ID or Password.');
          const attemptMsg = remaining > 0 
            ? `${friendlyMsg} ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` 
            : friendlyMsg;
          setError(attemptMsg);
          showToast(friendlyMsg, 'error');
        }
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
      <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-xl">
          {/* Exact Logo for light background */}
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
            <h1 className="text-lg font-light text-slate-900 font-outfit tracking-tight">Founder OS Portal</h1>
            <p className="text-xs text-slate-500 mt-1 font-light">Sign in with executive credentials</p>
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

          {/* Error Banner */}
          {error && !locked && (
            <div className="mb-4 p-3 bg-violet-50 border border-violet-200 text-violet-900 text-xs rounded-xl flex items-center gap-2">
              <Warning className="text-violet-600 text-sm shrink-0" weight="duotone" />
              <span className="font-normal">{error}</span>
            </div>
          )}

          {/* Attempts remaining warning */}
          {!locked && attemptsLeft < MAX_ATTEMPTS && attemptsLeft > 0 && (
            <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
              <Clock size={13} className="text-amber-600 shrink-0" weight="bold" />
              <span>{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left before 1-hour lockout</span>
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
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter ID"
                required
                disabled={locked}
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
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors placeholder:text-slate-400 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter Password"
                required
                disabled={locked}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || locked}
              className="mt-2 w-full min-h-[44px] bg-violet-600 hover:bg-violet-700 text-white font-normal uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : locked ? (
                <>
                  <LockSimple size={14} weight="fill" />
                  <span>Account Locked</span>
                </>
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
