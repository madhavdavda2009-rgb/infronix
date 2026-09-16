"use client";
import React, { useState, useEffect } from 'react';
import { ClockCounterClockwise, ArrowsClockwise } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { useToast } from '@/context/ToastContext';

const ENTITY_TYPES = [
  'Lead',
  'Project',
  'Task',
  'Revenue',
  'Expense',
  'Person',
  'SOP',
  'Security',
  'Proposal',
  'Call',
  'Backup',
  'Settings'
];

export default function ActivityLogModule({ settings = {} }) {
  const [activities, setActivities] = useState([]);
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [entityFilter, limit]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/founder-os/activity?entity=${entityFilter}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities || []);
      }
    } catch (err) {
      showToast('Error loading activity logs', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="ALL">All Event Entities</option>
            {ENTITY_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value={25}>Last 25 Events</option>
            <option value={50}>Last 50 Events</option>
            <option value={100}>Last 100 Events</option>
          </select>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowsClockwise size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Activity Logs Table */}
      {activities.length === 0 && !loading ? (
        <EmptyState
          icon={ClockCounterClockwise}
          title="No audit events logged yet"
          description="Actions performed across the application (creating leads, recording revenue, updating projects) will appear here in chronological order."
        />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(act.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {act.user_name || 'Founder'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {act.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        act.action === 'Created'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : act.action === 'Deleted' || act.action === 'Reset'
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-sky-700 bg-sky-50 border-sky-200'
                      }`}>
                        {act.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {act.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
