"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Pencil, Trash, X, CheckCircle, Database, DownloadSimple, UploadSimple, Key, Info } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal, DangerConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

const ACCOUNT_CATEGORIES = [
  'Domain',
  'Email',
  'GitHub',
  'Hosting',
  'Cloud',
  'Social Media',
  'Payment',
  'Analytics',
  'Other'
];

export default function SecurityModule({ initialSub = 'accounts', settings = {}, onRefreshDashboard }) {
  const [subTab, setSubTab] = useState(initialSub); // 'accounts' | 'checklist' | 'secrets' | 'backup'
  const [accounts, setAccounts] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [backups, setBackups] = useState([]);
  const [backupStats, setBackupStats] = useState([]);
  const [lastBackupDate, setLastBackupDate] = useState('Never');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState(null);

  const [showSecretModal, setShowSecretModal] = useState(false);

  const [importPreview, setImportPreview] = useState(null);
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
  const [importPayload, setImportPayload] = useState(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchSecurityData();
  }, [subTab]);

  async function fetchSecurityData() {
    setLoading(true);
    try {
      if (subTab === 'accounts') {
        const res = await fetch('/api/founder-os/security/accounts');
        const data = await res.json();
        if (data.success) setAccounts(data.accounts || []);
      } else if (subTab === 'checklist') {
        const res = await fetch('/api/founder-os/security/checklist');
        const data = await res.json();
        if (data.success) setChecklist(data.items || []);
      } else if (subTab === 'secrets') {
        const res = await fetch('/api/founder-os/security/secrets-ref');
        const data = await res.json();
        if (data.success) setSecrets(data.secrets || []);
      } else if (subTab === 'backup') {
        const res = await fetch('/api/founder-os/backup');
        const data = await res.json();
        if (data.success) {
          setBackups(data.backups || []);
          setBackupStats(data.stats || []);
          setLastBackupDate(data.lastBackupDate || 'Never');
        }
      }
    } catch (err) {
      showToast('Error loading security records', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Handle Save Account
  async function handleSaveAccount(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      service_name: form.service_name.value,
      category: form.category.value,
      owner: form.owner.value,
      security_status: form.security_status.value,
      mfa_enabled: form.mfa_enabled.checked,
      recovery_configured: form.recovery_configured.checked,
      last_reviewed: form.last_reviewed.value || null,
      url_reference: form.url_reference.value,
      notes: form.notes.value
    };

    try {
      let res;
      if (editingAccount) {
        res = await fetch(`/api/founder-os/security/accounts/${editingAccount.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/security/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingAccount ? 'Account updated' : 'Account added to security inventory', 'success');
        setShowAccountModal(false);
        setEditingAccount(null);
        fetchSecurityData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save account', 'error');
      }
    } catch (err) {
      showToast('Error saving account', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Update Checklist Item
  async function handleSaveChecklistItem(e) {
    e.preventDefault();
    if (!editingChecklistItem) return;
    setActionLoading(true);
    const form = e.target;
    const payload = {
      id: editingChecklistItem.id,
      status: form.status.value,
      last_verified: form.last_verified.value || null,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/founder-os/security/checklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Checklist item updated', 'success');
        setShowChecklistModal(false);
        setEditingChecklistItem(null);
        fetchSecurityData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to update checklist item', 'error');
      }
    } catch (err) {
      showToast('Error updating checklist item', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Save Secret Reference
  async function handleSaveSecretRef(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      secret_name: form.secret_name.value,
      purpose: form.purpose.value,
      stored_in: form.stored_in.value,
      environment: form.environment.value,
      last_rotated: form.last_rotated.value || null,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/founder-os/security/secrets-ref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Secret reference added', 'success');
        setShowSecretModal(false);
        fetchSecurityData();
      } else {
        showToast(data.error || 'Failed to save secret reference', 'error');
      }
    } catch (err) {
      showToast('Error saving secret reference', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Create Backup
  async function handleCreateBackup() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/founder-os/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_backup' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Backup snapshot created (${data.recordCount} records)`, 'success');
        
        // Auto-download JSON backup file
        const blob = new Blob([JSON.stringify(data.payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
        URL.revokeObjectURL(url);

        fetchSecurityData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to create backup', 'error');
      }
    } catch (err) {
      showToast('Error generating backup', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Export CSV
  async function handleExportCSV(module) {
    try {
      const res = await fetch('/api/founder-os/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export_csv', module })
      });
      const data = await res.json();
      if (data.success) {
        if (!data.csv) {
          showToast(`No records found to export for ${module}`, 'info');
          return;
        }
        const blob = new Blob([data.csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported ${data.count} records to ${data.filename}`, 'success');
      }
    } catch (err) {
      showToast('Export failed', 'error');
    }
  }

  // Handle Upload File for Import Preview
  function handleFileSelectForImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const res = await fetch('/api/founder-os/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'import_preview', payload: parsed })
        });
        const data = await res.json();
        if (data.success) {
          setImportPreview(data);
          setImportPayload(parsed);
          setShowImportConfirmModal(true);
        } else {
          showToast(data.error || 'Invalid backup JSON file', 'error');
        }
      } catch (err) {
        showToast('Malformed JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  }

  // Handle Confirm Import
  async function handleConfirmImport() {
    if (!importPayload) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/founder-os/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import_confirm', payload: importPayload })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully imported ${data.importedCount} records`, 'success');
        setShowImportConfirmModal(false);
        setImportPreview(null);
        setImportPayload(null);
        fetchSecurityData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to import backup', 'error');
      }
    } catch (err) {
      showToast('Error executing import', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Reset Database (Destructive)
  async function handleExecuteReset() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/founder-os/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_database', confirmPhrase: 'RESET' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Database cleanly reset to 0 records', 'success');
        setShowResetModal(false);
        fetchSecurityData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to reset database', 'error');
      }
    } catch (err) {
      showToast('Error executing reset', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Subtabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('accounts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'accounts' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Accounts ({accounts.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('checklist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'checklist' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            14-Point Checklist
          </button>
          <button
            type="button"
            onClick={() => setSubTab('secrets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'secrets' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Secrets Guide
          </button>
          <button
            type="button"
            onClick={() => setSubTab('backup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'backup' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Backup Center
          </button>
        </div>

        {subTab === 'accounts' && (
          <button
            onClick={() => { setEditingAccount(null); setShowAccountModal(true); }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} weight="bold" />
            <span>Add Account</span>
          </button>
        )}

        {subTab === 'secrets' && (
          <button
            onClick={() => setShowSecretModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} weight="bold" />
            <span>Add Secret Reference</span>
          </button>
        )}
      </div>

      {/* 1. ACCOUNTS INVENTORY */}
      {subTab === 'accounts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" weight="bold" />
            <span>
              <strong>Zero-Password Security Policy:</strong> This application never stores plaintext passwords or API keys. Passwords must be managed inside dedicated managers (1Password / Bitwarden).
            </span>
          </div>

          {accounts.length === 0 && !loading ? (
            <EmptyState
              icon={ShieldCheck}
              title="No security accounts added yet"
              description="Inventory critical infrastructure accounts (Domain, GitHub, Hosting, Email) to track MFA status and review cycles."
              actionLabel="Add First Account"
              onAction={() => { setEditingAccount(null); setShowAccountModal(true); }}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">MFA Status</th>
                      <th className="px-4 py-3">Recovery Key</th>
                      <th className="px-4 py-3">Last Reviewed</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {acc.service_name}
                          {acc.url_reference && (
                            <span className="block text-[10px] text-slate-500 font-normal truncate max-w-xs">{acc.url_reference}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {acc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {acc.owner}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            acc.mfa_enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {acc.mfa_enabled ? 'MFA Active' : 'No MFA'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {acc.recovery_configured ? (
                            <span className="text-emerald-600 font-semibold">Configured</span>
                          ) : 'Not Configured'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono">
                          {acc.last_reviewed ? new Date(acc.last_reviewed).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setEditingAccount(acc); setShowAccountModal(true); }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'account', id: acc.id, title: acc.service_name })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. 14-POINT SECURITY CHECKLIST */}
      {subTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Agency Security Standard Checklist
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                14 standard compliance checks. Review and manually verify each item.
              </p>
            </div>
            <div className="text-xs text-slate-600">
              Compliant: <strong className="text-emerald-600 font-bold">{checklist.filter(c => c.status === 'Compliant').length}</strong> / 14
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {checklist.map((item) => {
              const isCompliant = item.status === 'Compliant';
              const isAction = item.status === 'Action Required';

              return (
                <div
                  key={item.id}
                  onClick={() => { setEditingChecklistItem(item); setShowChecklistModal(true); }}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : isAction
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {isCompliant ? <CheckCircle size={18} weight="bold" /> : <ShieldCheck size={18} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 mt-1">{item.notes}</p>
                      )}
                      {item.last_verified && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Verified: {new Date(item.last_verified).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isAction
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                    <Pencil size={14} className="text-slate-400 group-hover:text-slate-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SECRETS REFERENCE GUIDE */}
      {subTab === 'secrets' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              <Key size={20} className="text-violet-600" weight="bold" />
              <span>Founder Security Policy: Zero Stored Secrets</span>
            </div>
            <p className="text-slate-700">
              InfronixWeb Founder OS operates on a strict principle: <strong>production database credentials, Stripe API keys, OpenAI keys, and email passwords must NEVER be saved in this web dashboard.</strong>
            </p>
            <p className="text-slate-500">
              Instead, this module maintains a pointer index of where actual credentials and environment secrets are secured.
            </p>
          </div>

          {secrets.length === 0 && !loading ? (
            <EmptyState
              icon={Key}
              title="No secret references indexed"
              description="Document the location and rotation schedules of API keys and server credentials."
              actionLabel="Add Secret Pointer"
              onAction={() => setShowSecretModal(true)}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Secret Identifier</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Vault / Location</th>
                      <th className="px-4 py-3">Environment</th>
                      <th className="px-4 py-3">Last Rotated</th>
                      <th className="px-4 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {secrets.map((sec) => (
                      <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {sec.secret_name}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {sec.purpose}
                        </td>
                        <td className="px-4 py-3 text-violet-700 font-semibold">
                          {sec.stored_in}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {sec.environment}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono">
                          {sec.last_rotated ? new Date(sec.last_rotated).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'secret', id: sec.id, title: sec.secret_name })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. BACKUP CENTER */}
      {subTab === 'backup' && (
        <div className="space-y-6">
          {/* Backup Action Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database size={20} className="text-violet-600" weight="bold" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Data Backup & Resilience Center
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Last Backup: <strong className="text-slate-800 font-mono">{lastBackupDate}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCreateBackup}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Create Full Backup (JSON)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors cursor-pointer">
                <UploadSimple size={16} weight="bold" />
                <span>Restore / Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelectForImport}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
              >
                <Trash size={16} weight="bold" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {/* Record Count Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {backupStats.map((st) => (
              <div key={st.table} className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {st.name}
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono">{st.count}</span>
              </div>
            ))}
          </div>

          {/* CSV Quick Exporters */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-semibold">
              Export Specific Module as CSV
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExportCSV('leads')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                Export Leads (.csv)
              </button>
              <button
                onClick={() => handleExportCSV('revenue')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                Export Revenue (.csv)
              </button>
              <button
                onClick={() => handleExportCSV('expenses')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                Export Expenses (.csv)
              </button>
              <button
                onClick={() => handleExportCSV('projects')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                Export Projects (.csv)
              </button>
              <button
                onClick={() => handleExportCSV('people')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                Export Team Directory (.csv)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT ACCOUNT --- */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingAccount ? 'Edit Account' : 'Add Account to Security Inventory'}
              </h3>
              <button 
                onClick={() => setShowAccountModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Service Name *</label>
                  <input
                    name="service_name"
                    defaultValue={editingAccount?.service_name || ''}
                    required
                    placeholder="e.g. Hostinger Domain"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingAccount?.category || 'Domain'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {ACCOUNT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Owner</label>
                  <input
                    name="owner"
                    defaultValue={editingAccount?.owner || 'Founder'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Security Status</label>
                  <select
                    name="security_status"
                    defaultValue={editingAccount?.security_status || 'Secured'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="Secured">Secured</option>
                    <option value="Needs Review">Needs Review</option>
                    <option value="Critical Attention">Critical Attention</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mfa_enabled"
                    name="mfa_enabled"
                    defaultChecked={editingAccount?.mfa_enabled}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="mfa_enabled" className="text-slate-700 font-semibold">
                    Multi-Factor Authentication (MFA / 2FA) Enabled
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recovery_configured"
                    name="recovery_configured"
                    defaultChecked={editingAccount?.recovery_configured}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="recovery_configured" className="text-slate-700 font-semibold">
                    Recovery codes saved in password manager
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Portal URL / Reference</label>
                <input
                  name="url_reference"
                  defaultValue={editingAccount?.url_reference || ''}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Last Reviewed Date</label>
                <input
                  name="last_reviewed"
                  type="date"
                  defaultValue={editingAccount?.last_reviewed ? String(editingAccount.last_reviewed).substring(0, 10) : ''}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes (NO Passwords)</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingAccount?.notes || ''}
                  placeholder="Review frequency, permissions policy..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingAccount ? 'Update Account' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: UPDATE CHECKLIST ITEM --- */}
      {showChecklistModal && editingChecklistItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">{editingChecklistItem.category}</span>
                <h3 className="text-sm font-bold text-slate-900 font-outfit mt-0.5">
                  {editingChecklistItem.title}
                </h3>
              </div>
              <button 
                onClick={() => setShowChecklistModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveChecklistItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Compliance Status *</label>
                <select
                  name="status"
                  defaultValue={editingChecklistItem.status}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="Not Checked">Not Checked</option>
                  <option value="Compliant">Compliant</option>
                  <option value="Action Required">Action Required</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Verification Date</label>
                <input
                  name="last_verified"
                  type="date"
                  defaultValue={editingChecklistItem.last_verified ? String(editingChecklistItem.last_verified).substring(0, 10) : new Date().toISOString().substring(0, 10)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Audit Notes / Evidence</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingChecklistItem.notes || ''}
                  placeholder="Verification method, settings applied..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowChecklistModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD SECRET REFERENCE --- */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Add Secret Reference Pointer
              </h3>
              <button 
                onClick={() => setShowSecretModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSecretRef} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Secret Identifier *</label>
                <input
                  name="secret_name"
                  required
                  placeholder="e.g. SUPABASE_SERVICE_ROLE_KEY"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purpose *</label>
                <input
                  name="purpose"
                  required
                  placeholder="e.g. Backend admin database bypass"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Storage Vault</label>
                  <input
                    name="stored_in"
                    defaultValue="1Password Vault / Vercel Env"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Environment</label>
                  <select
                    name="environment"
                    defaultValue="Production"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Last Rotated</label>
                <input
                  name="last_rotated"
                  type="date"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Rotation policies..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSecretModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Reference'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: IMPORT CONFIRMATION WITH PREVIEW --- */}
      {showImportConfirmModal && importPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-900 font-outfit mb-2">
              Confirm Backup Data Import
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              <strong>{importPreview.totalRecords} records</strong> will be added to your Founder OS database from the backup snapshot created on <span className="font-mono text-slate-900 font-bold">{new Date(importPreview.backupTimestamp).toLocaleString()}</span>.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs mb-4">
              {Object.entries(importPreview.previewCounts).map(([mod, count]) => (
                <div key={mod} className="flex justify-between text-slate-600">
                  <span className="capitalize">{mod}:</span>
                  <span className="font-bold text-slate-900 font-mono">{count} records</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setShowImportConfirmModal(false); setImportPayload(null); }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Importing...' : 'Confirm Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Modal for Data Reset */}
      <DangerConfirmModal
        isOpen={showResetModal}
        title="Reset Application Data"
        message="This action permanently wipes all Leads, Calls, Proposals, Projects, Tasks, Revenue, Expenses, People, SOPs, and Security accounts back to a clean slate (0 records)."
        requiredPhrase="RESET"
        loading={actionLoading}
        onConfirm={handleExecuteReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        isDestructive={true}
        title={`Delete ${deleteConfirm.type}`}
        message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
        confirmLabel="Delete"
        loading={actionLoading}
        onConfirm={async () => {
          setActionLoading(true);
          try {
            let endpoint = '';
            if (deleteConfirm.type === 'account') endpoint = `/api/founder-os/security/accounts/${deleteConfirm.id}`;
            else if (deleteConfirm.type === 'secret') endpoint = `/api/founder-os/security/secrets-ref/${deleteConfirm.id}`;

            const res = await fetch(endpoint, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
              showToast('Deleted', 'success');
              setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
              fetchSecurityData();
            }
          } catch (err) {
            showToast('Delete failed', 'error');
          } finally {
            setActionLoading(false);
          }
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
      />
    </div>
  );
}
