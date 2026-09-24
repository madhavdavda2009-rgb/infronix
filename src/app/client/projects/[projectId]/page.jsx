"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ClientPortalShell from '@/components/client-portal/ClientPortalShell';
import LivePreviewFrame from '@/components/client-portal/LivePreviewFrame';
import CreateChangeRequestModal from '@/components/client-portal/CreateChangeRequestModal';
import ChangeRequestDrawer from '@/components/client-portal/ChangeRequestDrawer';
import UploadRequirementModal from '@/components/client-portal/UploadRequirementModal';
import DeliverableApprovalModal from '@/components/client-portal/DeliverableApprovalModal';
import { useClientPortal } from '@/context/ClientPortalContext';
import {
  FolderSimple,
  GitPullRequest,
  Eye,
  CheckCircle,
  Clock,
  CurrencyInr,
  FileText,
  UploadSimple,
  Plus,
  ShieldCheck,
  Warning,
  ListChecks,
  CalendarCheck,
  DownloadSimple
} from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

function ProjectWorkspaceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params?.projectId;
  const adminPreviewClientId = searchParams?.get('admin_preview_client_id');
  const initialTab = searchParams?.get('tab') || 'overview';
  const initialCrId = searchParams?.get('crId');

  const { getProjectBundleCached, invalidateCache } = useClientPortal();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [project, setProject] = useState(null);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [payments, setPayments] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateCr, setShowCreateCr] = useState(false);
  const [selectedCrId, setSelectedCrId] = useState(initialCrId ? parseInt(initialCrId, 10) : null);
  const [uploadReqModal, setUploadReqModal] = useState({ isOpen: false, req: null });
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, type: 'Deliverable', title: '', version: '1.0' });

  const { showToast } = useToast();

  const fetchProjectData = React.useCallback(async (force = false) => {
    if (!projectId) return;
    if (force || !project) setLoading(true);
    try {
      const data = await getProjectBundleCached(projectId, force);
      if (data.success) {
        if (data.project) setProject(data.project);
        if (data.stages) setStages(data.stages || []);
        if (data.tasks) setTasks(data.tasks || []);
        if (data.requirements) setRequirements(data.requirements || []);
        if (data.payments) setPayments(data.payments);
        if (data.documents) setDocuments(data.documents || []);
        if (data.change_requests) setChangeRequests(data.change_requests || []);
      }
    } catch (err) {
      showToast('Error loading project details', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId, getProjectBundleCached, showToast, project]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, adminPreviewClientId]);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: FolderSimple },
    { id: 'stages', label: 'Milestones & Stages', icon: CalendarCheck, badge: stages.length },
    ...(project?.preview_enabled ? [{ id: 'preview', label: 'Live Preview', icon: Eye }] : []),
    { id: 'requirements', label: 'Requirements', icon: UploadSimple, badge: requirements.filter(r => r.status === 'Pending').length },
    { id: 'change-requests', label: 'Change Requests', icon: GitPullRequest, badge: changeRequests.filter(c => c.status !== 'Completed' && c.status !== 'Cancelled').length },
    { id: 'tasks', label: 'Client Tasks', icon: ListChecks, badge: tasks.length },
    ...(project?.visible_financials !== false ? [{ id: 'payments', label: 'Payments & Invoices', icon: CurrencyInr }] : []),
    { id: 'documents', label: 'Documents', icon: FileText, badge: documents.length }
  ];

  if (loading) {
    return (
      <ClientPortalShell title="Loading Project..." breadcrumbs={[{ label: 'Projects' }]}>
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </ClientPortalShell>
    );
  }

  if (!project) {
    return (
      <ClientPortalShell title="Project Not Found" breadcrumbs={[{ label: 'Projects' }]}>
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <p className="text-xs text-slate-500">Project not found or not assigned to your account.</p>
        </div>
      </ClientPortalShell>
    );
  }

  return (
    <ClientPortalShell
      title={project.name}
      subtitle={project.type || 'Project Deliverable'}
      breadcrumbs={[
        { label: 'Projects', href: '/client/dashboard#projects' },
        { label: project.name }
      ]}
    >
      <div className="space-y-6">
        {/* Project Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon size={16} weight={isActive ? 'bold' : 'regular'} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Banner Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-violet-700 tracking-wider">
                      {project.type || 'Project'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                      {project.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-outfit">{project.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  {project.preview_enabled && project.preview_url && (
                    <button
                      onClick={() => setActiveTab('preview')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye size={16} weight="bold" className="text-emerald-600" />
                      <span>Open Staging Preview</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowCreateCr(true)}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-xs shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} weight="bold" />
                    <span>Request Change</span>
                  </button>
                </div>
              </div>

              {/* Progress Summary */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Milestone Stage Progress</span>
                  <span className="font-mono font-bold text-violet-700">{project.progress_percentage}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, project.progress_percentage)}%` }}
                  />
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Current Stage</span>
                  <span className="font-bold text-slate-800">{project.current_stage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Next Milestone</span>
                  <span className="font-bold text-slate-800">{project.next_milestone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Target Deadline</span>
                  <span className="font-bold text-slate-800">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Project Lead</span>
                  <span className="font-bold text-slate-800">{project.assigned_person}</span>
                </div>
              </div>

              {project.client_summary && (
                <div className="pt-2 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Project Brief:</strong> {project.client_summary}
                </div>
              )}
            </div>

            {/* Stages Stepper */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 font-outfit">Milestone Roadmaps & Deliverables</h3>

              <div className="space-y-3">
                {stages.map((stage, idx) => {
                  const isDone = stage.status === 'Completed';
                  const isInProgress = stage.status === 'In Progress';

                  return (
                    <div
                      key={stage.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : isInProgress
                          ? 'bg-violet-50/50 border-violet-200 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200/80 opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone ? 'bg-emerald-600 text-white' : isInProgress ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isDone ? <CheckCircle size={18} weight="bold" /> : <span className="font-bold text-xs">{idx + 1}</span>}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {stage.client_title || stage.stage_name}
                          </h4>
                          {stage.client_description && (
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{stage.client_description}</p>
                          )}
                          {stage.client_note && (
                            <p className="text-[11px] text-violet-700 mt-1 font-medium italic">{stage.client_note}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : isInProgress ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {stage.status}
                        </span>
                        {stage.target_date && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            Due: {new Date(stage.target_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. STAGES TAB */}
        {activeTab === 'stages' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-outfit">Project Stages & Progress Weights</h3>
            <div className="space-y-3">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{stage.client_title || stage.stage_name}</h4>
                      {stage.client_description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{stage.client_description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      stage.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {stage.status}
                    </span>

                    {stage.status === 'Completed' && (
                      <button
                        onClick={() => setApprovalModal({
                          isOpen: true,
                          type: 'Stage',
                          title: stage.client_title || stage.stage_name,
                          version: '1.0'
                        })}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Formal Approval
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LIVE PREVIEW TAB */}
        {activeTab === 'preview' && (
          <LivePreviewFrame
            projectId={project.id}
            previewUrl={project.preview_url}
            previewLabel={project.preview_label}
            previewStatus={project.preview_status}
            previewInstructions={project.preview_instructions}
            projectName={project.name}
            onOpenFeedback={() => setShowCreateCr(true)}
          />
        )}

        {/* 4. REQUIREMENTS TAB */}
        {activeTab === 'requirements' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-outfit">Requested Assets & Information</h3>
                <p className="text-[11px] text-slate-500">Provide assets, brand collateral, and content items needed for execution</p>
              </div>
            </div>

            {requirements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No pending requirements requested at this time.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirements.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-slate-900">{req.item_name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status === 'Received' ? 'Verified' : req.status}
                        </span>
                      </div>
                      {req.notes && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">{req.notes}</p>
                      )}
                      {req.uploaded_file_name && (
                        <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
                          <span className="font-medium truncate">{req.uploaded_file_name}</span>
                          <span className="text-slate-400 shrink-0">{req.uploaded_file_size}</span>
                        </div>
                      )}
                      {req.admin_review_note && (
                        <div className="mt-1.5 text-[10px] text-violet-700 italic">
                          Feedback: {req.admin_review_note}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                      <button
                        onClick={() => setUploadReqModal({ isOpen: true, req })}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shadow-violet-600/20"
                      >
                        <UploadSimple size={14} weight="bold" />
                        <span>{req.status === 'Received' || req.status === 'Submitted' ? 'Replace File' : 'Upload File'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. CHANGE REQUESTS TAB */}
        {activeTab === 'change-requests' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-outfit">Change Requests & Revisions</h3>
                <p className="text-[11px] text-slate-500">Track requested adjustments, scope impact, and direct replies</p>
              </div>
              <button
                onClick={() => setShowCreateCr(true)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shadow-violet-600/20 cursor-pointer"
              >
                <Plus size={15} weight="bold" />
                <span>Submit Request</span>
              </button>
            </div>

            {changeRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No change requests submitted yet. Click above to propose an update.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {changeRequests.map((cr) => (
                  <div
                    key={cr.id}
                    onClick={() => setSelectedCrId(cr.id)}
                    className="py-3.5 px-3 -mx-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[10px] text-violet-900 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                          {cr.reference_id}
                        </span>
                        <span className="text-[10px] text-slate-400">{cr.category}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{cr.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cr.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
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
        )}

        {/* 6. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-outfit">Client-Facing Execution Tasks</h3>
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No public tasks scheduled yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{t.title}</h4>
                      {t.description && <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. PAYMENTS TAB */}
        {activeTab === 'payments' && payments && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-outfit">Payment Milestones & Invoices</h3>
              <p className="text-[11px] text-slate-500">Transparent contract value and approved milestone schedules</p>
            </div>

            {/* Financial Summary Cards */}
            {payments.summary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-1">Contract Value</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    ₹{payments.summary.contract_value.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-emerald-700 block text-[11px] mb-1">Paid Amount</span>
                  <span className="text-lg font-bold text-emerald-900 font-mono">
                    ₹{payments.summary.total_paid.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-amber-700 block text-[11px] mb-1">Pending Balance</span>
                  <span className="text-lg font-bold text-amber-900 font-mono">
                    ₹{payments.summary.outstanding.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* Schedules Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Milestone</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(payments.schedules || []).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-semibold text-slate-800">{s.name}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        ₹{parseFloat(s.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {s.due_date ? new Date(s.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-outfit">Deliverables & Documents</h3>

            {documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No documents published to this portal yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                        <FileText size={20} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-violet-700 block mb-0.5">
                          {doc.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">{doc.title}</h4>
                        <span className="text-[10px] text-slate-400">Version {doc.version} • {doc.file_size}</span>
                      </div>
                    </div>

                    {doc.is_download_allowed && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
                        title="Download Document"
                      >
                        <DownloadSimple size={16} weight="bold" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      {showCreateCr && (
        <CreateChangeRequestModal
          isOpen={showCreateCr}
          onClose={() => setShowCreateCr(false)}
          projectId={projectId}
          stages={stages}
          onSuccess={() => fetchProjectData(true)}
        />
      )}

      {selectedCrId && (
        <ChangeRequestDrawer
          isOpen={Boolean(selectedCrId)}
          onClose={() => setSelectedCrId(null)}
          changeRequestId={selectedCrId}
          onUpdate={() => fetchProjectData(true)}
        />
      )}

      {uploadReqModal.isOpen && (
        <UploadRequirementModal
          isOpen={uploadReqModal.isOpen}
          onClose={() => setUploadReqModal({ isOpen: false, req: null })}
          projectId={projectId}
          requirement={uploadReqModal.req}
          onSuccess={() => fetchProjectData(true)}
        />
      )}

      {approvalModal.isOpen && (
        <DeliverableApprovalModal
          isOpen={approvalModal.isOpen}
          onClose={() => setApprovalModal({ isOpen: false, type: 'Deliverable', title: '', version: '1.0' })}
          projectId={projectId}
          approvalType={approvalModal.type}
          deliverableTitle={approvalModal.title}
          deliverableVersion={approvalModal.version}
          onSuccess={() => fetchProjectData(true)}
        />
      )}
    </ClientPortalShell>
  );
}

export default function ClientProjectWorkspace() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProjectWorkspaceContent />
    </React.Suspense>
  );
}
