"use client";
import { Warning, ArrowsClockwise, Key, SignOut, MagnifyingGlass, Tray, Pencil, Trash, X } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SEO from '@/components/SEO';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { SkeletonTable } from '@/components/Skeleton';
import InvoiceModal from '@/components/admin/InvoiceModal';

export default function AdminDashboard() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [editingItem, setEditingItem] = useState(null);
  const [invoicingItem, setInvoicingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchConsultations();
  }, []);

  async function fetchConsultations() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/consultations');
      const data = await parseJsonResponse(response);
      
      if (response.ok && data.success) {
        setConsultations(data.data || []);
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Unable to retrieve consultations at this time.');
        setError(friendlyMsg);
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Unable to connect to service. Please check your internet connection.');
      setError(friendlyMsg);
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      showToast('Signed out successfully.', 'success');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/admin/login');
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingItem) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/consultations/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editingItem.firstName,
          lastName: editingItem.lastName,
          email: editingItem.email,
          company: editingItem.company,
          projectDetails: editingItem.projectDetails,
          status: editingItem.status
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        showToast('Consultation updated successfully.', 'success');
        setEditingItem(null);
        fetchConsultations();
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Unable to save consultation changes.');
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Unable to update consultation record.');
      showToast(friendlyMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/consultations/${deletingId}`, {
        method: 'DELETE'
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        showToast('Consultation deleted.', 'success');
        setDeletingId(null);
        fetchConsultations();
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Unable to delete record at this time.');
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Unable to delete record.');
      showToast(friendlyMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        showToast(data.message || 'Password changed successfully!', 'success');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Failed to update password.');
        setPasswordError(friendlyMsg);
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Unable to reach backend server.');
      setPasswordError(friendlyMsg);
      showToast(friendlyMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Filter & Search Logic
  const filteredConsultations = consultations.filter((item) => {
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.projectDetails || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'new':
      case 'pending':
        return 'bg-amber-500/30 text-amber-200 border-amber-400/80 font-bold';
      case 'reviewing':
      case 'in progress':
        return 'bg-blue-500/30 text-blue-200 border-blue-400/80 font-bold';
      case 'contacted':
        return 'bg-purple-500/30 text-purple-200 border-purple-400/80 font-bold';
      case 'proposal_sent':
        return 'bg-pink-500/30 text-pink-200 border-pink-400/80 font-bold';
      case 'won':
      case 'completed':
        return 'bg-emerald-500/30 text-emerald-200 border-emerald-400/80 font-bold';
      case 'lost':
      case 'archived':
        return 'bg-slate-700/60 text-slate-200 border-slate-400/80 font-bold';
      default:
        return 'bg-secondary/30 text-champagne-light border-secondary/60 font-bold';
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Infronix Web Agency Client Consultations Management Dashboard." />
      <div className="min-h-screen bg-navy-muted text-surface flex flex-col pt-24 pb-16">

        {/* Dashboard Header */}
        <header className="border-b border-outline-variant/30 bg-navy-muted/90 backdrop-blur-md py-6 mb-8">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest block font-bold">Security Portal</span>
              <h1 className="font-headline-lg text-2xl md:text-3xl text-white font-bold mt-1">Client Consultations</h1>
              <p className="font-body-md text-xs text-slate-200 mt-1 font-medium">
                Decrypted AES-256 Client Submissions • Total: {consultations.length} records
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchConsultations}
                className="px-4 py-2.5 border border-outline-variant/60 hover:border-champagne-light text-slate-100 hover:text-white text-xs uppercase font-label-caps tracking-widest transition-colors flex items-center gap-1 cursor-pointer font-bold bg-slate-900/40"
                title="Refresh Records"
              >
                <ArrowsClockwise className="text-sm" weight="bold" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2.5 bg-champagne-light/20 hover:bg-champagne-light/30 border border-champagne-light/60 text-champagne-light text-xs uppercase font-label-caps tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Key className="text-sm" weight="bold" />
                <span>Change Password</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/60 text-red-100 text-xs uppercase font-label-caps tracking-widest transition-colors flex items-center gap-2 cursor-pointer font-bold"
              >
                <SignOut className="text-sm" weight="bold" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex-grow w-full">
          
          {/* Controls Bar: Search & Status Filter */}
          <div className="bg-slate-950 p-6 border border-champagne-light/30 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xl">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-lg" weight="bold" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, company, details..."
                className="w-full bg-slate-900 text-white font-body-md pl-10 pr-4 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              {['ALL', 'new', 'reviewing', 'contacted', 'proposal_sent', 'won', 'lost'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-label-caps uppercase tracking-widest transition-colors border cursor-pointer ${
                    statusFilter === status
                      ? 'bg-champagne-light text-navy-muted border-champagne-light font-bold shadow-md'
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-champagne-light/50 font-bold'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Consultations Data Table with Skeleton Loading */}
          {loading ? (
            <SkeletonTable rows={6} dark={true} />
          ) : error ? (
            <div className="p-8 bg-red-950/40 border border-red-500/50 text-center shadow-xl">
              <p className="text-red-100 font-bold mb-4">{error}</p>
              <button
                onClick={fetchConsultations}
                className="px-6 py-2 bg-red-900/80 border border-red-500/80 text-white text-xs font-label-caps uppercase tracking-widest hover:bg-red-800 font-bold cursor-pointer"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-700 bg-slate-950/60 p-8">
              <Tray className="text-4xl text-slate-300 mb-2" weight="bold" />
              <p className="font-headline-md text-lg text-slate-200 font-semibold">No client consultations found matching filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-champagne-light/30 bg-slate-950 shadow-2xl">
              <table className="w-full text-left text-sm font-body-md border-collapse">
                <thead>
                  <tr className="border-b border-champagne-light/30 bg-slate-900 font-label-caps text-xs text-champagne-light uppercase tracking-widest font-bold">
                    <th className="p-4">ID</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredConsultations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/90 transition-colors group">
                      <td className="p-4 font-mono text-xs text-slate-200 font-bold">#{item.id}</td>
                      <td className="p-4 font-bold text-white text-base">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="p-4 text-slate-100 font-medium">
                        <a href={`mailto:${item.email}`} className="text-champagne-light font-bold underline hover:text-white transition-colors">
                          {item.email}
                        </a>
                      </td>
                      <td className="p-4 text-slate-200 font-semibold">
                        {item.company || <span className="text-slate-400 italic">N/A</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-label-caps uppercase tracking-wider border shadow-sm ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-200 font-mono font-semibold">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-champagne-light hover:bg-champagne-light/20 rounded transition-colors cursor-pointer"
                            title="Edit / View Details"
                          >
                            <Pencil className="text-xl" weight="bold" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-2 text-red-400 hover:bg-red-950/60 rounded transition-colors cursor-pointer"
                            title="Delete Consultation"
                          >
                            <Trash className="text-xl" weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-margin-mobile">
            <div className="bg-surface-container-lowest border border-champagne-light/40 w-full max-w-md p-8 shadow-2xl">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
                <div>
                  <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest font-bold">Security Settings</span>
                  <h2 className="font-headline-md text-xl text-primary font-bold">Change Admin Password</h2>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="text-2xl" weight="bold" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs rounded flex items-center gap-2 font-medium">
                  <Warning className="text-red-400 text-base" weight="bold" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div>
                  <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">
                    New Password (Min 8 chars) *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-5 py-2 border border-outline-variant text-slate-800 hover:bg-slate-100 text-xs font-label-caps uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-champagne-light text-navy-muted font-bold text-xs font-label-caps uppercase tracking-widest hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT / VIEW MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-margin-mobile">
            <div className="bg-surface-container-lowest border border-champagne-light/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
                <div>
                  <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest font-bold">Consultation #{editingItem.id}</span>
                  <h2 className="font-headline-md text-xl text-primary font-bold">Edit Client Consultation</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setInvoicingItem(editingItem);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 border border-champagne-light/50 text-champagne-light text-xs font-label-caps uppercase tracking-widest hover:bg-champagne-light hover:text-navy-muted font-bold transition-colors cursor-pointer"
                  >
                    Generate Invoice
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
                  >
                    <X className="text-2xl" weight="bold" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">First Name</label>
                    <input
                      type="text"
                      value={editingItem.firstName}
                      onChange={(e) => setEditingItem({ ...editingItem, firstName: e.target.value })}
                      className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">Last Name</label>
                    <input
                      type="text"
                      value={editingItem.lastName}
                      onChange={(e) => setEditingItem({ ...editingItem, lastName: e.target.value })}
                      className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={editingItem.email}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">Company</label>
                    <input
                      type="text"
                      value={editingItem.company || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light cursor-pointer font-bold"
                  >
                    <option value="new">new</option>
                    <option value="reviewing">reviewing</option>
                    <option value="contacted">contacted</option>
                    <option value="proposal_sent">proposal_sent</option>
                    <option value="won">won</option>
                    <option value="lost">lost</option>
                    {/* Legacy support */}
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-caps text-xs text-slate-800 uppercase tracking-widest block mb-1 font-bold">Project Details</label>
                  <textarea
                    rows={5}
                    value={editingItem.projectDetails}
                    onChange={(e) => setEditingItem({ ...editingItem, projectDetails: e.target.value })}
                    className="w-full bg-surface text-on-surface p-3 text-sm border border-outline focus:outline-none focus:border-champagne-light font-medium"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-6 py-2.5 border border-outline-variant text-slate-800 hover:bg-slate-100 text-xs font-label-caps uppercase tracking-widest font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-champagne-light text-navy-muted font-bold text-xs font-label-caps uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Save & Encrypt Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-margin-mobile">
            <div className="bg-surface-container-lowest border border-red-500/40 w-full max-w-md p-6 shadow-2xl text-center">
              <Warning className="text-red-400 text-5xl mb-2" weight="bold" />
              <h3 className="font-headline-md text-xl text-primary font-bold mb-2">Confirm Deletion</h3>
              <p className="font-body-md text-sm text-slate-700 mb-6 font-medium">
                Are you sure you want to permanently delete consultation #{deletingId}? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-5 py-2 border border-outline text-slate-800 hover:bg-slate-100 text-xs font-label-caps uppercase tracking-widest cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-red-600 text-white font-bold text-xs font-label-caps uppercase tracking-widest hover:bg-red-500 transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INVOICE MODAL */}
        {invoicingItem && (
          <InvoiceModal
            client={invoicingItem}
            onClose={() => setInvoicingItem(null)}
          />
        )}
      </div>
    </>
  );
}
