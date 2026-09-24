"use client";
import React, { useState, useEffect } from 'react';
import { Users, Plus, MagnifyingGlass, Trash, Phone, Envelope, Folder, ArrowLeft, X, CreditCard, ShieldCheck, Key, Eye, ArrowSquareOut, ArrowsClockwise, Copy, Lock, LockOpen, UserPlus, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

export default function ClientsModule({
  settings = {},
  onOpenProjectWizard = null,
  onNavigate = null
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview' | 'projects' | 'sales' | 'finance' | 'portal'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Portal State
  const [portalData, setPortalData] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showPortalUserModal, setShowPortalUserModal] = useState(false);
  const [portalUserForm, setPortalUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Primary Contact',
    authMethod: 'temp_password' // 'temp_password' | 'invite_link'
  });
  const [oneTimeCredentials, setOneTimeCredentials] = useState(null);

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();
  const currency = settings.currency_symbol || '₹';

  useEffect(() => {
    fetchClients();
  }, [search]);

  useEffect(() => {
    if (selectedClient && activeDetailTab === 'portal') {
      fetchPortalData(selectedClient.id);
    }
  }, [selectedClient, activeDetailTab]);

  async function fetchPortalData(clientId) {
    setPortalLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${clientId}/portal`);
      const data = await res.json();
      if (data.success) {
        const users = data.portalUsers || data.portal_users || [];
        setPortalData({
          ...data,
          portalUsers: users,
          portal_users: users
        });
      }
    } catch (err) {
      showToast('Error loading client portal data', 'error');
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleCreatePortalUser(e) {
    e.preventDefault();
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${selectedClient.id}/portal/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portalUserForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Portal user account created successfully', 'success');
        setOneTimeCredentials({
          publicClientId: data.publicClientId,
          email: data.user?.email || portalUserForm.email,
          temporaryPassword: data.temporaryPassword || data.temporary_password || null,
          setupUrl: data.setupUrl || null
        });
        setShowPortalUserModal(false);
        fetchPortalData(selectedClient.id);
      } else {
        showToast(data.error || 'Failed to create portal user', 'error');
      }
    } catch (err) {
      showToast('Error creating portal access', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResetPassword(portalUserId) {
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${selectedClient.id}/portal/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal_user_id: portalUserId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'New temporary password generated', 'success');
        setOneTimeCredentials({
          publicClientId: data.publicClientId,
          email: data.email,
          temporaryPassword: data.temporaryPassword || data.temporary_password || null,
          setupUrl: data.setupUrl || null
        });
        fetchPortalData(selectedClient.id);
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast('Error resetting password', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendInvite(portalUserId) {
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${selectedClient.id}/portal/send-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal_user_id: portalUserId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.emailSent ? 'Invitation email sent to client' : 'Invitation setup link generated', 'success');
        setOneTimeCredentials({
          publicClientId: data.publicClientId,
          email: data.email,
          temporaryPassword: null,
          setupUrl: data.setupUrl || null
        });
        fetchPortalData(selectedClient.id);
      } else {
        showToast(data.error || 'Failed to generate invitation', 'error');
      }
    } catch (err) {
      showToast('Error sending invitation', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdatePortalStatus(portalUserId, newStatus) {
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${selectedClient.id}/portal/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal_user_id: portalUserId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Portal access marked as ${newStatus}`, 'success');
        fetchPortalData(selectedClient.id);
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeSessions(portalUserId) {
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${selectedClient.id}/portal/revoke-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal_user_id: portalUserId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('All active sessions revoked', 'success');
        fetchPortalData(selectedClient.id);
      } else {
        showToast(data.error || 'Failed to revoke sessions', 'error');
      }
    } catch (err) {
      showToast('Error revoking sessions', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, [search]);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (err) {
      showToast('Error loading clients directory', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadClientDetail(clientId) {
    try {
      const res = await fetch(`/api/founder-os/clients/${clientId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedClient(data.client);
        setClientDetails(data);
      }
    } catch (err) {
      showToast('Error loading client 360° details', 'error');
    }
  }

  async function handleSaveClient(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      name: form.elements.namedItem('name')?.value || '',
      company: form.elements.namedItem('company')?.value || '',
      phone: form.elements.namedItem('phone')?.value || '',
      email: form.elements.namedItem('email')?.value || '',
      industry: form.elements.namedItem('industry')?.value || '',
      notes: form.elements.namedItem('notes')?.value || ''
    };

    try {
      let res;
      if (editingClient) {
        res = await fetch(`/api/founder-os/clients/${editingClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingClient ? 'Client updated' : 'Client created', 'success');
        setShowClientModal(false);
        setEditingClient(null);
        fetchClients();
        if (selectedClient?.id === (editingClient?.id || data.client?.id)) {
          loadClientDetail(editingClient?.id || data.client?.id);
        }
      } else {
        showToast(data.error || 'Failed to save client', 'error');
      }
    } catch (err) {
      showToast('Error saving client', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/clients/${deleteConfirm.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Client deleted', 'success');
        setDeleteConfirm({ isOpen: false, id: null, title: '' });
        setSelectedClient(null);
        setClientDetails(null);
        fetchClients();
      } else {
        showToast(data.error || 'Failed to delete client', 'error');
      }
    } catch (err) {
      showToast('Error deleting client', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* If a client is selected, render Client 360° Detail View */}
      {selectedClient ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Top Bar with Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setSelectedClient(null); setClientDetails(null); }}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Back to client directory"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                    {selectedClient.name}
                  </h2>
                  {selectedClient.company && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedClient.company}
                    </span>
                  )}
                  {selectedClient.industry && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                      {selectedClient.industry}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                  {selectedClient.phone && <span className="flex items-center gap-1"><Phone size={13} /> {selectedClient.phone}</span>}
                  {selectedClient.email && <span className="flex items-center gap-1"><Envelope size={13} /> {selectedClient.email}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenProjectWizard && (
                <button
                  onClick={() => onOpenProjectWizard({ client: selectedClient })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>New Project</span>
                </button>
              )}
              <button
                onClick={() => { setEditingClient(selectedClient); setShowClientModal(true); }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer min-h-[38px]"
              >
                Edit Client
              </button>
              <button
                onClick={() => setDeleteConfirm({ isOpen: true, id: selectedClient.id, title: selectedClient.name })}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Delete Client"
              >
                <Trash size={17} />
              </button>
            </div>
          </div>

          {/* 360° Financial Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block mb-1 font-medium">Total Contract Value</span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {currency}{parseFloat(clientDetails?.financials?.totalContractValue || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
              <span className="text-emerald-700 block mb-1 font-medium">Total Cash Received</span>
              <span className="text-base font-bold text-emerald-800 font-mono">
                {currency}{parseFloat(clientDetails?.financials?.totalCashReceived || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
              <span className="text-amber-700 block mb-1 font-medium">Outstanding Receivables</span>
              <span className="text-base font-bold text-amber-800 font-mono">
                {currency}{parseFloat(clientDetails?.financials?.totalOutstanding || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs overflow-x-auto no-scrollbar w-full sm:w-fit">
            <button
              onClick={() => setActiveDetailTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all min-h-[36px] ${
                activeDetailTab === 'overview' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveDetailTab('projects')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[36px] ${
                activeDetailTab === 'projects' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Projects</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                {clientDetails?.projects?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveDetailTab('sales')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[36px] ${
                activeDetailTab === 'sales' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Sales Pipeline</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                {(clientDetails?.leads?.length || 0) + (clientDetails?.proposals?.length || 0)}
              </span>
            </button>
            <button
              onClick={() => setActiveDetailTab('finance')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[36px] ${
                activeDetailTab === 'finance' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Payments & Ledger</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                {clientDetails?.revenue?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveDetailTab('portal')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[36px] ${
                activeDetailTab === 'portal' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck size={15} weight="bold" />
              <span>Portal Access</span>
              {portalData?.portalUsers?.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeDetailTab === 'portal' ? 'bg-violet-700 text-white' : 'bg-violet-100 text-violet-700'
                }`}>
                  {portalData.portalUsers.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Client Profile & Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Contact Person</span>
                      <strong className="text-slate-900">{selectedClient.name}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Company / Organization</span>
                      <strong className="text-slate-900">{selectedClient.company || '—'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Phone</span>
                      <strong className="text-slate-900">{selectedClient.phone || '—'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Email</span>
                      <strong className="text-slate-900">{selectedClient.email || '—'}</strong>
                    </div>
                  </div>

                  {selectedClient.notes && (
                    <div className="pt-2">
                      <span className="text-slate-700 block text-xs font-bold mb-1.5">Client Notes</span>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        {selectedClient.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Recent Activity
                  </h3>
                  {(!clientDetails?.activity || clientDetails.activity.length === 0) ? (
                    <div className="text-xs text-slate-500 py-4 text-center">No recorded activity yet.</div>
                  ) : (
                    <div className="space-y-2.5 text-xs">
                      {clientDetails.activity.map(act => (
                        <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{act.action}</span>
                            <span className="text-[10px] text-slate-400">{new Date(act.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{act.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeDetailTab === 'projects' && (
            <div className="space-y-4">
              {(!clientDetails?.projects || clientDetails.projects.length === 0) ? (
                <EmptyState
                  icon={Folder}
                  title="No projects created for this client"
                  description="Use the Project Setup Wizard to start a new project for this client."
                  actionLabel="Start Project Wizard"
                  onAction={() => onOpenProjectWizard && onOpenProjectWizard({ client: selectedClient })}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientDetails.projects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => onNavigate && onNavigate(`/admin?tab=delivery&projectId=${proj.id}`)}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                          {proj.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {currency}{parseFloat(proj.project_value || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-outfit">{proj.project_name}</h4>
                      <div className="text-[11px] text-slate-500">
                        Tasks: {proj.completed_tasks || 0}/{proj.total_tasks || 0}
                        {proj.deadline && ` • Due: ${new Date(proj.deadline).toLocaleDateString()}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SALES PIPELINE */}
          {activeDetailTab === 'sales' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Proposals */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">Proposals</h3>
                {(!clientDetails?.proposals || clientDetails.proposals.length === 0) ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No proposals sent to this client.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {clientDetails.proposals.map(prop => (
                      <div key={prop.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{prop.project_title}</span>
                          <span className="font-mono font-bold text-slate-900">{currency}{parseFloat(prop.proposal_value || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Status: <strong className="text-slate-700">{prop.status}</strong></span>
                          <span>{prop.sent_date ? `Sent: ${new Date(prop.sent_date).toLocaleDateString()}` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calls & Leads */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">Calls & Discovery</h3>
                {(!clientDetails?.calls || clientDetails.calls.length === 0) ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No call logs for this client.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {clientDetails.calls.map(c => (
                      <div key={c.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{c.call_type}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(c.call_date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">Outcome: <strong className="text-slate-800">{c.outcome}</strong></div>
                        {c.notes && <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">{c.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & PAYMENTS */}
          {activeDetailTab === 'finance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Revenue Transactions & Receipts ({clientDetails?.revenue?.length || 0})
              </h3>

              {(!clientDetails?.revenue || clientDetails.revenue.length === 0) ? (
                <EmptyState
                  icon={CreditCard}
                  title="No financial transactions recorded"
                  description="Payments recorded against this client's projects will automatically appear here."
                />
              ) : (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {clientDetails.revenue.map(r => (
                    <div key={r.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{r.project_name || 'Direct Client Payment'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(r.payment_date).toLocaleDateString()} • {r.payment_method}
                          {r.invoice_number && ` • Ref: ${r.invoice_number}`}
                        </div>
                        {r.notes && <div className="text-[10px] text-slate-400 mt-0.5">{r.notes}</div>}
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-700 font-mono">
                          +{currency}{parseFloat(r.amount || 0).toLocaleString('en-IN')}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {r.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PORTAL ACCESS */}
          {activeDetailTab === 'portal' && (
            <div className="space-y-5 animate-fadeIn">
              {/* One-Time Temporary Password Display Card */}
              {oneTimeCredentials && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-xl text-white space-y-3 animate-fadeIn">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Key size={18} weight="bold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-outfit">Single-Use Portal Credentials Generated</h4>
                        <p className="text-[11px] text-emerald-300">
                          Securely share these credentials with the client. The temporary password is shown only once and cannot be retrieved later.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOneTimeCredentials(null)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg"
                      title="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Public Client ID</span>
                      <strong className="text-emerald-300 font-mono text-sm tracking-wide">{oneTimeCredentials.publicClientId}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Client Email</span>
                      <strong className="text-slate-200 font-mono text-xs truncate block">{oneTimeCredentials.email}</strong>
                    </div>
                    {oneTimeCredentials.temporaryPassword && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40">
                        <span className="text-emerald-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Temporary Password</span>
                        <strong className="text-emerald-300 font-mono text-sm tracking-wider">{oneTimeCredentials.temporaryPassword}</strong>
                      </div>
                    )}
                  </div>

                  {oneTimeCredentials.setupUrl && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs">
                      <div className="truncate text-slate-300 font-mono text-[11px]">
                        Setup Link: <span className="text-emerald-300">{oneTimeCredentials.setupUrl}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <WarningCircle size={14} className="text-amber-400" /> Client will be forced to create a new password on first login.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `InfronixWeb Client Portal Access:\nPortal URL: ${window.location.origin}/client/login\nClient ID: ${oneTimeCredentials.publicClientId}\nEmail: ${oneTimeCredentials.email}${oneTimeCredentials.temporaryPassword ? `\nTemporary Password: ${oneTimeCredentials.temporaryPassword}` : ''}${oneTimeCredentials.setupUrl ? `\nSetup Link: ${oneTimeCredentials.setupUrl}` : ''}`;
                        navigator.clipboard.writeText(text);
                        showToast('Credentials copied to clipboard', 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                    >
                      <Copy size={14} />
                      <span>Copy Credentials</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Portal Header and Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={18} className="text-violet-600" weight="bold" />
                    <span>InfronixWeb Client Portal Control</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage client login credentials, assigned projects, authorized contacts, and security sessions.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`/client/dashboard?admin_preview_client_id=${selectedClient.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer min-h-[38px]"
                    title="View portal exactly as this client sees it (Read-Only Preview)"
                  >
                    <Eye size={15} weight="bold" />
                    <span>View as Client</span>
                    <ArrowSquareOut size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPortalUserForm({
                        name: selectedClient.name || '',
                        email: selectedClient.email || '',
                        phone: selectedClient.phone || '',
                        designation: 'Primary Contact',
                        authMethod: 'temp_password'
                      });
                      setShowPortalUserModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs shadow-violet-600/20 cursor-pointer min-h-[38px]"
                  >
                    <UserPlus size={15} weight="bold" />
                    <span>Add Authorized Contact</span>
                  </button>
                </div>
              </div>

              {/* Portal Status Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block mb-1 font-medium">Public Client ID</span>
                  <div className="text-base font-bold text-violet-700 font-mono tracking-wider">
                    {portalData?.portalUsers?.[0]?.public_client_id || 'Not Provisioned'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block mb-1 font-medium">Portal Access Status</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    portalData?.portalUsers?.[0]?.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : portalData?.portalUsers?.[0]?.status === 'invited'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : portalData?.portalUsers?.[0]?.status === 'suspended'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {portalData?.portalUsers?.[0]?.status || 'Disabled'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block mb-1 font-medium">Last Portal Login</span>
                  <span className="text-xs font-bold text-slate-800">
                    {portalData?.portalUsers?.[0]?.last_login
                      ? new Date(portalData.portalUsers[0].last_login).toLocaleString()
                      : 'Never'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block mb-1 font-medium">Failed Attempts / Lockout</span>
                  <span className="text-xs font-bold text-slate-800">
                    {portalData?.portalUsers?.[0]?.failed_login_count || 0} attempts
                    {portalData?.portalUsers?.[0]?.locked_until ? ' (Locked)' : ' (Clean)'}
                  </span>
                </div>
              </div>

              {/* Authorized Portal Users / Contacts */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                    Authorized Client Contacts ({portalData?.portalUsers?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-400">Passwords stored securely using bcrypt</span>
                </div>

                {(!portalData?.portalUsers || portalData.portalUsers.length === 0) ? (
                  <div className="text-center py-8 space-y-3">
                    <Key size={36} className="mx-auto text-slate-300" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">No portal login created yet for this client</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Enable portal access to generate a unique Client ID and temporary password or setup invitation link.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPortalUserForm({
                          name: selectedClient.name || '',
                          email: selectedClient.email || '',
                          phone: selectedClient.phone || '',
                          designation: 'Primary Contact',
                          authMethod: 'temp_password'
                        });
                        setShowPortalUserModal(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-violet-600/20"
                    >
                      <UserPlus size={16} weight="bold" />
                      <span>Provision Portal Access</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {portalData.portalUsers.map(user => (
                      <div key={user.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 text-sm">{user.full_name}</strong>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              {user.role_designation || 'Client User'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : user.status === 'suspended'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                          <div className="text-slate-500 flex items-center gap-3 text-[11px]">
                            <span>ID: <strong className="font-mono text-violet-700">{user.public_client_id}</strong></span>
                            <span>•</span>
                            <span>{user.email}</span>
                            {user.phone && <span>• {user.phone}</span>}
                            {user.must_change_password && <span className="text-amber-600 font-bold">• Must change password</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleResetPassword(user.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[11px] shadow-2xs cursor-pointer flex items-center gap-1"
                            title="Generate a new temporary password"
                          >
                            <Key size={13} />
                            <span>Reset Password</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendInvite(user.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-violet-700 border border-violet-200 font-bold text-[11px] shadow-2xs cursor-pointer flex items-center gap-1"
                            title="Send single-use password setup invitation link"
                          >
                            <Envelope size={13} />
                            <span>Send Setup Link</span>
                          </button>

                          {user.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdatePortalStatus(user.id, 'suspended')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                              title="Temporarily suspend portal access"
                            >
                              <Lock size={13} />
                              <span>Suspend</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdatePortalStatus(user.id, 'active')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                              title="Activate portal access"
                            >
                              <LockOpen size={13} />
                              <span>Activate</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRevokeSessions(user.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                            title="Revoke all active browser sessions"
                          >
                            <ArrowsClockwise size={13} />
                            <span>Revoke Sessions</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assigned Projects in Portal */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                  Assigned Client Projects ({clientDetails?.projects?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {(clientDetails?.projects || []).map(proj => (
                    <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 block font-outfit text-sm">{proj.project_name}</strong>
                        <span className="text-[11px] text-slate-500">Status: {proj.status} • Value: {currency}{parseFloat(proj.project_value || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <a
                        href={`/client/projects/${proj.id}?admin_preview_client_id=${selectedClient.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-violet-700 font-bold text-[11px] flex items-center gap-1 shrink-0"
                      >
                        <Eye size={13} />
                        <span>Preview Project</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CLIENTS LIST VIEW */
        <div className="space-y-4">
          {/* Top Filter & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex-1 min-w-[220px] relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients by name, company, email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <button
              onClick={() => { setEditingClient(null); setShowClientModal(true); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer min-h-[40px] active:scale-98"
            >
              <Plus size={16} weight="bold" />
              <span>Add Client</span>
            </button>
          </div>

          {clients.length === 0 && !loading ? (
            <EmptyState
              icon={Users}
              title="No clients in directory"
              description="Clients are automatically created when you setup projects or convert leads."
              actionLabel="Add First Client"
              onAction={() => { setEditingClient(null); setShowClientModal(true); }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(c => (
                <div
                  key={c.id}
                  onClick={() => loadClientDetail(c.id)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between shadow-xs space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-violet-700 transition-colors truncate">
                        {c.name}
                      </h3>
                      {c.company && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                          {c.company}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      {c.phone && <div className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {c.phone}</div>}
                      {c.email && <div className="flex items-center gap-1.5"><Envelope size={13} className="text-slate-400" /> {c.email}</div>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Projects</span>
                      <span className="font-bold text-slate-800">{c.total_projects || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 font-sans block mb-0.5">Received</span>
                      <span className="font-bold text-emerald-700">{currency}{(c.total_cash_received || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-600 font-sans block mb-0.5">Outstanding</span>
                      <span className="font-bold text-amber-700">{currency}{(c.total_outstanding || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT CLIENT */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingClient ? 'Edit Client Profile' : 'New Client'}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Name *</label>
                <input
                  name="name"
                  defaultValue={editingClient?.name || ''}
                  required
                  placeholder="e.g. Dr. Rajesh Patel"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Organization</label>
                <input
                  name="company"
                  defaultValue={editingClient?.company || ''}
                  placeholder="e.g. Apex Hospitals Pvt Ltd"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={editingClient?.phone || ''}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingClient?.email || ''}
                    placeholder="client@company.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Industry</label>
                <input
                  name="industry"
                  defaultValue={editingClient?.industry || ''}
                  placeholder="e.g. Healthcare / Ecommerce / Real Estate"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes & Preferences</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingClient?.notes || ''}
                  placeholder="Client preferences, special terms, background..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROVISION PORTAL ACCESS / ADD AUTHORIZED CONTACT */}
      {showPortalUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-violet-600" weight="bold" />
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Provision Portal Access
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPortalUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePortalUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  value={portalUserForm.name}
                  onChange={(e) => setPortalUserForm({ ...portalUserForm, name: e.target.value })}
                  placeholder="e.g. Daksh Patel"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  value={portalUserForm.email}
                  onChange={(e) => setPortalUserForm({ ...portalUserForm, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={portalUserForm.phone}
                    onChange={(e) => setPortalUserForm({ ...portalUserForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={portalUserForm.designation}
                    onChange={(e) => setPortalUserForm({ ...portalUserForm, designation: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Initial Access Method</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2 p-3 rounded-xl border border-slate-200 hover:border-violet-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="radio"
                      name="authMethod"
                      value="temp_password"
                      checked={portalUserForm.authMethod === 'temp_password'}
                      onChange={(e) => setPortalUserForm({ ...portalUserForm, authMethod: e.target.value })}
                      className="mt-0.5 text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Generate Temporary Password</span>
                      <span className="text-[11px] text-slate-500">
                        Generates a cryptographic temporary password shown immediately once to the admin.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-3 rounded-xl border border-slate-200 hover:border-violet-300 cursor-pointer bg-slate-50/50">
                    <input
                      type="radio"
                      name="authMethod"
                      value="invite_link"
                      checked={portalUserForm.authMethod === 'invite_link'}
                      onChange={(e) => setPortalUserForm({ ...portalUserForm, authMethod: e.target.value })}
                      className="mt-0.5 text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Send Password Setup Link</span>
                      <span className="text-[11px] text-slate-500">
                        Dispatches a secure single-use invitation email with an expiring setup token.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-50 border border-violet-100 text-[11px] text-violet-900 flex items-start gap-2">
                <ShieldCheck size={16} className="text-violet-600 shrink-0 mt-0.5" />
                <span>
                  The client will automatically be assigned a unique Public Client ID (format: <strong>IW-CL-XXXXXX</strong>) with access to this client’s projects.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPortalUserModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Provisioning...' : 'Provision Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONE-TIME CREDENTIALS & SETUP LINK MODAL */}
      {oneTimeCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Key size={22} weight="duotone" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                    Portal Access Credentials Ready
                  </h3>
                  <p className="text-xs text-slate-500">
                    Share these login details directly with your client contact.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOneTimeCredentials(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Credential summary cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Public Client ID</span>
                  <strong className="font-mono text-base font-bold text-violet-700 tracking-wider">
                    {oneTimeCredentials.publicClientId}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(oneTimeCredentials.publicClientId);
                    showToast('Client ID copied', 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Copy size={14} />
                  <span>Copy ID</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Client Email</span>
                  <span className="font-mono text-xs text-slate-800 truncate block">
                    {oneTimeCredentials.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(oneTimeCredentials.email);
                    showToast('Email copied', 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                >
                  <Copy size={14} />
                  <span>Copy Email</span>
                </button>
              </div>

              {oneTimeCredentials.temporaryPassword && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
                      Temporary Password (Shown Once)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(oneTimeCredentials.temporaryPassword);
                        showToast('Password copied', 'success');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Copy size={14} />
                      <span>Copy Password</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 font-mono text-base font-bold text-emerald-700 tracking-wider select-all text-center">
                    {oneTimeCredentials.temporaryPassword}
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    The client will be prompted to set their own permanent password on their first sign-in.
                  </p>
                </div>
              )}

              {oneTimeCredentials.setupUrl && (
                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-violet-800">
                      Direct Password Setup Link (Expires in 7 Days)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(oneTimeCredentials.setupUrl);
                        showToast('Setup link copied', 'success');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Copy size={14} />
                      <span>Copy Setup Link</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-violet-200 font-mono text-[11px] text-slate-700 break-all select-all">
                    {oneTimeCredentials.setupUrl}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-violet-700">Client can click this link to create their password directly.</span>
                    <a
                      href={oneTimeCredentials.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-violet-700 hover:underline"
                    >
                      <span>Open Setup Page</span>
                      <ArrowSquareOut size={13} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp / Email Formatted Text Card */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const portalLoginUrl = `${window.location.origin}/client/login`;
                  const msg = `*InfronixWeb Client Portal Access:*\n\n` +
                    `• *Portal Login URL:* ${portalLoginUrl}\n` +
                    `• *Public Client ID:* ${oneTimeCredentials.publicClientId}\n` +
                    `• *Email:* ${oneTimeCredentials.email}\n` +
                    (oneTimeCredentials.temporaryPassword ? `• *Temporary Password:* ${oneTimeCredentials.temporaryPassword}\n` : '') +
                    (oneTimeCredentials.setupUrl ? `• *Password Setup Link:* ${oneTimeCredentials.setupUrl}\n` : '') +
                    `\nAccess your live project progress, deliverables, file requirements, and invoices anytime.`;
                  navigator.clipboard.writeText(msg);
                  showToast('Formatted WhatsApp / Email message copied!', 'success');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Copy size={16} weight="bold" />
                <span>Copy Message for WhatsApp / Email</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <a
                href="/client/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:text-violet-800 font-semibold inline-flex items-center gap-1"
              >
                <span>Preview Login Screen</span>
                <ArrowSquareOut size={13} />
              </a>
              <button
                type="button"
                onClick={() => setOneTimeCredentials(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={`Delete Client: ${deleteConfirm.title}?`}
        description="This will remove the client profile. Existing projects will remain in the database."
        confirmLabel="Delete Client"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
}
