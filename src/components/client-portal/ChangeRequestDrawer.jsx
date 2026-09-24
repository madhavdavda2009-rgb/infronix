"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, 
  GitPullRequest, 
  PaperPlaneRight, 
  Clock, 
  CurrencyInr, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  CalendarCheck,
  Warning
} from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

export default function ChangeRequestDrawer({
  isOpen,
  onClose,
  changeRequestId,
  onUpdate
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [quoteDecisionLoading, setQuoteDecisionLoading] = useState(false);
  const [showQuoteConfirm, setShowQuoteConfirm] = useState({ isOpen: false, decision: 'Approved' });
  const [quoteNotes, setQuoteNotes] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && changeRequestId) {
      fetchDetail();
    }
  }, [isOpen, changeRequestId]);

  async function fetchDetail() {
    setLoading(true);
    try {
      const res = await fetch(`/api/client/change-requests/${changeRequestId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        showToast(json.error || 'Failed to load change request', 'error');
      }
    } catch (err) {
      showToast('Error loading change request', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/client/change-requests/${changeRequestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      });

      const json = await res.json();
      if (json.success) {
        setReplyMessage('');
        showToast('Message sent to InfronixWeb team', 'success');
        fetchDetail();
        onUpdate && onUpdate();
      } else {
        showToast(json.error || 'Failed to send message', 'error');
      }
    } catch (err) {
      showToast('Error sending message', 'error');
    } finally {
      setSendingReply(false);
    }
  }

  async function handleQuoteDecision(decision) {
    setQuoteDecisionLoading(true);
    try {
      const res = await fetch(`/api/client/change-requests/${changeRequestId}/quote-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          notes: quoteNotes
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Quotation ${decision.toLowerCase()} successfully!`, 'success');
        setShowQuoteConfirm({ isOpen: false, decision: 'Approved' });
        setQuoteNotes('');
        fetchDetail();
        onUpdate && onUpdate();
      } else {
        showToast(json.error || 'Failed to record quote decision', 'error');
      }
    } catch (err) {
      showToast('Error recording quote decision', 'error');
    } finally {
      setQuoteDecisionLoading(false);
    }
  }

  if (!isOpen) return null;

  const cr = data?.change_request;
  const comments = data?.comments || [];

  const statusColors = {
    'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'Quoted': 'bg-purple-50 text-purple-700 border-purple-200',
    'Awaiting Client Approval': 'bg-purple-50 text-purple-700 border-purple-200',
    'Scheduled': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Ready for Review': 'bg-teal-50 text-teal-700 border-teal-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
    'Cancelled': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const isQuotedState = cr && (cr.status === 'Quoted' || cr.status === 'Awaiting Client Approval') && cr.quote_amount > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform animate-slideInRight">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <GitPullRequest size={18} weight="bold" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-violet-900 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                  {cr?.reference_id || 'CR'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[cr?.status] || 'bg-slate-100 text-slate-700'}`}>
                  {cr?.status || 'Loading...'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 font-outfit truncate mt-0.5">
                {cr?.title || 'Change Request Details'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Request Meta Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Category</span>
                  <span className="font-semibold text-slate-700">{cr.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Priority</span>
                  <span className="font-semibold text-slate-700">{cr.client_priority}</span>
                </div>
                {cr.page_route && (
                  <div>
                    <span className="text-slate-400 block">Page / Route</span>
                    <span className="font-mono text-slate-700">{cr.page_route}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block">Submitted On</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(cr.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70">
                <span className="text-slate-400 block text-[11px] mb-1">Description</span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{cr.description}</p>
              </div>
            </div>

            {/* QUOTATION ASSESSMENT BOX (If Quoted) */}
            {cr.quote_amount > 0 && (
              <div className={`p-4 rounded-2xl border ${
                cr.client_quote_decision === 'Approved'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : cr.client_quote_decision === 'Rejected'
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-purple-50/80 border-purple-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CurrencyInr size={18} className="text-purple-700" weight="bold" />
                    <span className="font-bold text-xs text-purple-950 font-outfit">Scope & Cost Assessment (v{cr.quote_version || 1})</span>
                  </div>
                  {cr.client_quote_decision && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cr.client_quote_decision === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      Quote {cr.client_quote_decision}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                    <span className="text-slate-500 block">Estimated Cost</span>
                    <span className="text-base font-bold text-purple-900 font-mono">
                      ₹{parseFloat(cr.quote_amount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{cr.quote_tax_included ? '(Taxes included)' : '+ Applicable taxes'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                    <span className="text-slate-500 block">Timeline Impact</span>
                    <span className="text-sm font-bold text-slate-800">
                      {cr.timeline_impact_days ? `+${cr.timeline_impact_days} business day(s)` : 'Within milestone'}
                    </span>
                    {cr.estimated_completion_date && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Target: {new Date(cr.estimated_completion_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                {cr.admin_explanation && (
                  <div className="mb-3 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-xl border border-purple-100 leading-relaxed">
                    <strong>Admin Note:</strong> {cr.admin_explanation}
                  </div>
                )}

                {/* Approve / Reject Buttons (if awaiting decision) */}
                {isQuotedState && !cr.client_quote_decision && (
                  <div className="pt-2 border-t border-purple-200/80 flex items-center gap-2">
                    <button
                      onClick={() => setShowQuoteConfirm({ isOpen: true, decision: 'Approved' })}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-emerald-600/20"
                    >
                      <CheckCircle size={16} weight="bold" />
                      <span>Approve Quoted Change</span>
                    </button>
                    <button
                      onClick={() => setShowQuoteConfirm({ isOpen: true, decision: 'Rejected' })}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={16} weight="bold" />
                      <span>Decline Quote</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Conversation Messages Thread */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-slate-900 font-outfit uppercase tracking-wider text-[10px]">
                Discussion & Activity Thread
              </h3>

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">No messages yet.</p>
                ) : (
                  comments.map((c) => {
                    const isClient = c.sender_type === 'Client';
                    return (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                          isClient
                            ? 'bg-violet-50/50 border-violet-200/80 ml-4'
                            : 'bg-white border-slate-200 mr-4 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px]">
                          <span className={`font-bold ${isClient ? 'text-violet-900' : 'text-slate-900'}`}>
                            {c.sender_name} {isClient ? '(You)' : '• InfronixWeb Team'}
                          </span>
                          <span className="text-slate-400">
                            {new Date(c.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap">{c.message}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer: Message Reply Box */}
        <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type a message or question for the team..."
            className="flex-1 bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
          />
          <button
            type="submit"
            disabled={sendingReply || !replyMessage.trim()}
            className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-sm shadow-violet-600/20 disabled:opacity-50 cursor-pointer shrink-0"
            title="Send Message"
          >
            <PaperPlaneRight size={16} weight="bold" />
          </button>
        </form>
      </div>

      {/* Quote Confirmation Dialog */}
      {showQuoteConfirm.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                showQuoteConfirm.decision === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {showQuoteConfirm.decision === 'Approved' ? <CheckCircle size={22} weight="bold" /> : <Warning size={22} weight="bold" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-outfit">
                  {showQuoteConfirm.decision === 'Approved' ? 'Confirm Quote Approval' : 'Decline Quotation'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {showQuoteConfirm.decision === 'Approved'
                    ? `Authorise addition of ₹${(cr?.quote_amount || 0).toLocaleString('en-IN')} to project scope.`
                    : 'The team will be notified that this estimate was declined.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                {showQuoteConfirm.decision === 'Approved' ? 'Client Approval Notes (Optional)' : 'Reason / Feedback (Optional)'}
              </label>
              <textarea
                rows={2}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder={showQuoteConfirm.decision === 'Approved' ? 'e.g. Approved as discussed on discovery call' : 'e.g. Will reconsider in phase 2'}
                className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuoteConfirm({ isOpen: false, decision: 'Approved' })}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={quoteDecisionLoading}
                onClick={() => handleQuoteDecision(showQuoteConfirm.decision)}
                className={`px-5 py-2 rounded-xl text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
                  showQuoteConfirm.decision === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                {quoteDecisionLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{showQuoteConfirm.decision === 'Approved' ? 'Confirm & Authorise Quote' : 'Confirm Decline'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
