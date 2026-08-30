"use client";
import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  ArrowsClockwise, 
  MagnifyingGlass, 
  Sparkle, 
  PaperPlaneTilt, 
  Trash, 
  Pencil, 
  Globe, 
  EnvelopeSimple, 
  Buildings, 
  ClockCounterClockwise,
  CheckCircle,
  Warning,
  Tag,
  MapPin,
  X
} from "@phosphor-icons/react";
import AddLeadModal from './AddLeadModal';
import EmailStudioModal from './EmailStudioModal';
import SentHistoryModal from './SentHistoryModal';

const STATUS_FILTERS = [
  'ALL',
  'New',
  'Ready',
  'Email Generated',
  'Sent',
  'Replied',
  'Interested',
  'Not Interested',
  'Follow Up',
  'Converted'
];

export default function OutreachDashboard({ showToast }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusCounts, setStatusCounts] = useState({});
  const [totalLeads, setTotalLeads] = useState(0);

  // SMTP status
  const [smtpStatus, setSmtpStatus] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedStudioLead, setSelectedStudioLead] = useState(null);
  const [isSentHistoryOpen, setIsSentHistoryOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
    checkSmtpStatus();
  }, [statusFilter]);

  async function fetchLeads() {
    setLoading(true);
    try {
      let url = `/api/admin/email-automation/leads?status=${statusFilter}`;
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(data.data || []);
        setStatusCounts(data.statusCounts || {});
        setTotalLeads(data.total || 0);
      } else {
        showToast?.(data.error || 'Failed to fetch leads.', 'error');
      }
    } catch (err) {
      showToast?.('Error connecting to leads service.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function checkSmtpStatus() {
    try {
      const res = await fetch('/api/admin/email-automation/smtp-status');
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpStatus(data.data);
      }
    } catch (err) {
      console.warn('SMTP check failed:', err);
    }
  }

  async function handleSaveLead(leadData, id = null) {
    const isEdit = Boolean(id);
    const url = isEdit
      ? `/api/admin/email-automation/leads/${id}`
      : `/api/admin/email-automation/leads`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast?.(isEdit ? 'Lead updated successfully.' : 'New lead created.', 'success');
      fetchLeads();
    } else {
      throw new Error(data.error || 'Failed to save lead.');
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/email-automation/leads/${deletingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast?.('Lead deleted successfully.', 'success');
        setDeletingId(null);
        fetchLeads();
      } else {
        showToast?.(data.error || 'Failed to delete lead.', 'error');
      }
    } catch (err) {
      showToast?.('Error deleting lead.', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'new':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/40';
      case 'ready':
        return 'bg-amber-500/20 text-amber-200 border-amber-500/40';
      case 'email generated':
        return 'bg-purple-500/20 text-purple-200 border-purple-500/40';
      case 'sent':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40';
      case 'replied':
      case 'interested':
      case 'converted':
        return 'bg-green-500/30 text-green-100 border-green-400 font-bold';
      case 'not interested':
      case 'archived':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      case 'follow up':
        return 'bg-pink-500/20 text-pink-200 border-pink-500/40';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  const filteredLeads = leads.filter(l => {
    const term = searchTerm.toLowerCase();
    const company = (l.company_name || l.business_name || '').toLowerCase();
    const name = (l.name || '').toLowerCase();
    const email = (l.email || '').toLowerCase();
    const industry = (l.industry || l.category || '').toLowerCase();
    const loc = (l.location || '').toLowerCase();

    return (
      company.includes(term) ||
      name.includes(term) ||
      email.includes(term) ||
      industry.includes(term) ||
      loc.includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-950 p-5 border border-slate-800 relative overflow-hidden shadow-lg">
          <span className="font-label-caps text-xs text-slate-400 uppercase tracking-wider block font-semibold">
            Total Leads in System
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-headline-lg font-bold text-white">
              {totalLeads}
            </span>
            <Buildings className="text-slate-600 text-2xl" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Database records across all niches
          </p>
        </div>

        <div className="bg-slate-950 p-5 border border-purple-500/30 relative overflow-hidden shadow-lg">
          <span className="font-label-caps text-xs text-purple-300 uppercase tracking-wider block font-semibold">
            Emails Generated
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-headline-lg font-bold text-purple-200">
              {statusCounts['Email Generated'] || statusCounts['EMAIL GENERATED'] || 0}
            </span>
            <Sparkle className="text-purple-400 text-2xl" weight="fill" />
          </div>
          <p className="text-[11px] text-purple-300/80 mt-2">
            Personalized drafts prepared for review
          </p>
        </div>

        <div className="bg-slate-950 p-5 border border-emerald-500/30 relative overflow-hidden shadow-lg">
          <span className="font-label-caps text-xs text-emerald-300 uppercase tracking-wider block font-semibold">
            Sent Outreach
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-headline-lg font-bold text-emerald-200">
              {statusCounts['Sent'] || statusCounts['SENT'] || 0}
            </span>
            <PaperPlaneTilt className="text-emerald-400 text-2xl" weight="fill" />
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-2">
            Dispatched via Hostinger professional email
          </p>
        </div>

        <div className="bg-slate-950 p-5 border border-champagne-light/30 relative overflow-hidden shadow-lg">
          <span className="font-label-caps text-xs text-champagne-light uppercase tracking-wider block font-semibold">
            Hostinger Integration
          </span>
          <div className="flex items-center gap-2 mt-3">
            {smtpStatus?.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-label-caps uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle size={14} weight="fill" />
                Connected ({smtpStatus.senderEmail || 'Ready'})
              </span>
            ) : smtpStatus?.configured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-label-caps uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40" title={smtpStatus.message}>
                <Warning size={14} weight="fill" />
                Configured ({smtpStatus?.mode || 'Check Auth'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-label-caps uppercase bg-slate-800 text-slate-300 border border-slate-700">
                <Warning size={14} />
                Set .env Credentials
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {smtpStatus?.message || 'Hostinger API / SMTP configuration'}
          </p>
        </div>

      </div>

      {/* Action Controls & Filters Bar */}
      <div className="bg-slate-950 p-6 border border-champagne-light/30 flex flex-col gap-4 shadow-xl">
        
        {/* Search & Main Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" weight="bold" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
              placeholder="Search company, contact, email, niche..."
              className="w-full bg-slate-900 text-white font-body-md pl-10 pr-4 py-2.5 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsSentHistoryOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-champagne-light text-slate-200 text-xs uppercase font-label-caps tracking-widest transition-colors flex items-center gap-2 cursor-pointer font-bold"
            >
              <ClockCounterClockwise size={16} />
              <span>Sent History</span>
            </button>

            <button
              onClick={() => {
                setEditingLead(null);
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 bg-champagne-light hover:bg-white text-navy-muted text-xs uppercase font-label-caps tracking-widest font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus size={16} weight="bold" />
              <span>Add New Lead</span>
            </button>

            <button
              onClick={fetchLeads}
              className="p-2.5 border border-slate-700 hover:border-champagne-light text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Refresh Leads"
            >
              <ArrowsClockwise className={loading ? 'animate-spin' : ''} size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-850">
          <span className="text-[11px] font-label-caps text-slate-400 uppercase tracking-wider mr-1">
            Filter Status:
          </span>
          {STATUS_FILTERS.map((status) => {
            const count = status === 'ALL' ? totalLeads : (statusCounts[status] || 0);
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-label-caps uppercase tracking-wider transition-colors border cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === status
                    ? 'bg-champagne-light text-navy-muted border-champagne-light font-bold shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
                  statusFilter === status ? 'bg-navy-muted/30 text-navy-muted font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-body-md text-sm">
            <ArrowsClockwise className="animate-spin text-2xl mx-auto mb-2 text-champagne-light" />
            Loading outreach leads database...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-body-md text-sm">
            <Buildings className="text-3xl mx-auto mb-2 text-slate-600" />
            No leads found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body-md">
              <thead className="bg-navy-muted/90 text-champagne-light uppercase font-label-caps tracking-widest text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Company / Contact</th>
                  <th className="py-3.5 px-4 font-bold">Online Presence</th>
                  <th className="py-3.5 px-4 font-bold">Niche & Location</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Outreach Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredLeads.map((lead) => {
                  const companyName = lead.company_name || lead.business_name || 'Unnamed Company';
                  return (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Company & Contact */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-white text-sm">
                          {companyName}
                        </div>
                        {lead.name && (
                          <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                            <User size={12} className="shrink-0" />
                            <span>{lead.name}</span>
                          </div>
                        )}
                        {lead.company_description && (
                          <div className="text-[11px] text-slate-400 mt-1 max-w-xs truncate" title={lead.company_description}>
                            {lead.company_description}
                          </div>
                        )}
                      </td>

                      {/* Online Presence (Email & Web) */}
                      <td className="py-4 px-4 align-top">
                        {lead.email ? (
                          <div className="text-slate-200 flex items-center gap-1.5">
                            <EnvelopeSimple size={13} className="text-champagne-light shrink-0" />
                            <span className="font-mono text-[11px]">{lead.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No email listed</span>
                        )}

                        {lead.website ? (
                          <div className="text-slate-400 flex items-center gap-1.5 mt-1">
                            <Globe size={13} className="text-slate-400 shrink-0" />
                            <a 
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-slate-300 hover:text-champagne-light truncate max-w-[180px] hover:underline"
                            >
                              {lead.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] block mt-0.5">No website</span>
                        )}
                      </td>

                      {/* Industry & Location */}
                      <td className="py-4 px-4 align-top">
                        {(lead.industry || lead.category) ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-medium">
                            <Tag size={11} className="text-slate-400" />
                            {lead.industry || lead.category}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}

                        {lead.location && (
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-1.5">
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate max-w-[160px]">{lead.location}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-label-caps uppercase font-bold border tracking-wider ${getStatusBadge(lead.status)}`}>
                          {lead.status || 'New'}
                        </span>
                        {lead.personalization_context && (
                          <span className="block text-[10px] text-champagne-light/80 mt-1.5 truncate max-w-[140px]" title={lead.personalization_context}>
                            • Context Added
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          
                          {/* Main Generate / Open Studio CTA */}
                          <button
                            onClick={() => setSelectedStudioLead(lead)}
                            className="px-3 py-1.5 bg-champagne-light hover:bg-champagne-light/90 text-navy-muted text-xs uppercase font-label-caps tracking-wider font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                            title="Generate and preview personalized cold email"
                          >
                            <Sparkle size={13} weight="fill" />
                            <span>Generate Email</span>
                          </button>

                          {/* Edit Lead */}
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-900 border border-slate-700 hover:border-champagne-light text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Lead"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete Lead */}
                          <button
                            onClick={() => setDeletingId(lead.id)}
                            className="p-1.5 bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      {/* Email Preview & Studio Modal */}
      <EmailStudioModal
        isOpen={Boolean(selectedStudioLead)}
        onClose={() => setSelectedStudioLead(null)}
        lead={selectedStudioLead}
        onEmailSent={() => {
          fetchLeads();
          checkSmtpStatus();
        }}
        showToast={showToast}
      />

      {/* Sent History Modal */}
      <SentHistoryModal
        isOpen={isSentHistoryOpen}
        onClose={() => setIsSentHistoryOpen(false)}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-red-500/50 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-headline-lg text-lg text-white font-bold flex items-center gap-2">
              <Warning className="text-red-400" />
              Delete Lead Record?
            </h3>
            <p className="text-xs text-slate-300 font-body-md leading-relaxed">
              Are you sure you want to permanently delete this lead and its associated drafts? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-700 text-slate-300 text-xs uppercase font-label-caps tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-label-caps tracking-widest font-bold cursor-pointer"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
