"use client";
import React, { useState, useEffect } from 'react';
import {
  Folder,
  Plus,
  MagnifyingGlass,
  Funnel,
  Pencil,
  Trash,
  CheckCircle,
  Clock,
  Calendar,
  CurrencyInr,
  X,
  ListChecks,
  ChatCircleText,
  User,
  CaretRight,
  ArrowLeft,
  CheckSquare,
  Square,
  Tag
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

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

const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Completed'];

export default function DeliveryModule({ initialProjectId, settings = {}, onRefreshDashboard }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview' | 'tasks' | 'feedback' | 'qa'
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCustomQAModal, setShowCustomQAModal] = useState(false);

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

  // Handle Save Project
  async function handleSaveProject(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      project_name: form.project_name.value,
      client_name: form.client_name.value,
      project_value: form.project_value.value,
      start_date: form.start_date.value || null,
      deadline: form.deadline.value || null,
      status: form.status.value,
      priority: form.priority.value,
      assigned_person: form.assigned_person.value,
      notes: form.notes.value
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/founder-os/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingProject ? 'Project updated' : 'Project created with 11-point QA checklist', 'success');
        setShowProjectModal(false);
        setEditingProject(null);
        fetchProjects();
        if (selectedProject?.id === (editingProject?.id || data.project?.id)) {
          loadProjectDetail(editingProject?.id || data.project?.id);
        }
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save project', 'error');
      }
    } catch (err) {
      showToast('Error saving project', 'error');
    } finally {
      setActionLoading(false);
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

  // Handle Add Custom QA Item
  async function handleAddCustomQA(e) {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    const form = e.target;
    const payload = {
      item_label: form.item_label.value,
      notes: form.notes.value
    };

    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Custom QA item added', 'success');
        setShowCustomQAModal(false);
        loadProjectDetail(selectedProject.id);
        fetchProjects();
      } else {
        showToast(data.error || 'Failed to add QA item', 'error');
      }
    } catch (err) {
      showToast('Error adding QA item', 'error');
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

  return (
    <div className="space-y-6 pb-12">
      {/* If a project is selected, render Project Detail View */}
      {selectedProject ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Top Bar with Back Button */}
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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedProject.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-violet-50 text-violet-700 border border-violet-200'
                  }`}>
                    {selectedProject.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Client: <strong className="text-slate-800">{selectedProject.client_name}</strong>
                  {selectedProject.assigned_person && ` • Assigned: ${selectedProject.assigned_person}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditingProject(selectedProject); setShowProjectModal(true); }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer min-h-[38px]"
              >
                Edit Project
              </button>
              <button
                onClick={() => setDeleteConfirm({ isOpen: true, type: 'project', id: selectedProject.id, title: selectedProject.project_name })}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Delete Project"
              >
                <Trash size={17} />
              </button>
            </div>
          </div>

          {/* Project Detail Subtabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs overflow-x-auto no-scrollbar w-full sm:w-fit">
            <button
              onClick={() => setActiveDetailTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap min-h-[36px] ${
                activeDetailTab === 'overview' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveDetailTab('tasks')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
                activeDetailTab === 'tasks' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Tasks</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeDetailTab === 'tasks' ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {projectDetails?.tasks?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveDetailTab('qa')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
                activeDetailTab === 'qa' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListChecks size={15} weight="bold" />
              <span>QA Checklist</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeDetailTab === 'qa' ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {projectDetails?.qaChecklist?.filter(q => q.is_checked).length || 0}/{projectDetails?.qaChecklist?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveDetailTab('feedback')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
                activeDetailTab === 'feedback' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ChatCircleText size={15} weight="bold" />
              <span>Feedback</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeDetailTab === 'feedback' ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {projectDetails?.feedback?.length || 0}
              </span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Project Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1 font-medium">Project Value</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{currency}{parseFloat(selectedProject.project_value || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1 font-medium">Priority</span>
                      <span className="text-sm font-bold text-slate-900">{selectedProject.priority}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1 font-medium">Start Date</span>
                      <span className="text-sm font-bold text-slate-900">{selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-1 font-medium">Deadline</span>
                      <span className="text-sm font-bold text-slate-900">{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>

                  {selectedProject.notes && (
                    <div className="pt-2">
                      <span className="text-slate-700 block text-xs font-bold mb-1.5">Project Notes & Architecture</span>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                        {selectedProject.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Quick Stats */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                    Readiness & Quality
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                      <span className="font-semibold">Tasks Completed</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {projectDetails?.tasks?.filter(t => t.status === 'Completed').length || 0} / {projectDetails?.tasks?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                      <span className="font-semibold">QA Items Verified</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {projectDetails?.qaChecklist?.filter(q => q.is_checked).length || 0} / {projectDetails?.qaChecklist?.length || 0}
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
                  Project Tasks ({projectDetails?.tasks?.length || 0})
                </h3>
                <button
                  onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Add Task</span>
                </button>
              </div>

              {(!projectDetails?.tasks || projectDetails.tasks.length === 0) ? (
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks created for this project"
                  description="Break the project into deliverables and assign them to team members."
                  actionLabel="Add First Task"
                  onAction={() => { setEditingTask(null); setShowTaskModal(true); }}
                />
              ) : (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {projectDetails.tasks.map((task) => (
                    <div key={task.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className="mt-0.5 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          {task.status === 'Completed' ? (
                            <CheckSquare size={20} weight="fill" />
                          ) : (
                            <Square size={20} className="text-slate-400" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <span className={`text-xs sm:text-sm font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
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

          {/* TAB 3: QA CHECKLIST */}
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
                <button
                  onClick={() => setShowCustomQAModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs min-h-[38px]"
                >
                  <Plus size={14} weight="bold" />
                  <span>Add Custom QA Item</span>
                </button>
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
                        {qa.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{qa.notes}</div>
                        )}
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

          {/* TAB 4: CLIENT FEEDBACK */}
          {activeDetailTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Client Feedback Log
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 min-h-[38px]"
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
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                            {fb.status}
                          </span>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'feedback', id: fb.id, title: `Feedback from ${fb.author}` })}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {fb.feedback_text}
                      </p>

                      {fb.action_plan && (
                        <div className="text-[11px] text-slate-600 pt-1">
                          <strong className="text-slate-800">Action Plan: </strong> {fb.action_plan}
                        </div>
                      )}
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
                onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer min-h-[40px] active:scale-98"
              >
                <Plus size={16} weight="bold" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {projects.length === 0 && !loading ? (
            <EmptyState
              icon={Folder}
              title="No projects found"
              description="Create your first website or web application client project."
              actionLabel="Create Project"
              onAction={() => { setEditingProject(null); setShowProjectModal(true); }}
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

                    <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-violet-700 transition-colors mb-1">
                      {proj.project_name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Client: <strong className="text-slate-800">{proj.client_name}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-sans font-medium">Value</span>
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

      {/* --- MODAL 1: ADD / EDIT PROJECT --- */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
                  <input
                    name="project_name"
                    defaultValue={editingProject?.project_name || ''}
                    required
                    placeholder="e.g. Apex Hospital 3D Portal"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client Name *</label>
                  <input
                    name="client_name"
                    defaultValue={editingProject?.client_name || ''}
                    required
                    placeholder="e.g. Dr. Rajesh Patel"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Value ({currency})</label>
                  <input
                    name="project_value"
                    type="number"
                    defaultValue={editingProject?.project_value || 0}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingProject?.status || 'Planning'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingProject?.priority || 'Medium'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {PROJECT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date</label>
                  <input
                    name="start_date"
                    type="date"
                    defaultValue={editingProject?.start_date ? String(editingProject.start_date).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deadline Date</label>
                  <input
                    name="deadline"
                    type="date"
                    defaultValue={editingProject?.deadline ? String(editingProject.deadline).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Lead / Person</label>
                <input
                  name="assigned_person"
                  defaultValue={editingProject?.assigned_person || ''}
                  placeholder="e.g. Lead Developer / Madhav"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Notes / Tech Stack</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingProject?.notes || ''}
                  placeholder="Tech stack, repo links, Figma design URLs..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 min-h-[42px] text-center"
                >
                  {actionLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT TASK --- */}
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
                  placeholder="e.g. Build 3D Hero canvas"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingTask?.description || ''}
                  placeholder="Task scope details..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingTask?.status || 'Todo'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || 'Medium'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    {PROJECT_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Person</label>
                  <input
                    name="assigned_to"
                    defaultValue={editingTask?.assigned_to || ''}
                    placeholder="Team member"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    defaultValue={editingTask?.deadline ? String(editingTask.deadline).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 min-h-[42px] text-center"
                >
                  {actionLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: LOG CLIENT FEEDBACK --- */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Log Client Feedback
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Author / Feedback Giver *</label>
                <input
                  name="author"
                  defaultValue={selectedProject?.client_name || ''}
                  required
                  placeholder="e.g. Client Lead"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Feedback Date</label>
                <input
                  name="feedback_date"
                  type="date"
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Feedback Comments *</label>
                <textarea
                  name="feedback_text"
                  required
                  rows={3}
                  placeholder="Client feedback, revisions requested..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue="Open"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="Addressed">Addressed</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Action Plan</label>
                  <input
                    name="action_plan"
                    placeholder="e.g. Redesign mobile navbar"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 min-h-[42px] text-center"
                >
                  {actionLoading ? 'Logging...' : 'Save Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD CUSTOM QA ITEM --- */}
      {showCustomQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Add Custom QA Checklist Item
              </h3>
              <button onClick={() => setShowCustomQAModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomQA} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Verification Label *</label>
                <input
                  name="item_label"
                  required
                  placeholder="e.g. Razorpay webhook verified in production"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Instructions</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Verification steps..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomQAModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 min-h-[42px] text-center"
                >
                  {actionLoading ? 'Adding...' : 'Add Checklist Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        isDestructive={true}
        title={`Delete ${deleteConfirm.type}`}
        message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
        confirmLabel="Delete"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
      />
    </div>
  );
}
