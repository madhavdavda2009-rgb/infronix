"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ClientPortalShell from '@/components/client-portal/ClientPortalShell';
import UploadRequirementModal from '@/components/client-portal/UploadRequirementModal';
import { 
  FolderSimple, 
  GitPullRequest, 
  UploadSimple, 
  Eye, 
  CalendarCheck, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Warning,
  Sparkle
} from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

function DashboardContent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReqModal, setActiveReqModal] = useState({ isOpen: false, projectId: null, requirement: null });

  const searchParams = useSearchParams();
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const querySuffix = adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : '';
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [adminPreviewClientId]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const headers = {};
      if (adminPreviewClientId) {
        headers['x-admin-preview-client-id'] = adminPreviewClientId;
      }

      const res = await fetch(`/api/client/projects${adminPreviewClientId ? `?admin_preview_client_id=${adminPreviewClientId}` : ''}`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      showToast('Error loading project dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }

  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <ClientPortalShell
      title="Project Workspace"
      subtitle="Overview of your deliverables, live progress, and milestones"
      breadcrumbs={[{ label: 'Client Portal' }, { label: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-violet-200 mb-3 border border-white/10">
              <Sparkle size={13} weight="fill" className="text-amber-300" />
              Executive Client Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-outfit tracking-tight mb-2">
              Welcome to your Project Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Track live stage progression, test upcoming builds in the staging preview, submit change requests, and verify deliverables.
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div id="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderSimple size={20} className="text-violet-600" weight="bold" />
              <h3 className="text-sm font-bold text-slate-900 font-outfit">Your Active Projects</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {activeProjects.length} Active {activeProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-56 bg-white border border-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-xs text-slate-500">No active projects found for this workspace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 hover:border-violet-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 block mb-1">
                          {p.type || 'Business Project'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 font-outfit leading-snug">
                          {p.name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 shrink-0">
                        {p.status}
                      </span>
                    </div>

                    {/* Announcement if any */}
                    {p.client_announcement && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                        <Warning size={15} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>{p.client_announcement}</span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Stage Progression</span>
                        <span className="font-bold text-violet-700 font-mono">{p.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, p.progress_percentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stage & Milestone Meta */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Current Stage</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {p.current_stage || 'Development'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Target Deadline</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {p.deadline ? new Date(p.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    {p.preview_enabled && p.preview_url ? (
                      <Link
                        href={`/client/projects/${p.id}?tab=preview${adminPreviewClientId ? `&admin_preview_client_id=${adminPreviewClientId}` : ''}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <Eye size={15} weight="bold" className="text-emerald-600" />
                        <span>Live Preview</span>
                      </Link>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-medium">
                        Staging in progress
                      </div>
                    )}

                    <Link
                      href={`/client/projects/${p.id}${querySuffix}`}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-xs shadow-violet-600/20 flex items-center gap-1.5"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={14} weight="bold" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Projects if any */}
        {completedProjects.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Completed Handover Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedProjects.map(p => (
                <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600" weight="fill" />
                      <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Project Completed & Delivered</p>
                  </div>
                  <Link
                    href={`/client/projects/${p.id}${querySuffix}`}
                    className="text-xs font-semibold text-violet-600 hover:underline"
                  >
                    View Archive
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Requirement Modal */}
      {activeReqModal.isOpen && (
        <UploadRequirementModal
          isOpen={activeReqModal.isOpen}
          onClose={() => setActiveReqModal({ isOpen: false, projectId: null, requirement: null })}
          projectId={activeReqModal.projectId}
          requirement={activeReqModal.requirement}
          onSuccess={fetchProjects}
        />
      )}
    </ClientPortalShell>
  );
}

export default function ClientDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </React.Suspense>
  );
}
