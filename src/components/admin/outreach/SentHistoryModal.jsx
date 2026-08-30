"use client";
import { useState, useEffect } from 'react';
import { X, CheckCircle, Warning, Clock, EnvelopeOpen, MagnifyingGlass, ArrowsClockwise } from "@phosphor-icons/react";

export default function SentHistoryModal({ isOpen, onClose, showToast }) {
  const [sentList, setSentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSentHistory();
    }
  }, [isOpen]);

  async function fetchSentHistory() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-automation/sent');
      const data = await res.json();
      if (res.ok && data.success) {
        setSentList(data.data || []);
      } else {
        showToast?.(data.error || 'Failed to load sent emails', 'error');
      }
    } catch (err) {
      showToast?.('Error loading sent emails log.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const filtered = sentList.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.recipient || '').toLowerCase().includes(term) ||
      (item.subject || '').toLowerCase().includes(term) ||
      (item.company_name || '').toLowerCase().includes(term) ||
      (item.body || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-champagne-light/40 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-champagne-light/20 flex justify-between items-center bg-navy-muted/90 backdrop-blur-md">
          <div>
            <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest block font-bold">
              Dispatch History & Audit Log
            </span>
            <h2 className="font-headline-lg text-xl md:text-2xl text-white font-bold mt-0.5">
              Sent Cold Outreach Emails ({sentList.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSentHistory}
              className="p-2 border border-slate-700 hover:border-champagne-light text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh History"
            >
              <ArrowsClockwise size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 transition-colors cursor-pointer"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by recipient, company, subject..."
              className="w-full bg-slate-950 text-white font-body-md pl-9 pr-4 py-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-body-md">
              Loading sent history...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-body-md">
              No sent emails recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800 p-4 hover:border-champagne-light/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        To: {item.recipient}
                      </span>
                      {item.company_name && (
                        <span className="text-[11px] text-slate-400">
                          Company: {item.company_name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-label-caps uppercase font-bold border ${
                        item.status === 'Sent'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}>
                        {item.status === 'Sent' ? <CheckCircle size={12} weight="fill" /> : <Warning size={12} weight="fill" />}
                        {item.status}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock size={12} />
                        {new Date(item.sent_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-champagne-light font-semibold">
                      Subject: {item.subject}
                    </p>
                    
                    {item.error_message ? (
                      <p className="text-red-400 text-[11px] bg-red-950/40 p-2 border border-red-900 mt-2 font-mono">
                        Error: {item.error_message}
                      </p>
                    ) : (
                      <div className="mt-2 text-slate-300 bg-slate-950/80 p-3 border border-slate-800 font-mono text-[11px] whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {item.body}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase font-label-caps tracking-widest transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
