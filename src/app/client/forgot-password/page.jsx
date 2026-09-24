"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Envelope, CheckCircle, LockSimple, Clock } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

const LS_KEY = 'infronix_forgot_pw_attempts';
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

function recordAttempt() {
  const state = getAttemptState();
  const newCount = state.count + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : state.lockedUntil;
  localStorage.setItem(LS_KEY, JSON.stringify({ count: newCount, lockedUntil }));
  return { count: newCount, lockedUntil };
}

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [locked, setLocked] = useState(false);
  const [lockedText, setLockedText] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  const { showToast } = useToast();

  useEffect(() => {
    function refreshState() {
      const state = getAttemptState();
      if (isLockedOut(state)) {
        setLocked(true);
        setLockedText(getLockRemainingText(state.lockedUntil));
        setAttemptsLeft(0);
      } else {
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

    try {
      const res = await fetch('/api/client/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      const data = await res.json();

      // Record this attempt regardless (even on success — prevents enumeration + abuse)
      const newState = recordAttempt();
      const remaining = Math.max(0, MAX_ATTEMPTS - newState.count);

      if (newState.lockedUntil && Date.now() < newState.lockedUntil) {
        setLocked(true);
        setLockedText(getLockRemainingText(newState.lockedUntil));
        setAttemptsLeft(0);
      } else {
        setAttemptsLeft(remaining);
      }

      setSubmitted(true);
      setMessage(data.message || 'If an account matches your details, password reset instructions have been sent.');
      showToast('Password reset request processed', 'info');
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative font-sans">
      <div className="relative z-10 w-full max-w-sm bg-white p-6 sm:p-8 border border-slate-200 rounded-3xl shadow-xl">
        <Link
          href="/client/login"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Back to Sign In</span>
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-violet-100">
            <Envelope size={24} weight="duotone" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 font-outfit">Reset Portal Password</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your Client ID or verified email address</p>
        </div>

        {/* Lockout Banner */}
        {locked && !submitted && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3">
            <LockSimple size={18} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="text-xs font-bold text-rose-800">Too Many Requests</p>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                Maximum reset requests reached. Please try again in{' '}
                <strong>{lockedText || '60 minutes'}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Attempts remaining warning */}
        {!locked && !submitted && attemptsLeft < MAX_ATTEMPTS && attemptsLeft > 0 && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
            <Clock size={13} className="text-amber-600 shrink-0" weight="bold" />
            <span>{attemptsLeft} request{attemptsLeft !== 1 ? 's' : ''} remaining before temporary lockout</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs text-center space-y-2">
              <CheckCircle size={28} weight="fill" className="text-emerald-600 mx-auto" />
              <p className="font-semibold text-xs">Request Processed</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">{message}</p>
            </div>
            <Link
              href="/client/login"
              className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="reset-identifier" className="block font-semibold text-slate-700 mb-1.5">
                Client ID or Email
              </label>
              <input
                id="reset-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. IW-CL-7K9P2D or name@company.com"
                disabled={locked}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || locked}
              className="w-full min-h-[44px] bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : locked ? (
                <>
                  <LockSimple size={14} weight="fill" />
                  <span>Requests Locked</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
