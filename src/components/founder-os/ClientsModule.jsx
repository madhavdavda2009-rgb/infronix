"use client";
import React, { useState, useEffect } from 'react';
import { Users, Plus, MagnifyingGlass, Trash, Phone, Envelope, Folder, ArrowLeft, X, CreditCard } from '@phosphor-icons/react';
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
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview' | 'projects' | 'sales' | 'finance'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      name: form.elements.namedItem('name').value,
      company: form.company.value,
      phone: form.phone.value,
      email: form.email.value,
      industry: form.industry.value,
      notes: form.notes.value
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
