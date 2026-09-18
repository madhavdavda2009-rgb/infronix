"use client";
import CreateTeamMember from './CreateTeamMember';
import React, { useState, useEffect } from 'react';
import { Folder, Plus, MagnifyingGlass, Pencil, Trash, CheckCircle, Calendar, X, ListChecks, ChatCircleText, ArrowLeft, CheckSquare, Square, CreditCard, HardDrives, Users, Warning, Check } from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import ProjectWizardModal from './ProjectWizardModal';

const PROJECT_STATUSES = [
  'Planning',
  'Design',
  'Development',
  'Review',
  'Client Feedback',
  'QA',
  'Deployment',
  'Completed',
  'On Hold'
];

const PROJECT_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function DeliveryModule({ initialProjectId, settings = {}, onRefreshDashboard, onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardInitialData, setWizardInitialData] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Record Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_date: new Date().toISOString().substring(0, 10),
    payment_method: 'Bank Transfer',
    invoice_number: '',
    notes: '',
    milestone_id: ''
  });

  // Convert Planned Cost Modal
  const [showConvertCostModal, setShowConvertCostModal] = useState(false);
  const [selectedCostToConvert, setSelectedCostToConvert] = useState(null);
  const [convertCostForm, setConvertCostForm] = useState({
    actual_amount: '',
    expense_date: new Date().toISOString().substring(0, 10),
    payment_method: 'UPI',
    notes: ''
  });

  // Add Requirement Modal
  const [showReqModal, setShowReqModal] = useState(false);
  const [newReqName, setNewReqName] = useState('');

  // Add Team Member Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedPersonRole, setSelectedPersonRole] = useState('Developer');

  // Project Completion Warning Guard
  const [completionWarning, setCompletionWarning] = useState({
    isOpen: false,
    outstanding: 0,
    unpassedQA: 0,
    pendingReqs: 0,
    targetStatus: 'Completed'
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();
  const currency = settings.currency_symbol || '₹';

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    if (initialProjectId) {
      loadProjectDetail(initialProjectId);
    } else {
      setSelectedProject(null);
      setProjectDetails(null);
    }
  }, [initialProjectId]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects?search=${encodeURIComponent(search)}&status=${statusFilter}&priority=${priorityFilter}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectDetail(projectId) {
    try {
      const res = await fetch(`/api/founder-os/projects/${projectId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedProject(data.project);
        setProjectDetails(data);
      }
    } catch (err) {
      showToast('Error loading project details', 'error');
    }
  }

  async function loadPeople() {
    try {
      const res = await fetch('/api/founder-os/people');
      const data = await res.json();
      if (data.success) setPeopleList((data.people || []).filter(person => person.status === 'Active'));
    } catch (err) {
      console.error('Error loading people list:', err);
    }
  }

  // Handle Project Quick Status Change (with completion guard)
  async function handleProjectStatusChange(newStatus) {
    if (!selectedProject) return;

    if (newStatus === 'Completed') {
      const outstanding = projectDetails?.financials?.outstanding || 0;
      const unpassedQA = projectDetails?.qaChecklist?.filter(q => !q.is_checked).length || 0;
      const pendingReqs = projectDetails?.requirements?.filter(r => r.status === 'Pending').length || 0;

      if (outstanding > 0 || unpassedQA > 0 || pendingReqs > 0) {
        setCompletionWarning({
          isOpen: true,
          outstanding,
          unpassedQA,
          pendingReqs,
          targetStatus: 'Completed'
        });
        return;
      }
    }

    await executeStatusUpdate(newStatus);
  }

  async function executeStatusUpdate(newStatus) {
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Project moved to ${newStatus}`, 'success');
        loadProjectDetail(selectedProject.id);
        fetchProjects();
        if (onRefreshDashboard) onRefreshDashboard();
      }
    } catch (err) {
      showToast('Failed to update project status', 'error');
    }
  }

  // Handle Record Payment
  async function handleRecordPayment(e) {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Payment of ${currency}${parseFloat(paymentForm.amount).toLocaleString('en-IN')} recorded`, 'success');
        setShowPaymentModal(false);
        setPaymentForm({
          amount: '',
          payment_date: new Date().toISOString().substring(0, 10),
          payment_method: 'Bank Transfer',
          invoice_number: '',
          notes: '',
          milestone_id: ''
        });
        loadProjectDetail(selectedProject.id);
        fetchProjects();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to record payment', 'error');
      }
    } catch (err) {
      showToast('Error recording payment', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Convert Planned Cost to Actual Expense
  async function handleConvertCostSubmit(e) {
    e.preventDefault();
    if (!selectedProject || !selectedCostToConvert) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/convert-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planned_cost_id: selectedCostToConvert.id,
          ...convertCostForm
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Planned cost converted to actual Expense record', 'success');
        setShowConvertCostModal(false);
        setSelectedCostToConvert(null);
        loadProjectDetail(selectedProject.id);
        fetchProjects();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to convert cost', 'error');
      }
    } catch (err) {
      showToast('Error converting cost', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Toggle Stage
  async function handleToggleStageStatus(stage) {
    if (!selectedProject) return;
    const nextStatus = stage.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/stages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: stage.id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        loadProjectDetail(selectedProject.id);
      }
    } catch (err) {
      showToast('Failed to update stage status', 'error');
    }
  }

  // Handle Requirement Status Toggle
  async function handleRequirementStatusChange(reqId, nextStatus) {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/requirements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement_id: reqId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        loadProjectDetail(selectedProject.id);
      }
    } catch (err) {
      showToast('Failed to update requirement', 'error');
    }
  }

  // Handle Add Requirement
  async function handleAddRequirement(e) {
    e.preventDefault();
    if (!selectedProject || !newReqName.trim()) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: newReqName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Requirement added', 'success');
        setNewReqName('');
        setShowReqModal(false);
        loadProjectDetail(selectedProject.id);
      }
    } catch (err) {
      showToast('Error adding requirement', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Add Team Member
  async function handleAddTeamMember(e) {
    e.preventDefault();
    if (!selectedProject || !selectedPersonId) return;
    const person = peopleList.find(p => String(p.id) === String(selectedPersonId));
    if (!person) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_id: person.id,
          person_name: person.name,
          role: selectedPersonRole
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Team member assigned', 'success');
        setShowTeamModal(false);
        loadProjectDetail(selectedProject.id);
      }
    } catch (err) {
      showToast('Error assigning team member', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveTeamMember(teamMemberId) {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/team?teamMemberId=${teamMemberId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Member removed from project', 'success');
        loadProjectDetail(selectedProject.id);
      }
    } catch (err) {
      showToast('Failed to remove team member', 'error');
    }
  }

  // Handle Save Task
  async function handleSaveTask(e) {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    const form = e.target;
    const payload = {
      title: form.title.value,
      description: form.description.value,
      assigned_to: form.assigned_to.value,
      priority: form.priority.value,
      status: form.status.value,
      stage_name: form.stage_name?.value || null,
      deadline: form.deadline.value || null
    };

    try {
      let res;
      if (editingTask) {
        res = await fetch(`/api/founder-os/projects/${selectedProject.id}/tasks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: editingTask.id, ...payload })
        });
      } else {
        res = await fetch(`/api/founder-os/projects/${selectedProject.id}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingTask ? 'Task updated' : 'Task created', 'success');
        setShowTaskModal(false);
        setEditingTask(null);
        loadProjectDetail(selectedProject.id);
        fetchProjects();
      } else {
        showToast(data.error || 'Failed to save task', 'error');
      }
    } catch (err) {
      showToast('Error saving task', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Quick Toggle Task Status
  async function handleToggleTaskStatus(task) {
    if (!selectedProject) return;
    const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        loadProjectDetail(selectedProject.id);
        fetchProjects();
      }
    } catch (err) {
      showToast('Failed to toggle task', 'error');
    }
  }

  // Handle QA Toggle Check
  async function handleToggleQA(qaItem) {
    if (!selectedProject) return;
    const newChecked = !qaItem.is_checked;
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/qa`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qaId: qaItem.id, is_checked: newChecked })
      });
      const data = await res.json();
      if (data.success) {
        loadProjectDetail(selectedProject.id);
        fetchProjects();
      }
    } catch (err) {
      showToast('Failed to update QA item', 'error');
    }
  }

  // Handle Save Feedback
  async function handleSaveFeedback(e) {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    const form = e.target;
    const payload = {
      author: form.author.value,
      feedback_text: form.feedback_text.value,
      feedback_date: form.feedback_date.value,
      status: form.status.value,
      action_plan: form.action_plan.value
    };

    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Feedback logged', 'success');
        setShowFeedbackModal(false);
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to log feedback', 'error');
      }
    } catch (err) {
      showToast('Error logging feedback', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Delete Confirmation Execution
  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      let endpoint = '';
      if (deleteConfirm.type === 'project') endpoint = `/api/founder-os/projects/${deleteConfirm.id}`;
      else if (deleteConfirm.type === 'task') endpoint = `/api/founder-os/projects/${selectedProject.id}/tasks?taskId=${deleteConfirm.id}`;
      else if (deleteConfirm.type === 'feedback') endpoint = `/api/founder-os/projects/${selectedProject.id}/feedback?feedbackId=${deleteConfirm.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Deleted successfully', 'success');
        setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
        if (deleteConfirm.type === 'project') {
          setSelectedProject(null);
          setProjectDetails(null);
          fetchProjects();
        } else if (selectedProject) {
          loadProjectDetail(selectedProject.id);
        }
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete record', 'error');
      }
    } catch (err) {
      showToast('Error deleting item', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const fin = projectDetails?.financials || {};
  const setup = projectDetails?.setup || {};
  const missingItems = setup.missingItems || [];

  return (
    <div className="space-y-6 pb-12">
      {/* If a project is selected, render Project 360° Command Center */}
      {selectedProject ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Top Bar with Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setSelectedProject(null); setProjectDetails(null); }}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Back to all projects"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                    {selectedProject.project_name}
                  </h2>
                  <select
                    value={selectedProject.status}
                    onChange={(e) => handleProjectStatusChange(e.target.value)}
                    className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-violet-50 text-violet-800 border border-violet-200 cursor-pointer focus:outline-none"
                  >
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedProject.project_type || 'Website'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                  <span>Client: <strong className="text-slate-800">{selectedProject.client_name}</strong></span>
                  {selectedProject.deadline && (
                    <span>• Due: <strong className="text-slate-700">{new Date(selectedProject.deadline).toLocaleDateString()}</strong></span>
                  )}
                  {selectedProject.assigned_person && <span>• Lead: {selectedProject.assigned_person}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPaymentForm({
                    amount: fin.outstanding ? String(fin.outstanding) : '',
                    payment_date: new Date().toISOString().substring(0, 10),
                    payment_method: 'Bank Transfer',
                    invoice_number: '',
                    notes: '',
                    milestone_id: ''
                  });
                  setShowPaymentModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs shadow-emerald-600/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
              >
                <CreditCard size={15} weight="bold" />
                <span>Record Payment</span>
              </button>

              <button
                onClick={() => {
                  setDeleteConfirm({ isOpen: true, type: 'project', id: selectedProject.id, title: selectedProject.project_name });
                }}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Delete Project"
              >
                <Trash size={17} />
              </button>
            </div>
          </div>

          {/* 360° Realized vs Projected Financial Command Center */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Contract Value</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {currency}{parseFloat(fin.contractValue || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
              <span className="text-emerald-700 text-[10px] uppercase font-bold block mb-1">Cash Received</span>
              <span className="text-sm font-bold text-emerald-800 font-mono">
                {currency}{parseFloat(fin.cashReceived || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
              <span className="text-amber-700 text-[10px] uppercase font-bold block mb-1">Outstanding</span>
              <span className="text-sm font-bold text-amber-800 font-mono">
                {currency}{parseFloat(fin.outstanding || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-xs">
              <span className="text-rose-700 text-[10px] uppercase font-bold block mb-1">Actual Expenses</span>
              <span className="text-sm font-bold text-rose-800 font-mono">
                {currency}{parseFloat(fin.actualExpenses || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Planned Costs</span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {currency}{parseFloat(fin.plannedCosts || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-200 shadow-xs">
              <span className="text-violet-700 text-[10px] uppercase font-bold block mb-1">Projected Profit</span>
              <span className="text-sm font-bold text-violet-900 font-mono">
                {currency}{parseFloat(fin.projectedProfit || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Setup Completion Indicator & Missing Items Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Project Setup Progress:
                </span>
                <span className="text-xs font-mono font-bold text-violet-700">
                  {setup.percentage || 0}% Complete
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
                <span className={setup.checklist?.client ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Client ✓</span>
                <span>•</span>
                <span className={setup.checklist?.finance ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Finance ✓</span>
                <span>•</span>
                <span className={setup.checklist?.paymentPlan ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Payment Plan ✓</span>
                <span>•</span>
                <span className={setup.checklist?.delivery ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Delivery Stages ✓</span>
                <span>•</span>
                <span className={setup.checklist?.team ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Team Staffed {setup.checklist?.team ? '✓' : '—'}</span>
                <span>•</span>
                <span className={setup.checklist?.requirements ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Requirements ✓</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${setup.percentage || 0}%` }}
              />
            </div>

            {/* Smart Missing Setup Warning Banner */}
            {missingItems.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold">
                  <Warning size={16} weight="bold" className="text-amber-600" />
                  <span>{missingItems.length} setup item{missingItems.length > 1 ? 's' : ''} still need attention:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
                  {missingItems.map(item => (
                    <li key={item.key}>{item.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Project Detail Subtabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs overflow-x-auto no-scrollbar w-full">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tasks', label: 'Tasks', badge: projectDetails?.tasks?.length },
              { id: 'stages', label: 'Delivery Stages', badge: projectDetails?.stages?.length },
              { id: 'finance', label: 'Finance & Profitability' },
              { id: 'payments', label: 'Payment Schedule', badge: projectDetails?.paymentSchedules?.length },
              { id: 'requirements', label: 'Client Requirements', badge: projectDetails?.requirements?.length },
              { id: 'team', label: 'Team', badge: projectDetails?.team?.length },
              { id: 'qa', label: 'QA Checklist', badge: `${projectDetails?.qaChecklist?.filter(q => q.is_checked).length || 0}/${projectDetails?.qaChecklist?.length || 0}` },
              { id: 'feedback', label: 'Feedback', badge: projectDetails?.feedback?.length },
              { id: 'activity', label: 'Activity' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 cursor-pointer ${
                  activeDetailTab === tab.id ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeDetailTab === tab.id ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Project & Client Scope
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Client Name</span>
                      <strong className="text-slate-900">{selectedProject.client_name}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Contact Email</span>
                      <strong className="text-slate-900">{selectedProject.client_email || '—'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Contact Phone</span>
                      <strong className="text-slate-900">{selectedProject.client_phone || '—'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Domain Manager</span>
                      <strong className="text-slate-900">{selectedProject.domain_manager || 'Not decided'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Hosting Manager</span>
                      <strong className="text-slate-900">{selectedProject.hosting_manager || 'Not decided'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1">Hosting Provider</span>
                      <strong className="text-slate-900">{selectedProject.hosting_provider || '—'}</strong>
                    </div>
                  </div>

                  {selectedProject.notes && (
                    <div className="pt-2">
                      <span className="text-slate-700 block text-xs font-bold mb-1.5">Project Scope / Technical Notes</span>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                        {selectedProject.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Status Sidebar */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Quality & Delivery Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                      <span className="font-semibold">Tasks Completed</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {projectDetails?.tasks?.filter(t => t.status === 'Completed').length || 0} / {projectDetails?.tasks?.length || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                      <span className="font-semibold">QA Criteria Verified</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {projectDetails?.qaChecklist?.filter(q => q.is_checked).length || 0} / {projectDetails?.qaChecklist?.length || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                      <span className="font-semibold">Client Requirements Received</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {projectDetails?.requirements?.filter(r => r.status === 'Received').length || 0} / {projectDetails?.requirements?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeDetailTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Project Deliverable Tasks ({projectDetails?.tasks?.length || 0})
                </h3>
                <button
                  onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-violet-600/20 cursor-pointer min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Add Task</span>
                </button>
              </div>

              {(!projectDetails?.tasks || projectDetails.tasks.length === 0) ? (
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks created for this project"
                  description="Add deliverable tasks and assign them to team members."
                  actionLabel="Add Task"
                  onAction={() => { setEditingTask(null); setShowTaskModal(true); }}
                />
              ) : (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {projectDetails.tasks.map((task) => (
                    <div key={task.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className="mt-0.5 text-emerald-600 hover:text-emerald-700 cursor-pointer shrink-0"
                        >
                          {task.status === 'Completed' ? (
                            <CheckSquare size={20} weight="fill" />
                          ) : (
                            <Square size={20} className="text-slate-400" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs sm:text-sm font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </span>
                            {task.stage_name && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                                {task.stage_name}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-1 flex-wrap">
                            {task.assigned_to && <span>Assigned: <strong className="text-slate-700">{task.assigned_to}</strong></span>}
                            {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 uppercase text-slate-700 font-bold border border-slate-200">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => { setEditingTask(task); setShowTaskModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, type: 'task', id: task.id, title: task.title })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERY STAGES */}
          {activeDetailTab === 'stages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Delivery Workflow Stages Pipeline
                  </h3>
                  <p className="text-xs text-slate-500">Track delivery milestones from kickoff to final sign-off.</p>
                </div>
              </div>

              {(!projectDetails?.stages || projectDetails.stages.length === 0) ? (
                <EmptyState
                  icon={ListChecks}
                  title="No delivery stages configured"
                  description="Stages help monitor each phase of project fulfillment."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectDetails.stages.map((stage, idx) => {
                    const isCompleted = stage.status === 'Completed';
                    return (
                      <div
                        key={stage.id}
                        onClick={() => handleToggleStageStatus(stage)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-50/70 border-emerald-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {isCompleted ? <Check size={14} weight="bold" /> : idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${isCompleted ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                              {stage.stage_name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isCompleted ? `Completed ${stage.completed_at ? new Date(stage.completed_at).toLocaleDateString() : ''}` : 'Pending completion'}
                            </div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINANCE & PROFITABILITY */}
          {activeDetailTab === 'finance' && (
            <div className="space-y-6">
              {/* Planned Costs Matrix */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                      Planned & Budgeted Costs ({projectDetails?.plannedCosts?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500">Planned costs do not count as actual cash spent until converted.</p>
                  </div>
                </div>

                {(!projectDetails?.plannedCosts || projectDetails.plannedCosts.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                    No planned costs budgeted for this project.
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                    {projectDetails.plannedCosts.map(pc => {
                      const isConverted = pc.status === 'Converted to Expense';
                      return (
                        <div key={pc.id} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70">
                          <div>
                            <div className="font-bold text-slate-900">{pc.description}</div>
                            <div className="text-[11px] text-slate-500">
                              Type: <span className="font-semibold text-slate-700">{pc.cost_type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-bold text-slate-900">
                              {currency}{parseFloat(pc.expected_amount || 0).toLocaleString('en-IN')}
                            </span>

                            {isConverted ? (
                              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Converted to Expense ✓
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedCostToConvert(pc);
                                  setConvertCostForm({
                                    actual_amount: String(pc.expected_amount),
                                    expense_date: new Date().toISOString().substring(0, 10),
                                    payment_method: 'UPI',
                                    notes: ''
                                  });
                                  setShowConvertCostModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                              >
                                Convert to Expense
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actual Project Expenses */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Actual Realized Expenses ({projectDetails?.expenses?.length || 0})
                </h3>

                {(!projectDetails?.expenses || projectDetails.expenses.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                    No expenses attributed to this project yet.
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                    {projectDetails.expenses.map(exp => (
                      <div key={exp.id} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                        <div>
                          <div className="font-bold text-slate-900">{exp.description}</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(exp.expense_date).toLocaleDateString()} • {exp.category} • {exp.payment_method}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-rose-700">
                          -{currency}{parseFloat(exp.amount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT SCHEDULE */}
          {activeDetailTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Payment Schedule & Milestones
                  </h3>
                  <p className="text-xs text-slate-500">Monitor payment milestones and record client receipts.</p>
                </div>
                <button
                  onClick={() => {
                    setPaymentForm({
                      amount: fin.outstanding ? String(fin.outstanding) : '',
                      payment_date: new Date().toISOString().substring(0, 10),
                      payment_method: 'Bank Transfer',
                      invoice_number: '',
                      notes: '',
                      milestone_id: ''
                    });
                    setShowPaymentModal(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-emerald-600/20 cursor-pointer min-h-[38px]"
                >
                  <CreditCard size={15} weight="bold" />
                  <span>Record Payment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projectDetails?.paymentSchedules?.map(m => {
                  const isPaid = m.status === 'Received';
                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border transition-all shadow-xs space-y-2.5 ${
                        isPaid ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{m.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      <div className="text-base font-bold font-mono text-slate-900">
                        {currency}{parseFloat(m.amount || 0).toLocaleString('en-IN')}
                      </div>

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        {isPaid ? (
                          <span className="text-emerald-700 font-semibold">✓ Paid on {m.paid_date ? new Date(m.paid_date).toLocaleDateString() : 'Kickoff'}</span>
                        ) : (
                          <span>Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : 'Upon Delivery'}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: CLIENT REQUIREMENTS */}
          {activeDetailTab === 'requirements' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Client Requirements & Access Tracker
                  </h3>
                  <p className="text-xs text-slate-500">Track pending assets, text copy, and credentials required from client.</p>
                </div>
                <button
                  onClick={() => setShowReqModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Add Requirement</span>
                </button>
              </div>

              {(!projectDetails?.requirements || projectDetails.requirements.length === 0) ? (
                <EmptyState
                  icon={HardDrives}
                  title="No client requirements recorded"
                  description="Add items like logos, copywriting, product photos, or DNS access."
                  actionLabel="Add Requirement"
                  onAction={() => setShowReqModal(true)}
                />
              ) : (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {projectDetails.requirements.map(req => {
                    return (
                      <div key={req.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${
                            req.status === 'Received' ? 'bg-emerald-500' : req.status === 'Not Required' ? 'bg-slate-300' : 'bg-amber-500 animate-pulse'
                          }`} />
                          <div className="min-w-0">
                            <span className={`font-bold ${req.status === 'Received' ? 'text-slate-900' : 'text-slate-800'}`}>
                              {req.item_name}
                            </span>
                            {req.received_date && (
                              <div className="text-[10px] text-emerald-700 mt-0.5">Received on {new Date(req.received_date).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {['Pending', 'Received', 'Not Required'].map(st => (
                            <button
                              key={st}
                              onClick={() => handleRequirementStatusChange(req.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                req.status === st
                                  ? st === 'Received' ? 'bg-emerald-600 text-white' : st === 'Not Required' ? 'bg-slate-300 text-slate-700' : 'bg-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TEAM */}
          {activeDetailTab === 'team' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Assigned Project Team ({projectDetails?.team?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500">Staff members responsible for delivering this project.</p>
                </div>
                <button
                  onClick={() => { loadPeople(); setShowTeamModal(true); }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-violet-600/20 cursor-pointer min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Assign Member</span>
                </button>
              </div>

              {(!projectDetails?.team || projectDetails.team.length === 0) ? (
                <EmptyState
                  icon={Users}
                  title="No team members assigned"
                  description="Assign developers, designers, or QA staff from the People module."
                  actionLabel="Assign Team Member"
                  onAction={() => { loadPeople(); setShowTeamModal(true); }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectDetails.team.map(m => (
                    <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {m.person_name?.charAt(0) || 'M'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{m.person_name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{m.role}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveTeamMember(m.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                        title="Remove member"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: QA CHECKLIST */}
          {activeDetailTab === 'qa' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Pre-Launch QA Verification Checklist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify all 11 standard quality criteria before client delivery.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {projectDetails?.qaChecklist?.map((qa) => (
                  <div
                    key={qa.id}
                    onClick={() => handleToggleQA(qa)}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        qa.is_checked ? 'bg-violet-600 text-white' : 'bg-slate-100 border border-slate-300 text-transparent'
                      }`}>
                        <CheckCircle size={16} weight="bold" />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold ${
                          qa.is_checked ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                        }`}>
                          {qa.item_label}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      qa.is_checked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {qa.is_checked ? 'Passed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: FEEDBACK */}
          {activeDetailTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Client Feedback Log
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-violet-600/20 min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Log Feedback</span>
                </button>
              </div>

              {(!projectDetails?.feedback || projectDetails.feedback.length === 0) ? (
                <EmptyState
                  icon={ChatCircleText}
                  title="No client feedback recorded"
                  description="Record feedback rounds, client revision requests, and action items."
                  actionLabel="Log Feedback"
                  onAction={() => setShowFeedbackModal(true)}
                />
              ) : (
                <div className="space-y-3">
                  {projectDetails.feedback.map((fb) => (
                    <div key={fb.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{fb.author}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(fb.feedback_date).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, type: 'feedback', id: fb.id, title: `Feedback from ${fb.author}` })}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash size={15} />
                        </button>
                      </div>

                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {fb.feedback_text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: ACTIVITY */}
          {activeDetailTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Project Audit Trail
              </h3>
              {(!projectDetails?.activity || projectDetails.activity.length === 0) ? (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  No activity logs recorded for this project.
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                  {projectDetails.activity.map(act => (
                    <div key={act.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{act.action}</div>
                        <p className="text-slate-600 mt-0.5">{act.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* PROJECTS LIST VIEW */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex-1 min-w-[220px] relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects or clients..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                <option value="ALL">All Statuses</option>
                {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                <option value="ALL">All Priorities</option>
                {PROJECT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <button
                onClick={() => { setWizardInitialData(null); setShowWizardModal(true); }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs shadow-violet-600/20 cursor-pointer min-h-[40px] active:scale-98"
              >
                <Plus size={16} weight="bold" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {projects.length === 0 && !loading ? (
            <EmptyState
              icon={Folder}
              title="No projects found"
              description="Launch the Smart Project Setup Wizard to configure a complete client delivery."
              actionLabel="Launch Project Wizard"
              onAction={() => { setWizardInitialData(null); setShowWizardModal(true); }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => loadProjectDetail(proj.id)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {proj.status}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        proj.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : proj.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {proj.priority}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-violet-700 transition-colors mb-1 truncate">
                      {proj.project_name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Client: <strong className="text-slate-800">{proj.client_name}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-sans font-medium">Contract Value</span>
                      <span className="font-bold text-slate-900">{currency}{parseFloat(proj.project_value || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>Tasks: {proj.completed_tasks || 0}/{proj.total_tasks || 0}</span>
                      <span>QA: {proj.passed_qa || 0}/{proj.total_qa || 0}</span>
                    </div>

                    {proj.deadline && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar size={13} />
                        <span>Due: {new Date(proj.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SMART PROJECT SETUP WIZARD MODAL */}
      {showWizardModal && <ProjectWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        initialData={wizardInitialData}
        currency={currency}
        onSuccess={(newProjectId) => {
          fetchProjects();
          if (newProjectId) loadProjectDetail(newProjectId);
          if (onRefreshDashboard) onRefreshDashboard();
        }}
      />}

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Record Project Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount Received ({currency}) *</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    {['Bank Transfer', 'UPI', 'Cash', 'Card', 'Other'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Invoice / Reference Number</label>
                <input
                  type="text"
                  value={paymentForm.invoice_number}
                  onChange={(e) => setPaymentForm({ ...paymentForm, invoice_number: e.target.value })}
                  placeholder="e.g. INV-2026-008"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Final milestone payment, UPI ref ID..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                ✓ Automatically updates Finance Ledger, Payment Schedule, and clears project outstanding balance.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT PLANNED COST TO EXPENSE MODAL */}
      {showConvertCostModal && selectedCostToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Convert Planned Cost to Expense
              </h3>
              <button onClick={() => setShowConvertCostModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConvertCostSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">{selectedCostToConvert.description}</div>
                <div className="text-slate-600 text-[11px]">Category: {selectedCostToConvert.cost_type}</div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Actual Amount Paid ({currency}) *</label>
                <input
                  type="number"
                  required
                  value={convertCostForm.actual_amount}
                  onChange={(e) => setConvertCostForm({ ...convertCostForm, actual_amount: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={convertCostForm.expense_date}
                    onChange={(e) => setConvertCostForm({ ...convertCostForm, expense_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={convertCostForm.payment_method}
                    onChange={(e) => setConvertCostForm({ ...convertCostForm, payment_method: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    {['UPI', 'Bank Transfer', 'Cash', 'Card'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConvertCostModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Converting...' : 'Record Actual Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD REQUIREMENT MODAL */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 font-outfit mb-3">Add Client Requirement</h3>
            <form onSubmit={handleAddRequirement} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newReqName}
                onChange={(e) => setNewReqName(e.target.value)}
                placeholder="e.g. High-res SVG Logo files"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowReqModal(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-semibold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-violet-600 text-white rounded-lg font-bold">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 font-outfit mb-3">Assign Team Member</h3>
            <CreateTeamMember onCreated={person => {
              setPeopleList(previous => [...previous, person]);
              setSelectedPersonId(String(person.id));
              setSelectedPersonRole(person.role);
            }} />
            <form onSubmit={handleAddTeamMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Person from People Module</label>
                <select
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  <option value="">-- Choose Member --</option>
                  {peopleList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role for this Project</label>
                <select
                  value={selectedPersonRole}
                  onChange={(e) => setSelectedPersonRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  <option value="Project Manager">Project Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="QA">QA</option>
                  <option value="Content">Content</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-semibold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-violet-600 text-white rounded-lg font-bold">Assign Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingTask ? 'Edit Task' : 'Add Project Task'}
              </h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Title *</label>
                <input
                  name="title"
                  defaultValue={editingTask?.title || ''}
                  required
                  placeholder="e.g. Build interactive pricing calculator"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Stage (Optional)</label>
                <select
                  name="stage_name"
                  defaultValue={editingTask?.stage_name || ''}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  <option value="">-- General Task (No stage) --</option>
                  {projectDetails?.stages?.map(s => (
                    <option key={s.id} value={s.stage_name}>{s.stage_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingTask?.description || ''}
                  placeholder="Technical details, acceptance criteria..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || 'Medium'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingTask?.status || 'Todo'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned To</label>
                  <input
                    name="assigned_to"
                    defaultValue={editingTask?.assigned_to || ''}
                    placeholder="e.g. Lead Developer"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deadline Date</label>
                  <input
                    name="deadline"
                    type="date"
                    defaultValue={editingTask?.deadline ? String(editingTask.deadline).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">Log Client Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Author / Client Contact *</label>
                  <input
                    name="author"
                    defaultValue={selectedProject?.client_name || ''}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    name="feedback_date"
                    type="date"
                    defaultValue={new Date().toISOString().substring(0, 10)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Feedback / Revision Details *</label>
                <textarea
                  name="feedback_text"
                  rows={3}
                  required
                  placeholder="Client feedback notes..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select name="status" defaultValue="Open" className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Action Plan</label>
                <input
                  name="action_plan"
                  placeholder="Steps to address feedback..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 text-xs font-bold uppercase text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase shadow-xs">Log Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT COMPLETION WARNING GUARD MODAL */}
      {completionWarning.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-amber-300 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Warning size={24} weight="bold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Outstanding Items Before Completion
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to mark this project as Completed?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold">Detected incomplete items:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
                {completionWarning.outstanding > 0 && (
                  <li>
                    <strong>Outstanding balance:</strong> {currency}{completionWarning.outstanding.toLocaleString('en-IN')} has not been recorded as paid.
                  </li>
                )}
                {completionWarning.unpassedQA > 0 && (
                  <li>
                    <strong>Incomplete QA:</strong> {completionWarning.unpassedQA} checklist item{completionWarning.unpassedQA > 1 ? 's are' : ' is'} not verified.
                  </li>
                )}
                {completionWarning.pendingReqs > 0 && (
                  <li>
                    <strong>Pending Client Requirements:</strong> {completionWarning.pendingReqs} item{completionWarning.pendingReqs > 1 ? 's are' : ' is'} still marked pending.
                  </li>
                )}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCompletionWarning({ isOpen: false, outstanding: 0, unpassedQA: 0, pendingReqs: 0, targetStatus: 'Completed' })}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Review Items First
              </button>
              <button
                type="button"
                onClick={async () => {
                  setCompletionWarning({ isOpen: false, outstanding: 0, unpassedQA: 0, pendingReqs: 0, targetStatus: 'Completed' });
                  await executeStatusUpdate('Completed');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer"
              >
                Proceed & Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

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
