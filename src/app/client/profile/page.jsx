"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientPortalShell from '@/components/client-portal/ClientPortalShell';
import { User, LockSimple, ShieldCheck, CheckCircle, Warning } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

function ProfileContent() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    role_title: '',
    public_client_id: '',
    must_change_password: false
  });
  const [clientInfo, setClientInfo] = useState({ name: '', company: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const searchParams = useSearchParams();
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [adminPreviewClientId]);

  async function fetchProfile() {
    try {
      const headers = {};
      if (adminPreviewClientId) headers['x-admin-preview-client-id'] = adminPreviewClientId;
      const res = await fetch(`/api/client/me${adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : ''}`, { headers });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setClientInfo(data.client);
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          role_title: profile.role_title
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Profile updated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Network error while saving profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/client/profile/change-password', {
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
        setProfile(prev => ({ ...prev, must_change_password: false }));
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast('Network error while updating password', 'error');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <ClientPortalShell
      title="Profile & Security"
      subtitle="Manage your contact details and portal credentials"
      breadcrumbs={[{ label: 'Client Portal', href: '/client/dashboard' }, { label: 'Profile' }]}
    >
      <div className="max-w-3xl space-y-6">
        {/* Must change password alert */}
        {profile.must_change_password && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <Warning size={20} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-bold text-xs">Security Notice: Temporary Password Active</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                You are currently logged in with a temporary access credential. Please choose your permanent master password below.
              </p>
            </div>
          </div>
        )}

        {/* 1. Account Identity Summary */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <ShieldCheck size={18} weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-outfit">Portal Account Identity</h3>
              <p className="text-[11px] text-slate-500">Verified Client Representative Credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Public Client ID</span>
              <span className="font-mono font-bold text-violet-900 text-sm">{profile.public_client_id || 'IW-CLIENT'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Linked Client Organization</span>
              <span className="font-bold text-slate-800">{clientInfo.name} {clientInfo.company ? `(${clientInfo.company})` : ''}</span>
            </div>
          </div>
        </div>

        {/* 2. Contact Details Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <User size={18} weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-outfit">Contact Information</h3>
              <p className="text-[11px] text-slate-500">Update your name, designation, and phone number</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Designation / Role</label>
                <input
                  type="text"
                  value={profile.role_title || ''}
                  onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
                  placeholder="e.g. Managing Director"
                  className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile.email || ''}
                  className="w-full bg-slate-100 text-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email address is managed by your project lead</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-xs shadow-violet-600/20 disabled:opacity-50 cursor-pointer"
              >
                {savingProfile ? 'Saving...' : 'Save Contact Details'}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Password Security Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <LockSimple size={18} weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-outfit">Update Password</h3>
              <p className="text-[11px] text-slate-500">Ensure your portal account is protected with a strong password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-lg">
            {!profile.must_change_password && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-xs shadow-violet-600/20 disabled:opacity-50 cursor-pointer"
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientPortalShell>
  );
}

export default function ClientProfilePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </React.Suspense>
  );
}
