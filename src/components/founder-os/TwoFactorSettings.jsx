"use client";
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Copy, DownloadSimple, Warning } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

const inputClass = 'w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20';
const primaryBtn = 'w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50';
const darkBtn = 'w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50';
const ghostBtn = 'w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50';

async function call2fa(body) {
  const res = await fetch('/api/admin/2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

function BackupCodes({ codes, onDone }) {
  const { showToast } = useToast();
  const text = codes.join('\n');

  function copy() {
    navigator.clipboard?.writeText(text).then(() => showToast('Backup codes copied', 'success'));
  }

  function download() {
    const blob = new Blob([`InfronixWeb Founder OS - backup codes\nEach code works once.\n\n${text}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infronixweb-founder-os-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
        <Warning size={16} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
        <p className="text-[11px] leading-relaxed">
          Save these backup codes somewhere safe (not on the same phone). If you lose your phone, each code lets you sign in once. They will not be shown again.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-900">
        {codes.map(code => <span key={code}>{code}</span>)}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <button type="button" onClick={copy} className={ghostBtn}><span className="inline-flex items-center gap-1.5"><Copy size={14} /> Copy</span></button>
        <button type="button" onClick={download} className={ghostBtn}><span className="inline-flex items-center gap-1.5"><DownloadSimple size={14} /> Download</span></button>
        <button type="button" onClick={onDone} className={primaryBtn}>I have saved them</button>
      </div>
    </div>
  );
}

export default function TwoFactorSettings() {
  const { showToast } = useToast();
  const [status, setStatus] = useState(null); // { enabled, backup_codes_left }
  const [setup, setSetup] = useState(null); // { secret, otpauth_uri }
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState(null); // 'disable' | 'regenerate'
  const [backupCodes, setBackupCodes] = useState(null);
  const [busy, setBusy] = useState(false);

  async function loadStatus() {
    try {
      const res = await fetch('/api/admin/2fa', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setStatus(data);
    } catch {
      setStatus({ enabled: false, error: true });
    }
  }

  useEffect(() => { loadStatus(); }, []);

  async function run(body, onSuccess) {
    setBusy(true);
    try {
      const data = await call2fa(body);
      if (data.success) onSuccess(data);
      else showToast(data.error || 'Something went wrong', 'error');
    } catch {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  }

  function startSetup() {
    run({ action: 'start' }, data => { setSetup(data); setCode(''); });
  }

  function confirmSetup(e) {
    e.preventDefault();
    run({ action: 'enable', code }, data => {
      setSetup(null);
      setCode('');
      setBackupCodes(data.backup_codes);
      showToast('Google Authenticator is now on', 'success');
      loadStatus();
    });
  }

  function submitManage(e) {
    e.preventDefault();
    if (mode === 'disable') {
      run({ action: 'disable', code, password }, () => {
        setMode(null); setCode(''); setPassword('');
        showToast('Two-step login switched off', 'success');
        loadStatus();
      });
    } else {
      run({ action: 'regenerate', code }, data => {
        setMode(null); setCode('');
        setBackupCodes(data.backup_codes);
        loadStatus();
      });
    }
  }

  const codeInput = (
    <input
      value={code}
      onChange={(e) => setCode(mode === 'disable' ? e.target.value.slice(0, 12) : e.target.value.replace(/\D/g, '').slice(0, 6))}
      required
      inputMode={mode === 'disable' ? 'text' : 'numeric'}
      autoComplete="one-time-code"
      placeholder={mode === 'disable' ? '6-digit code or backup code' : '6-digit code'}
      className={`${inputClass} tracking-widest`}
    />
  );

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-violet-600" weight="bold" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">Google Authenticator (2-Step Login)</h3>
        </div>
        {status && (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
            {status.enabled ? 'On' : 'Off'}
          </span>
        )}
      </div>

      {!status && <p className="text-slate-500">Loading...</p>}

      {backupCodes && <BackupCodes codes={backupCodes} onDone={() => setBackupCodes(null)} />}

      {status && !backupCodes && !status.enabled && !setup && (
        <div className="space-y-3">
          <p className="text-slate-600 leading-relaxed">
            Add a second step to Founder OS sign-in. After your password, you will also enter a 6-digit code from the Google Authenticator app on your phone, so a stolen password alone cannot open your account.
          </p>
          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button type="button" onClick={startSetup} disabled={busy} className={primaryBtn}>
              {busy ? 'Preparing...' : 'Set up Google Authenticator'}
            </button>
          </div>
        </div>
      )}

      {setup && !backupCodes && (
        <form onSubmit={confirmSetup} className="space-y-4">
          <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
            <li>Install <strong>Google Authenticator</strong> on your phone.</li>
            <li>Tap <strong>+</strong> and choose <strong>Scan a QR code</strong>, then scan the code below.</li>
            <li>Enter the 6-digit code the app shows to finish.</li>
          </ol>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <QRCodeSVG value={setup.otpauth_uri} size={168} level="M" />
            </div>
            <div className="min-w-0 w-full">
              <span className="text-slate-500 block mb-1 font-medium">Can't scan? Enter this key in the app:</span>
              <code className="block break-all font-mono text-sm text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 select-all">
                {setup.secret.match(/.{1,4}/g).join(' ')}
              </code>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Code from the app *</label>
            {codeInput}
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-3 border-t border-slate-200">
            <button type="button" onClick={() => { setSetup(null); setCode(''); }} className={ghostBtn}>Cancel</button>
            <button type="submit" disabled={busy || code.length !== 6} className={primaryBtn}>
              {busy ? 'Checking...' : 'Turn On'}
            </button>
          </div>
        </form>
      )}

      {status?.enabled && !backupCodes && !mode && (
        <div className="space-y-3">
          <p className="text-slate-600 leading-relaxed">
            Sign-in asks for a code from Google Authenticator. Backup codes left: <strong className="text-slate-900">{status.backup_codes_left}</strong>
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-3 border-t border-slate-200">
            <button type="button" onClick={() => { setMode('disable'); setCode(''); }} className={ghostBtn}>Turn Off</button>
            <button type="button" onClick={() => { setMode('regenerate'); setCode(''); }} className={darkBtn}>New Backup Codes</button>
          </div>
        </div>
      )}

      {status?.enabled && !backupCodes && mode && (
        <form onSubmit={submitManage} className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            {mode === 'disable'
              ? 'To switch off two-step login, confirm your password and a current code.'
              : 'Enter a current code from the app. Your old backup codes will stop working.'}
          </p>
          {mode === 'disable' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputClass} />
            </div>
          )}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Code *</label>
            {codeInput}
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-3 border-t border-slate-200">
            <button type="button" onClick={() => { setMode(null); setCode(''); setPassword(''); }} className={ghostBtn}>Cancel</button>
            <button type="submit" disabled={busy} className={mode === 'disable' ? darkBtn : primaryBtn}>
              {busy ? 'Checking...' : mode === 'disable' ? 'Turn Off 2-Step Login' : 'Create New Codes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
