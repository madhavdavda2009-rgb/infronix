"use client";
import React, { useState } from 'react';
import { Buildings, LockKey, Database } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

export default function SettingsModule({ settings = {}, currentUser = {}, onRefreshDashboard }) {
  const [businessName, setBusinessName] = useState(settings.business_name || 'InfronixWeb');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol || '₹');
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Kolkata');
  const [savingBusiness, setSavingBusiness] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const { showToast } = useToast();

  async function handleSaveBusiness(e) {
    e.preventDefault();
    setSavingBusiness(true);
    try {
      const res = await fetch('/api/founder-os/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          currency_symbol: currencySymbol,
          timezone: timezone
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Business settings updated successfully', 'success');
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to update settings', 'error');
      }
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setSavingBusiness(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      showToast('Error updating password', 'error');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* 1. Business Profile Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <Buildings size={20} className="text-violet-600" weight="bold" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">
            Agency Business Profile
          </h3>
        </div>

        <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Business / Agency Name</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Primary Currency Symbol</label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="₹">₹ (Indian Rupee - INR)</option>
                <option value="$">$ (US Dollar - USD)</option>
                <option value="€">€ (Euro - EUR)</option>
                <option value="£">£ (British Pound - GBP)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Default Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST - UTC+4)</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={savingBusiness}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingBusiness ? 'Saving...' : 'Save Business Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Authentication & Password Security */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <LockKey size={20} className="text-violet-600" weight="bold" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">
            Master Authentication & Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Current Password *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current master password"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Re-enter new password"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Database & Engine Status */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <Database size={20} className="text-violet-600" weight="bold" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">
            Database Engine & Connection Health
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-0.5 font-medium">Database Provider</span>
            <span className="font-bold text-slate-900">Supabase PostgreSQL</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-0.5 font-medium">Connection Mode</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Pooler Connected</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block mb-0.5 font-medium">Region</span>
            <span className="font-bold text-slate-900">ap-south-1 (Mumbai / India)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
