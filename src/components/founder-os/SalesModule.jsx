"use client";
import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, MagnifyingGlass, Pencil, Trash, PhoneCall, FileText, Calendar, X, FolderPlus, EnvelopeSimple, ArrowsClockwise, Eye, CheckCircle, Warning, ArrowUpRight } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import ProjectWizardModal from './ProjectWizardModal';

const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Meeting',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost'
];

const LEAD_SOURCES = [
  'Website',
  'Website Contact Form',
  'Start Project Form',
  'Consultation Form',
  'Referral',
  'Cold Outreach',
  'Social Media',
  'Google Search',
  'Inbound Call',
  'Other'
];

const CALL_TYPES = [
  'Cold Call',
  'Follow-up',
  'Discovery',
  'Proposal',
  'Negotiation'
];

const CALL_OUTCOMES = [
  'Connected',
  'Left Voicemail',
  'Meeting Booked',
  'Not Interested',
  'Follow-up Required',
  'Deal Closed'
];

const PROPOSAL_STATUSES = [
  'Draft',
  'Sent',
  'Viewed',
  'Negotiation',
  'Accepted',
  'Rejected',
  'Expired'
];

export default function SalesModule({ initialSub = 'leads', settings = {}, onRefreshDashboard, onNavigate }) {
  const [subTab, setSubTab] = useState(initialSub); // 'leads' | 'enquiries' | 'pipeline' | 'calls' | 'proposals'
  const [leads, setLeads] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [calls, setCalls] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [emailStatusFilter, setEmailStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals & Drawers
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadDetail, setSelectedLeadDetail] = useState(null);
  const [selectedEnquiryDetail, setSelectedEnquiryDetail] = useState(null);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callLeadContext, setCallLeadContext] = useState(null);

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);

  // Project Setup Wizard Integration (Convert Lead / Proposal -> Project)
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardInitialData, setWizardInitialData] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  const { showToast } = useToast();
  const currency = settings.currency_symbol || '₹';

  useEffect(() => {
    fetchData();
  }, [subTab, search, statusFilter, sourceFilter, emailStatusFilter, sortBy, sortOrder]);

  async function fetchData() {
    setLoading(true);
    try {
      if (subTab === 'leads' || subTab === 'pipeline') {
        const res = await fetch(`/api/founder-os/leads?search=${encodeURIComponent(search)}&status=${statusFilter}&source=${sourceFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data = await res.json();
        if (data.success) setLeads(data.leads || []);
      } else if (subTab === 'enquiries') {
        const res = await fetch(`/api/founder-os/enquiries?search=${encodeURIComponent(search)}&status=${statusFilter}&emailStatus=${emailStatusFilter}&formType=${sourceFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data = await res.json();
        if (data.success) setEnquiries(data.enquiries || []);
      } else if (subTab === 'calls') {
        const res = await fetch('/api/founder-os/calls');
        const data = await res.json();
        if (data.success) setCalls(data.calls || []);
      } else if (subTab === 'proposals') {
        const res = await fetch('/api/founder-os/proposals');
        const data = await res.json();
        if (data.success) setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
      showToast('Error loading sales data', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Handle Retry Email on Website Enquiry
  async function handleRetryEmail(enquiryId, emailType) {
    setRetryLoading(true);
    try {
      const res = await fetch(`/api/founder-os/enquiries/${enquiryId}/retry-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailType })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Email (${emailType}) resent successfully.`, 'success');
        fetchData();
        if (selectedEnquiryDetail && selectedEnquiryDetail.id === enquiryId) {
          setSelectedEnquiryDetail(data.enquiry);
        }
      } else {
        showToast(data.error || 'Failed to resend email', 'error');
      }
    } catch (err) {
      showToast('Network error retrying email', 'error');
    } finally {
      setRetryLoading(false);
    }
  }

  // Handle Save Lead (Create or Edit)
  async function handleSaveLead(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      name: form.elements.namedItem('name').value,
      company: form.company.value,
      phone: form.phone.value,
      email: form.email.value,
      source: form.source.value,
      industry: form.industry.value,
      status: form.status.value,
      estimated_value: form.estimated_value.value,
      notes: form.notes.value,
      next_followup: form.next_followup.value || null
    };

    try {
      let res;
      if (editingLead) {
        res = await fetch(`/api/founder-os/leads/${editingLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingLead ? 'Lead updated successfully' : 'Lead created successfully', 'success');
        setShowLeadModal(false);
        setEditingLead(null);
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save lead', 'error');
      }
    } catch (err) {
      showToast('Network error saving lead', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Quick Status Transition
  async function handleQuickStatusChange(leadId, newStatus) {
    try {
      const res = await fetch(`/api/founder-os/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Lead moved to ${newStatus}`, 'success');
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      }
    } catch (err) {
      showToast('Failed to update lead status', 'error');
    }
  }

  // Handle Save Call
  async function handleSaveCall(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      lead_id: form.lead_id?.value || (callLeadContext ? callLeadContext.id : null),
      lead_name: form.lead_name.value,
      call_date: form.call_date.value,
      call_type: form.call_type.value,
      outcome: form.outcome.value,
      notes: form.notes.value,
      next_action: form.next_action.value,
      next_action_date: form.next_action_date.value || null
    };

    try {
      const res = await fetch('/api/founder-os/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Call logged successfully', 'success');
        setShowCallModal(false);
        setCallLeadContext(null);
        fetchData();
      } else {
        showToast(data.error || 'Failed to log call', 'error');
      }
    } catch (err) {
      showToast('Error logging call', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Save Proposal
  async function handleSaveProposal(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      client_name: form.client_name.value,
      project_title: form.project_title.value,
      proposal_value: form.proposal_value.value,
      status: form.status.value,
      sent_date: form.sent_date.value || null,
      followup_date: form.followup_date.value || null,
      scope_summary: form.scope_summary.value,
      notes: form.notes.value
    };

    try {
      let res;
      if (editingProposal) {
        res = await fetch(`/api/founder-os/proposals/${editingProposal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingProposal ? 'Proposal updated' : 'Proposal created', 'success');
        setShowProposalModal(false);
        setEditingProposal(null);
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save proposal', 'error');
      }
    } catch (err) {
      showToast('Error saving proposal', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Convert Lead to Project (Launch Wizard)
  function handleConvertLeadToProject(lead) {
    setWizardInitialData({ lead });
    setShowWizardModal(true);
  }

  // Convert Proposal to Project (Launch Wizard)
  function handleConvertProposalToProject(proposal) {
    setWizardInitialData({ proposal });
    setShowWizardModal(true);
  }

  // Handle Delete Confirmation Execution
  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      let endpoint = '';
      if (deleteConfirm.type === 'lead') endpoint = `/api/founder-os/leads/${deleteConfirm.id}`;
      else if (deleteConfirm.type === 'call') endpoint = `/api/founder-os/calls/${deleteConfirm.id}`;
      else if (deleteConfirm.type === 'proposal') endpoint = `/api/founder-os/proposals/${deleteConfirm.id}`;
      else if (deleteConfirm.type === 'enquiry') endpoint = `/api/founder-os/enquiries/${deleteConfirm.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Record deleted successfully', 'success');
        setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
        fetchData();
        if (selectedLeadDetail?.id === deleteConfirm.id) setSelectedLeadDetail(null);
        if (selectedEnquiryDetail?.id === deleteConfirm.id) setSelectedEnquiryDetail(null);
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete record', 'error');
      }
    } catch (err) {
      showToast('Error executing delete', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-navigation & Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('leads')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              subTab === 'leads' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Leads CRM
          </button>
          <button
            type="button"
            onClick={() => setSubTab('enquiries')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
              subTab === 'enquiries' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <EnvelopeSimple size={15} weight={subTab === 'enquiries' ? 'fill' : 'bold'} />
            <span>Website Enquiries</span>
            {enquiries.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${subTab === 'enquiries' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {enquiries.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('pipeline')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              subTab === 'pipeline' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Kanban Pipeline
          </button>
          <button
            type="button"
            onClick={() => setSubTab('calls')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              subTab === 'calls' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Call Logs
          </button>
          <button
            type="button"
            onClick={() => setSubTab('proposals')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              subTab === 'proposals' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Proposals
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {subTab === 'leads' || subTab === 'pipeline' ? (
            <button
              onClick={() => { setEditingLead(null); setShowLeadModal(true); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-violet-600/20 cursor-pointer active:scale-98 min-h-[40px]"
            >
              <Plus size={16} weight="bold" />
              <span>Add Lead</span>
            </button>
          ) : subTab === 'calls' ? (
            <button
              onClick={() => { setCallLeadContext(null); setShowCallModal(true); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-violet-600/20 cursor-pointer active:scale-98 min-h-[40px]"
            >
              <PhoneCall size={16} weight="bold" />
              <span>Log Call</span>
            </button>
          ) : (
            <button
              onClick={() => { setEditingProposal(null); setShowProposalModal(true); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-violet-600/20 cursor-pointer active:scale-98 min-h-[40px]"
            >
              <FileText size={16} weight="bold" />
              <span>Create Proposal</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. LEADS CRM VIEW */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex-1 min-w-[220px] relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, company, email, ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="ALL">All Statuses</option>
              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="ALL">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="created_at">Sort by Date</option>
              <option value="estimated_value">Sort by Value</option>
              <option value="name">Sort by Name</option>
              <option value="next_followup">Sort by Follow-up</option>
            </select>
          </div>

          {/* Leads Table */}
          {leads.length === 0 && !loading ? (
            <EmptyState
              icon={Briefcase}
              title="No leads yet"
              description="Start building your sales pipeline by adding your first prospect."
              actionLabel="Add Lead"
              onAction={() => { setEditingLead(null); setShowLeadModal(true); }}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Est. Value</th>
                      <th className="px-4 py-3">Next Follow-up</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">
                            {lead.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {lead.lead_id} • {lead.source}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {lead.company || '—'}
                          {lead.industry && (
                            <span className="block text-[10px] text-slate-500">{lead.industry}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {lead.email && <div className="truncate max-w-[160px] font-medium">{lead.email}</div>}
                          {lead.phone && <div className="text-[11px] text-slate-500">{lead.phone}</div>}
                          {!lead.email && !lead.phone && '—'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-2xs"
                          >
                            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 font-mono">
                          {currency}{parseFloat(lead.estimated_value || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {lead.next_followup ? (
                            <span className={`inline-flex items-center gap-1 font-medium ${
                              new Date(lead.next_followup) < new Date(new Date().setHours(0,0,0,0))
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-700'
                            }`}>
                              <Calendar size={13} />
                              {new Date(lead.next_followup).toLocaleDateString()}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Convert to Project Button */}
                            <button
                              onClick={() => handleConvertLeadToProject(lead)}
                              title="Convert to Project (Launch Wizard)"
                              className="px-2.5 py-1 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-200 transition-colors font-bold text-[10px] uppercase flex items-center gap-1"
                            >
                              <FolderPlus size={14} weight="bold" />
                              <span className="hidden sm:inline">Convert</span>
                            </button>

                            <button
                              onClick={() => { setCallLeadContext(lead); setShowCallModal(true); }}
                              title="Log Call"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            >
                              <PhoneCall size={16} />
                            </button>
                            <button
                              onClick={() => { setEditingLead(lead); setShowLeadModal(true); }}
                              title="Edit Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'lead', id: lead.id, title: lead.name })}
                              title="Delete Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash size={16} />
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

      {/* 1.5. WEBSITE ENQUIRIES VIEW */}
      {subTab === 'enquiries' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex-1 min-w-[220px] relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search enquiries by reference ID, name, email, company, service..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={emailStatusFilter}
              onChange={(e) => setEmailStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="ALL">All Email Statuses</option>
              <option value="Sent">Sent (Delivered)</option>
              <option value="Failed">Failed (Needs Retry)</option>
              <option value="Configuration Missing">Config Missing</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="ALL">All Form Sources</option>
              <option value="Start Project Form">Start Project Form</option>
              <option value="Consultation Form">Consultation Form</option>
              <option value="Website Contact Form">Website Contact Form</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="created_at">Sort by Date</option>
              <option value="full_name">Sort by Name</option>
              <option value="reference_id">Sort by Ref ID</option>
            </select>
          </div>

          {/* Enquiries Table */}
          {enquiries.length === 0 && !loading ? (
            <EmptyState
              icon={EnvelopeSimple}
              title="No website enquiries yet"
              description="New enquiries from website contact and quote forms will automatically show up here and sync with your Leads CRM."
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Reference ID</th>
                      <th className="px-4 py-3">Client / Visitor</th>
                      <th className="px-4 py-3">Service & Form</th>
                      <th className="px-4 py-3">Customer Email</th>
                      <th className="px-4 py-3">Admin Email</th>
                      <th className="px-4 py-3">CRM Lead</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-violet-700">
                          {enq.reference_id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {enq.full_name}
                            {enq.status === 'Pending Verification' && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] uppercase font-bold rounded">Pending Verify</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {enq.status === 'Pending Verification' ? (enq.email || '').replace(/^(.)(.*)(@.*)$/, '$1***$3') : enq.email}
                          </div>
                          {enq.phone && <div className="text-[10px] text-slate-400">{enq.phone}</div>}
                          {enq.company && <div className="text-[10px] text-slate-600 font-semibold mt-0.5">{enq.company}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{enq.selected_service || 'General Enquiry'}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                            {enq.form_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.customer_email_status === 'Sent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : enq.customer_email_status === 'Failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : enq.customer_email_status === 'Configuration Missing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {enq.customer_email_status === 'Sent' && <CheckCircle size={12} weight="fill" />}
                            {enq.customer_email_status === 'Failed' && <Warning size={12} weight="fill" />}
                            {enq.customer_email_status}
                          </span>
                          {enq.customer_email_status === 'Failed' && (
                            <button
                              disabled={retryLoading}
                              onClick={() => handleRetryEmail(enq.id, 'customer')}
                              title="Retry Customer Confirmation Email"
                              className="ml-1.5 p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              <ArrowsClockwise size={12} className={retryLoading ? 'animate-spin' : ''} />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.admin_email_status === 'Sent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : enq.admin_email_status === 'Failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : enq.admin_email_status === 'Configuration Missing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {enq.admin_email_status === 'Sent' && <CheckCircle size={12} weight="fill" />}
                            {enq.admin_email_status === 'Failed' && <Warning size={12} weight="fill" />}
                            {enq.admin_email_status}
                          </span>
                          {enq.admin_email_status === 'Failed' && (
                            <button
                              disabled={retryLoading}
                              onClick={() => handleRetryEmail(enq.id, 'admin')}
                              title="Retry Admin Notification Email"
                              className="ml-1.5 p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              <ArrowsClockwise size={12} className={retryLoading ? 'animate-spin' : ''} />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {enq.crm_lead_code ? (
                            <button
                              onClick={() => {
                                setSubTab('leads');
                                setSearch(enq.crm_lead_code);
                              }}
                              className="font-mono font-bold text-[11px] text-violet-700 hover:underline flex items-center gap-1"
                            >
                              <span>{enq.crm_lead_code}</span>
                              <ArrowUpRight size={12} />
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedEnquiryDetail(enq)}
                              title="View Full Enquiry Details"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            {enq.status !== 'Pending Verification' && (
                              <button
                                onClick={() => {
                                  setWizardInitialData({
                                    client_name: enq.company || enq.full_name,
                                    project_name: enq.selected_service ? `${enq.selected_service} - ${enq.company || enq.full_name}` : `Project for ${enq.full_name}`,
                                    lead_id: enq.lead_id || null,
                                    project_value: 0,
                                    project_type: 'Business Website',
                                    notes: `Imported from Enquiry ${enq.reference_id}:\n${enq.project_description || enq.message || ''}`
                                  });
                                  setShowWizardModal(true);
                                }}
                                title="Start Project Setup Wizard"
                                className="px-2 py-1 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-200 transition-colors font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <FolderPlus size={14} weight="bold" />
                                <span className="hidden sm:inline">Project</span>
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'enquiry', id: enq.id, title: `Enquiry ${enq.reference_id}` })}
                              title="Delete Enquiry"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash size={16} />
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

      {/* 2. KANBAN PIPELINE VIEW */}
      {subTab === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {LEAD_STATUSES.map((status) => {
            const stageLeads = leads.filter(l => l.status === status);
            const stageValue = stageLeads.reduce((sum, l) => sum + parseFloat(l.estimated_value || 0), 0);

            return (
              <div
                key={status}
                className="w-72 shrink-0 rounded-2xl bg-slate-100/70 border border-slate-200 flex flex-col max-h-[75vh] shadow-2xs"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-200 bg-white rounded-t-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {status}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono font-bold">
                      {currency}{stageValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Body Cards */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
                      No leads
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3 rounded-xl bg-white hover:border-violet-300 border border-slate-200 transition-all shadow-2xs group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                            {lead.name}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-600">
                            {currency}{parseFloat(lead.estimated_value || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {lead.company && (
                          <div className="text-[11px] text-slate-600 mb-2 truncate">
                            {lead.company}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                          <button
                            onClick={() => handleConvertLeadToProject(lead)}
                            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <FolderPlus size={13} weight="bold" />
                            <span>Convert</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setEditingLead(lead); setShowLeadModal(true); }}
                              className="p-1 rounded text-slate-400 hover:text-violet-600"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => { setCallLeadContext(lead); setShowCallModal(true); }}
                              className="p-1 rounded text-slate-400 hover:text-sky-600"
                            >
                              <PhoneCall size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. SALES CALLS VIEW */}
      {subTab === 'calls' && (
        <div className="space-y-4">
          {calls.length === 0 && !loading ? (
            <EmptyState
              icon={PhoneCall}
              title="No sales calls recorded"
              description="Log cold calls, discovery calls, follow-ups, and negotiation notes."
              actionLabel="Log First Call"
              onAction={() => { setCallLeadContext(null); setShowCallModal(true); }}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Lead / Prospect</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Call Type</th>
                      <th className="px-4 py-3">Outcome</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3">Next Action</th>
                      <th className="px-4 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calls.map((call) => (
                      <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {call.lead_name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(call.call_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                            {call.call_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {call.outcome}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {call.notes || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {call.next_action ? (
                            <div>
                              <span className="text-slate-900 font-semibold">{call.next_action}</span>
                              {call.next_action_date && (
                                <span className="block text-[10px] text-slate-500">
                                  {new Date(call.next_action_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'call', id: call.id, title: `Call with ${call.lead_name}` })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash size={16} />
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

      {/* 4. PROPOSALS VIEW */}
      {subTab === 'proposals' && (
        <div className="space-y-4">
          {proposals.length === 0 && !loading ? (
            <EmptyState
              icon={FileText}
              title="No proposals created yet"
              description="Generate, track, and monitor client proposals."
              actionLabel="Create Proposal"
              onAction={() => { setEditingProposal(null); setShowProposalModal(true); }}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Project Title</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Sent Date</th>
                      <th className="px-4 py-3">Follow-up</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proposals.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {prop.client_name}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-semibold">
                          {prop.project_title}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 font-mono">
                          {currency}{parseFloat(prop.proposal_value || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prop.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : prop.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {prop.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {prop.sent_date ? new Date(prop.sent_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {prop.followup_date ? new Date(prop.followup_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Create Project from Proposal Button */}
                            <button
                              onClick={() => handleConvertProposalToProject(prop)}
                              title="Create Project from Proposal"
                              className="px-2.5 py-1 rounded-lg text-violet-700 hover:text-violet-800 hover:bg-violet-50 border border-violet-200 transition-colors font-bold text-[10px] uppercase flex items-center gap-1"
                            >
                              <FolderPlus size={14} weight="bold" />
                              <span className="hidden sm:inline">Project</span>
                            </button>

                            <button
                              onClick={() => { setEditingProposal(prop); setShowProposalModal(true); }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'proposal', id: prop.id, title: prop.project_title })}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash size={16} />
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

      {/* --- MODAL 1: ADD / EDIT LEAD --- */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h3>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prospect / Contact Name *</label>
                  <input
                    name="name"
                    defaultValue={editingLead?.name || ''}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Name</label>
                  <input
                    name="company"
                    defaultValue={editingLead?.company || ''}
                    placeholder="e.g. Apex Hospital"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={editingLead?.phone || ''}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingLead?.email || ''}
                    placeholder="rahul@company.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source</label>
                  <select
                    name="source"
                    defaultValue={editingLead?.source || 'Website'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Industry</label>
                  <input
                    name="industry"
                    defaultValue={editingLead?.industry || ''}
                    placeholder="e.g. Healthcare"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingLead?.status || 'New'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Value ({currency})</label>
                  <input
                    name="estimated_value"
                    type="number"
                    defaultValue={editingLead?.estimated_value || 0}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Follow-up Date</label>
                  <input
                    name="next_followup"
                    type="date"
                    defaultValue={editingLead?.next_followup ? String(editingLead.next_followup).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes & Lead Context</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingLead?.notes || ''}
                  placeholder="Key prospect pain points, budget constraints..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: LOG SALES CALL --- */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Log Sales Call
              </h3>
              <button onClick={() => setShowCallModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCall} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lead / Contact Name *</label>
                <input
                  name="lead_name"
                  defaultValue={callLeadContext?.name || ''}
                  required
                  placeholder="e.g. Dr. Rajesh Patel"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Call Type</label>
                  <select
                    name="call_type"
                    defaultValue="Discovery"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium"
                  >
                    {CALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Outcome</label>
                  <select
                    name="outcome"
                    defaultValue="Connected"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium"
                  >
                    {CALL_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Call Date & Time</label>
                <input
                  name="call_date"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().substring(0, 16)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Call Discussion Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Discussion points, objections, budget range..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Action</label>
                  <input
                    name="next_action"
                    placeholder="e.g. Send 3D proposal"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Action Due Date</label>
                  <input
                    name="next_action_date"
                    type="date"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCallModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Call Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CREATE / EDIT PROPOSAL --- */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingProposal ? 'Edit Proposal' : 'Create Proposal'}
              </h3>
              <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client Name *</label>
                  <input
                    name="client_name"
                    defaultValue={editingProposal?.client_name || ''}
                    required
                    placeholder="e.g. Apex Hospital Pvt Ltd"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Scope Title *</label>
                  <input
                    name="project_title"
                    defaultValue={editingProposal?.project_title || ''}
                    required
                    placeholder="e.g. Modern Web Portal & Interactive Design"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quoted Value ({currency}) *</label>
                  <input
                    name="proposal_value"
                    type="number"
                    defaultValue={editingProposal?.proposal_value || 0}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingProposal?.status || 'Draft'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium"
                  >
                    {PROPOSAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date Sent</label>
                  <input
                    name="sent_date"
                    type="date"
                    defaultValue={editingProposal?.sent_date ? String(editingProposal.sent_date).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Follow-up Date</label>
                  <input
                    name="followup_date"
                    type="date"
                    defaultValue={editingProposal?.followup_date ? String(editingProposal.followup_date).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Scope & Deliverables Summary</label>
                <textarea
                  name="scope_summary"
                  rows={2}
                  defaultValue={editingProposal?.scope_summary || ''}
                  placeholder="Key features included in this quote..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingProposal ? 'Update Proposal' : 'Save Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ENQUIRY DETAILS MODAL --- */}
      {selectedEnquiryDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                  {selectedEnquiryDetail.reference_id}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-outfit mt-1">
                  Enquiry: {selectedEnquiryDetail.full_name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiryDetail(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Contact Info Grid */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Full Name</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.full_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Email Address</span>
                  <a href={`mailto:${selectedEnquiryDetail.email}`} className="font-semibold text-violet-700 hover:underline">
                    {selectedEnquiryDetail.status === 'Pending Verification' ? (selectedEnquiryDetail.email || '').replace(/^(.)(.*)(@.*)$/, '$1***$3') : selectedEnquiryDetail.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Phone / WhatsApp</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Company</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.company || 'Not provided'}</span>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Selected Service</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.selected_service || 'General'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Target Budget</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.budget || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Preferred Timeline</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.preferred_start_date || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Source Form</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.form_type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Source Page</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiryDetail.source_page || '/'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Submission Date</span>
                  <span className="font-semibold text-slate-900">
                    {selectedEnquiryDetail.created_at ? new Date(selectedEnquiryDetail.created_at).toLocaleString() : '—'}
                  </span>
                </div>
              </div>

              {/* Message / Requirements */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Project Description / Message</span>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiryDetail.project_description || selectedEnquiryDetail.message || 'No description provided.'}
                </div>
              </div>

              {/* Email Delivery Status Card */}
              <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <EnvelopeSimple size={15} className="text-violet-600" />
                    <span>Email Automated Delivery Status</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {selectedEnquiryDetail.status === 'Pending Verification' && `Verify Attempts: ${selectedEnquiryDetail.verification_attempts || 0} | `}
                    Email Attempts: {selectedEnquiryDetail.email_attempt_count || 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Customer Confirmation</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedEnquiryDetail.customer_email_status === 'Sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedEnquiryDetail.customer_email_status === 'Failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedEnquiryDetail.customer_email_status}
                      </span>
                    </div>
                    {selectedEnquiryDetail.customer_email_message_id && (
                      <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                        ID: {selectedEnquiryDetail.customer_email_message_id}
                      </div>
                    )}
                    <button
                      disabled={retryLoading}
                      onClick={() => handleRetryEmail(selectedEnquiryDetail.id, 'customer')}
                      className="mt-2 w-full py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <ArrowsClockwise size={12} className={retryLoading ? 'animate-spin' : ''} />
                      <span>Retry Customer Email</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Admin Notification</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedEnquiryDetail.admin_email_status === 'Sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedEnquiryDetail.admin_email_status === 'Failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedEnquiryDetail.admin_email_status}
                      </span>
                    </div>
                    {selectedEnquiryDetail.admin_email_message_id && (
                      <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                        ID: {selectedEnquiryDetail.admin_email_message_id}
                      </div>
                    )}
                    <button
                      disabled={retryLoading}
                      onClick={() => handleRetryEmail(selectedEnquiryDetail.id, 'admin')}
                      className="mt-2 w-full py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <ArrowsClockwise size={12} className={retryLoading ? 'animate-spin' : ''} />
                      <span>Retry Admin Notification</span>
                    </button>
                  </div>
                </div>

                {selectedEnquiryDetail.last_email_error && (
                  <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-700 font-mono">
                    Last Error: {selectedEnquiryDetail.last_email_error}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirm({
                      isOpen: true,
                      type: 'enquiry',
                      id: selectedEnquiryDetail.id,
                      title: `Enquiry #${selectedEnquiryDetail.reference_id} (${selectedEnquiryDetail.full_name})`
                    });
                  }}
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash size={14} />
                  <span>Delete Enquiry</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedEnquiryDetail.crm_lead_code && (
                    <button
                      type="button"
                      onClick={() => {
                        const code = selectedEnquiryDetail.crm_lead_code;
                        setSelectedEnquiryDetail(null);
                        setSubTab('leads');
                        setSearch(code);
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>View in Leads CRM ({selectedEnquiryDetail.crm_lead_code})</span>
                      <ArrowUpRight size={14} />
                    </button>
                  )}

                  {selectedEnquiryDetail.status !== 'Pending Verification' && (
                    <button
                      type="button"
                      onClick={() => {
                        const enq = selectedEnquiryDetail;
                        setSelectedEnquiryDetail(null);
                        setWizardInitialData({
                          client_name: enq.company || enq.full_name,
                          project_name: enq.selected_service ? `${enq.selected_service} - ${enq.company || enq.full_name}` : `Project for ${enq.full_name}`,
                          lead_id: enq.lead_id || null,
                          project_value: 0,
                          project_type: 'Business Website',
                          notes: `Imported from Enquiry ${enq.reference_id}:\n${enq.project_description || enq.message || ''}`
                        });
                        setShowWizardModal(true);
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <FolderPlus size={15} weight="bold" />
                      <span>Start Project Wizard</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT SETUP WIZARD MODAL (Pre-filled from Lead / Proposal) */}
      {showWizardModal && <ProjectWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        initialData={wizardInitialData}
        currency={currency}
        onSuccess={() => {
          fetchData();
          if (onRefreshDashboard) onRefreshDashboard();
        }}
      />}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={`Delete ${deleteConfirm.title}?`}
        description="This action cannot be undone."
        confirmLabel="Confirm Delete"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
      />
    </div>
  );
}
