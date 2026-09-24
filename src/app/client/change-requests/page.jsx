"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientPortalShell from '@/components/client-portal/ClientPortalShell';
import ChangeRequestDrawer from '@/components/client-portal/ChangeRequestDrawer';
import { GitPullRequest, CurrencyInr, Clock, CheckCircle, Warning, Plus } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

function ChangeRequestsContent() {
  const [changeRequests, setChangeRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCrId, setSelectedCrId] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const { showToast } = useToast();

  useEffect(() => {
    fetchChangeRequests();
  }, [filterStatus, adminPreviewClientId]);

  async function fetchChangeRequests() {
    setLoading(true);
    try {
      const headers = {};
      if (adminPreviewClientId) {
        headers['x-admin-preview-client-id'] = adminPreviewClientId;
      }
      const q = new URLSearchParams();
      if (adminPreviewClientId) q.set('admin_preview_client_id', adminPreviewClientId);
      if (filterStatus !== 'ALL') q.set('status', filterStatus);

      const res = await fetch(`/api/client/change-requests?${q.toString()}`, { headers });
      const data = await res.json();
      if (data.success) {
        setChangeRequests(data.change_requests || []);
      }
    } catch (err) {
      showToast('Error loading change requests', 'error');
    } finally {
      setLoading(false);
    }
  }

  const FILTERS = ['ALL', 'Submitted', 'Under Review', 'Quoted', 'Scheduled', 'In Progress', 'Completed'];

  return (
    <ClientPortalShell
      title="Change Requests"
      subtitle="Track all proposed revisions, quotations, and active work orders"
      breadcrumbs={[{ label: 'Client Portal', href: '/client/dashboard' }, { label: 'Change Requests' }]}
    >
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === f
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Requests' : f}
            </button>
          ))}
        </div>

        {/* List Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : changeRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No change requests found matching this filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {changeRequests.map((cr) => (
                <div
                  key={cr.id}
                  onClick={() => setSelectedCrId(cr.id)}
                  className="py-4 px-3 -mx-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[10px] text-violet-900 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                        {cr.reference_id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700">
                        {cr.project_display_name || cr.project_name}
                      </span>
                      <span className="text-[10px] text-slate-400">• {cr.category}</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{cr.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cr.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {cr.status}
                    </span>
                    {cr.quote_amount > 0 && (
                      <div className="text-xs font-bold text-purple-900 font-mono mt-1">
                        ₹{parseFloat(cr.quote_amount).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCrId && (
        <ChangeRequestDrawer
          isOpen={Boolean(selectedCrId)}
          onClose={() => setSelectedCrId(null)}
          changeRequestId={selectedCrId}
          onUpdate={fetchChangeRequests}
        />
      )}
    </ClientPortalShell>
  );
}

export default function ClientChangeRequestsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ChangeRequestsContent />
    </React.Suspense>
  );
}
