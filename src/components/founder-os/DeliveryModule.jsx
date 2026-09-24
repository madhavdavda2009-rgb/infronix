"use client";
import CreateTeamMember from './CreateTeamMember';
import React, { useState, useEffect } from 'react';
import { Folder, Plus, MagnifyingGlass, Pencil, Trash, CheckCircle, Calendar, X, ListChecks, ChatCircleText, ArrowLeft, CheckSquare, Square, CreditCard, HardDrives, Users, Warning, Check, ShieldCheck, Globe, Eye, ArrowSquareOut, FileText, UploadSimple, Clock, CurrencyInr, ChatDots, Tag, ArrowsClockwise, FilePlus, Sparkle, Link } from '@phosphor-icons/react';
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

  // Client Portal State
  const [portalSettings, setPortalSettings] = useState({
    is_portal_enabled: true,
    portal_enabled: true,
    portal_display_name: '',
    client_summary: '',
    allow_live_preview: false,
    preview_enabled: false,
    staging_preview_url: '',
    preview_url: '',
    preview_label: 'Live Staging Preview',
    preview_status: 'Preparing',
    preview_instructions: '',
    allow_change_requests: true,
    change_requests_enabled: true,
    change_request_policy: 'Change requests will be reviewed and scheduled by the delivery team.'
  });
  const [portalSubtab, setPortalSubtab] = useState('settings'); // 'settings' | 'stages' | 'tasks' | 'change_requests' | 'requirements' | 'documents' | 'approvals'
  const [selectedChangeRequest, setSelectedChangeRequest] = useState(null);
  const [crReviewForm, setCrReviewForm] = useState({
    status: '',
    admin_priority: '',
    scope_decision: 'Included in Scope',
    impact_cost: '0',
    timeline_impact: 'No schedule impact',
    estimated_completion_date: '',
    admin_notes: '',
    status_comment: ''
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [reviewReqItem, setReviewReqItem] = useState(null);
  const [reqReviewNotes, setReqReviewNotes] = useState('');
  const [showPublishDocModal, setShowPublishDocModal] = useState(false);
  const [publishDocForm, setPublishDocForm] = useState({
    title: '',
    category: 'Deliverable',
    file_url: '',
    description: '',
    version: '1.0',
    is_client_downloadable: true
  });

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
        if (data.portalSettings) {
          const ps = data.portalSettings;
          setPortalSettings({
            is_portal_enabled: ps.is_portal_enabled ?? ps.portal_enabled ?? true,
            portal_enabled: ps.portal_enabled ?? ps.is_portal_enabled ?? true,
            portal_display_name: ps.portal_display_name || data.project?.project_name || '',
            client_summary: ps.client_summary || '',
            allow_live_preview: ps.allow_live_preview ?? ps.preview_enabled ?? false,
            preview_enabled: ps.preview_enabled ?? ps.allow_live_preview ?? false,
            staging_preview_url: ps.staging_preview_url ?? ps.preview_url ?? '',
            preview_url: ps.preview_url ?? ps.staging_preview_url ?? '',
            preview_label: ps.preview_label || 'Live Staging Preview',
            preview_status: ps.preview_status || 'Preparing',
            preview_instructions: ps.preview_instructions || '',
            allow_change_requests: ps.allow_change_requests ?? ps.change_requests_enabled ?? true,
            change_requests_enabled: ps.change_requests_enabled ?? ps.allow_change_requests ?? true,
            change_request_policy: ps.change_request_policy || 'Change requests will be reviewed and scheduled by the delivery team.'
          });
        }
      }
    } catch (err) {
      showToast('Error loading project details', 'error');
    }
  }

  // Client Portal Handlers
  async function handleSavePortalSettings(e) {
    if (e) e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      const payload = {
        ...portalSettings,
        portal_enabled: portalSettings.is_portal_enabled ?? portalSettings.portal_enabled ?? true,
        is_portal_enabled: portalSettings.is_portal_enabled ?? portalSettings.portal_enabled ?? true,
        preview_enabled: portalSettings.allow_live_preview ?? portalSettings.preview_enabled ?? false,
        allow_live_preview: portalSettings.allow_live_preview ?? portalSettings.preview_enabled ?? false,
        preview_url: (portalSettings.staging_preview_url || portalSettings.preview_url || '').trim(),
        staging_preview_url: (portalSettings.staging_preview_url || portalSettings.preview_url || '').trim(),
        change_requests_enabled: portalSettings.allow_change_requests ?? portalSettings.change_requests_enabled ?? true,
        allow_change_requests: portalSettings.allow_change_requests ?? portalSettings.change_requests_enabled ?? true,
      };

      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/portal-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Client Portal settings saved successfully', 'success');
        if (data.settings) {
          setPortalSettings(data.settings);
        }
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to save portal settings', 'error');
      }
    } catch (err) {
      showToast('Error saving portal settings', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleStageVisibility(stageId, isVisible, clientTitle, clientDesc, clientNote, weight) {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/stages/${stageId}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_visible_to_client: isVisible,
          client_title: clientTitle,
          client_description: clientDesc,
          client_note: clientNote,
          stage_weight: weight
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Stage portal settings updated', 'success');
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to update stage visibility', 'error');
      }
    } catch (err) {
      showToast('Error updating stage', 'error');
    }
  }

  async function handleToggleTaskVisibility(taskId, isVisible, clientDesc) {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/tasks/${taskId}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_visible_to_client: isVisible,
          client_description: clientDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Task portal visibility updated', 'success');
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to update task visibility', 'error');
      }
    } catch (err) {
      showToast('Error updating task', 'error');
    }
  }

  async function handleReviewRequirement(reqId, status, reviewNotes) {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/requirements/${reqId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, review_notes: reviewNotes })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Requirement marked as ${status}`, 'success');
        setReviewReqItem(null);
        setReqReviewNotes('');
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to review requirement', 'error');
      }
    } catch (err) {
      showToast('Error reviewing requirement', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveChangeRequest(changeRequestId, updates) {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/change-requests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change_request_id: changeRequestId, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Change request updated', 'success');
        loadProjectDetail(selectedProject.id);
        if (selectedChangeRequest?.id === changeRequestId) {
          setSelectedChangeRequest(data.changeRequest);
        }
      } else {
        showToast(data.error || 'Failed to update change request', 'error');
      }
    } catch (err) {
      showToast('Error updating change request', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAddChangeRequestComment(changeRequestId) {
    if (!newCommentText.trim() || !selectedProject) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/change-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          change_request_id: changeRequestId,
          message: newCommentText.trim(),
          is_internal_note: isInternalComment
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(isInternalComment ? 'Internal note added' : 'Response message sent to client', 'success');
        setNewCommentText('');
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to post comment', 'error');
      }
    } catch (err) {
      showToast('Error posting message', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePublishDocument(e) {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/projects/${selectedProject.id}/portal-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishDocForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Document published to Client Portal', 'success');
        setShowPublishDocModal(false);
        setPublishDocForm({
          title: '',
          category: 'Deliverable',
          file_url: '',
          description: '',
          version: '1.0',
          is_client_downloadable: true
        });
        loadProjectDetail(selectedProject.id);
      } else {
        showToast(data.error || 'Failed to publish document', 'error');
      }
    } catch (err) {
      showToast('Error publishing document', 'error');
    } finally {
      setActionLoading(false);
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
              { 
                id: 'portal', 
                label: 'Client Portal', 
                badge: projectDetails?.changeRequests?.filter(cr => cr.status === 'Submitted' || cr.status === 'Under Review').length || (projectDetails?.portalSettings?.is_portal_enabled ? 'Active' : undefined) 
              },
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

          {/* TAB 11: CLIENT PORTAL COMMAND & VISIBILITY */}
          {activeDetailTab === 'portal' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Portal Header & Quick Launch Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={18} className="text-violet-600" weight="bold" />
                    <span>Client Portal Project Controls</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Control client-visible stages, live staging preview, change requests, requirements, deliverables, and approvals.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`/client/projects/${selectedProject.id}?admin_preview_client_id=${selectedProject.client_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer min-h-[38px]"
                    title="View this project exactly as the client sees it (Read-Only Preview)"
                  >
                    <Eye size={15} weight="bold" />
                    <span>View as Client</span>
                    <ArrowSquareOut size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowPublishDocModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs shadow-violet-600/20 cursor-pointer min-h-[38px]"
                  >
                    <FilePlus size={15} weight="bold" />
                    <span>Publish Document</span>
                  </button>
                </div>
              </div>

              {/* Portal Sub-navigation Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200 overflow-x-auto no-scrollbar w-full">
                {[
                  { id: 'settings', label: 'Settings & Staging Preview' },
                  { id: 'change_requests', label: 'Change Requests', badge: projectDetails?.changeRequests?.length },
                  { id: 'visibility', label: 'Stages & Tasks Visibility' },
                  { id: 'requirements', label: 'Client Uploads & Requirements', badge: projectDetails?.requirements?.filter(r => r.file_url).length },
                  { id: 'documents', label: 'Published Deliverables', badge: projectDetails?.portalDocuments?.length },
                  { id: 'approvals', label: 'Approvals Audit Trail', badge: projectDetails?.approvals?.length }
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setPortalSubtab(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      portalSubtab === sub.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {sub.badge !== undefined && sub.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                        {sub.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1: SETTINGS & STAGING PREVIEW */}
              {portalSubtab === 'settings' && (
                <form onSubmit={handleSavePortalSettings} className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* General Portal Settings */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit border-b border-slate-100 pb-2">
                        General Portal Visibility
                      </h4>

                      <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">Enable Project in Client Portal</span>
                          <span className="text-[11px] text-slate-500">Allow authorized client contacts to access this project workspace</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(portalSettings.is_portal_enabled)}
                          onChange={(e) => setPortalSettings({ ...portalSettings, is_portal_enabled: e.target.checked, portal_enabled: e.target.checked })}
                          className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                        />
                      </label>

                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Portal Display Name</label>
                        <input
                          type="text"
                          value={portalSettings.portal_display_name || ''}
                          onChange={(e) => setPortalSettings({ ...portalSettings, portal_display_name: e.target.value })}
                          placeholder={selectedProject.project_name}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Client-Facing Project Brief / Summary</label>
                        <textarea
                          rows={3}
                          value={portalSettings.client_summary || ''}
                          onChange={(e) => setPortalSettings({ ...portalSettings, client_summary: e.target.value })}
                          placeholder="High-level project objectives and deliverables visible to the client..."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                        />
                      </div>

                      <div>
                        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer mb-2">
                          <span className="font-bold text-slate-900 text-xs">Allow Client Change Requests</span>
                          <input
                            type="checkbox"
                            checked={Boolean(portalSettings.allow_change_requests)}
                            onChange={(e) => setPortalSettings({ ...portalSettings, allow_change_requests: e.target.checked, change_requests_enabled: e.target.checked })}
                            className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                          />
                        </label>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Change Request Policy</label>
                        <textarea
                          rows={2}
                          value={portalSettings.change_request_policy || ''}
                          onChange={(e) => setPortalSettings({ ...portalSettings, change_request_policy: e.target.value })}
                          placeholder="e.g. Requests outside original scope will receive an impact quotation."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                        />
                      </div>
                    </div>

                    {/* Staging Live Preview Settings */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit flex items-center gap-1.5">
                          <Globe size={16} className="text-violet-600" />
                          <span>Live Staging Preview Controls</span>
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          portalSettings.preview_status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {portalSettings.preview_status || 'Not Available'}
                        </span>
                      </div>

                      <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">Enable Live Preview Tab in Client Portal</span>
                          <span className="text-[11px] text-slate-500">Allows client to interact with responsive iframe staging deployment</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(portalSettings.allow_live_preview)}
                          onChange={(e) => setPortalSettings({ ...portalSettings, allow_live_preview: e.target.checked, preview_enabled: e.target.checked })}
                          className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                        />
                      </label>

                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Staging / Live Preview URL *</label>
                        <input
                          type="url"
                          value={portalSettings.staging_preview_url || ''}
                          onChange={(e) => setPortalSettings({ ...portalSettings, staging_preview_url: e.target.value })}
                          placeholder="https://staging.infronixweb.com or https://client-staging.vercel.app"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Security rule: Must be a valid HTTPS URL on an approved staging domain. Unsafe protocols (`javascript:`, `data:`) are strictly blocked.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Preview Label</label>
                          <input
                            type="text"
                            value={portalSettings.preview_label || ''}
                            onChange={(e) => setPortalSettings({ ...portalSettings, preview_label: e.target.value })}
                            placeholder="e.g. v1.2 Staging Build"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Preview Status</label>
                          <select
                            value={portalSettings.preview_status || 'Not Available'}
                            onChange={(e) => setPortalSettings({ ...portalSettings, preview_status: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 cursor-pointer"
                          >
                            <option value="Not Available">Not Available</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Available">Available</option>
                            <option value="Temporarily Unavailable">Temporarily Unavailable</option>
                            <option value="Approved">Approved</option>
                            <option value="Replaced by Live Website">Replaced by Live Website</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold text-xs mb-1">Client Preview Instructions</label>
                        <textarea
                          rows={2}
                          value={portalSettings.preview_instructions || ''}
                          onChange={(e) => setPortalSettings({ ...portalSettings, preview_instructions: e.target.value })}
                          placeholder="e.g. Test on desktop and mobile viewports. Submit any UI changes via the Change Request button."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 min-h-[40px]"
                    >
                      {actionLoading ? 'Saving Settings...' : 'Save Portal Settings'}
                    </button>
                  </div>
                </form>
              )}

              {/* SUBTAB 2: CHANGE REQUESTS */}
              {portalSubtab === 'change_requests' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                      Client Change Requests ({projectDetails?.changeRequests?.length || 0})
                    </h4>
                    <span className="text-xs text-slate-500">
                      Requests submitted by clients directly from the portal or live preview
                    </span>
                  </div>

                  {(!projectDetails?.changeRequests || projectDetails.changeRequests.length === 0) ? (
                    <EmptyState
                      icon={ChatDots}
                      title="No change requests submitted yet"
                      description="When the client submits scope revisions, feature updates, or design changes, they will appear here with quoting and scope controls."
                    />
                  ) : (
                    <div className="divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                      {projectDetails.changeRequests.map((cr) => (
                        <div key={cr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 transition-colors">
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm text-slate-900 font-outfit">{cr.title}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                                {cr.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                cr.status === 'Approved' || cr.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : cr.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : cr.status === 'Quoted' || cr.status === 'Awaiting Client Approval'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {cr.status}
                              </span>
                              {cr.scope_decision && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                  {cr.scope_decision}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 line-clamp-2 leading-relaxed">{cr.description}</p>
                            <div className="text-[11px] text-slate-400 flex items-center gap-3 flex-wrap">
                              <span>By: <strong>{cr.author_name || 'Client'}</strong> ({cr.public_client_id || 'Client'})</span>
                              <span>•</span>
                              <span>Requested: {new Date(cr.created_at).toLocaleDateString()}</span>
                              {parseFloat(cr.impact_cost || 0) > 0 && (
                                <span className="font-bold text-emerald-700 font-mono">
                                  • Quote: {currency}{parseFloat(cr.impact_cost).toLocaleString('en-IN')}
                                </span>
                              )}
                              {cr.timeline_impact && (
                                <span className="text-slate-600">• Impact: {cr.timeline_impact}</span>
                              )}
                              <span>• {cr.total_comments || 0} messages</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedChangeRequest(cr);
                                setCrReviewForm({
                                  status: cr.status || 'Submitted',
                                  admin_priority: cr.admin_priority || cr.priority_preference || 'Medium',
                                  scope_decision: cr.scope_decision || 'Included in Scope',
                                  impact_cost: String(cr.impact_cost || 0),
                                  timeline_impact: cr.timeline_impact || 'No schedule impact',
                                  estimated_completion_date: cr.estimated_completion_date ? cr.estimated_completion_date.substring(0, 10) : '',
                                  admin_notes: cr.admin_notes || '',
                                  status_comment: ''
                                });
                              }}
                              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer min-h-[36px]"
                            >
                              Review & Quote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: STAGES & TASKS VISIBILITY */}
              {portalSubtab === 'visibility' && (
                <div className="space-y-6">
                  {/* Stages Visibility */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit">
                        Delivery Stages Client Visibility & Labels ({projectDetails?.stages?.length || 0})
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Client will only see stages marked visible. Client progress is computed strictly from visible stages.
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {(projectDetails?.stages || []).map((stg) => (
                        <div key={stg.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 flex-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {stg.stage_order}
                              </span>
                              <strong className="text-slate-900">{stg.stage_name}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                Internal Status: {stg.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 pl-7">
                              Client Display Title: <strong>{stg.client_title || stg.stage_name}</strong>
                              {stg.client_description && <span className="block text-slate-400 mt-0.5">{stg.client_description}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                              <input
                                type="checkbox"
                                checked={Boolean(stg.is_visible_to_client)}
                                onChange={(e) => handleToggleStageVisibility(
                                  stg.id,
                                  e.target.checked,
                                  stg.client_title || stg.stage_name,
                                  stg.client_description,
                                  stg.client_note,
                                  stg.stage_weight
                                )}
                                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                              />
                              <span className="font-bold text-[11px] text-slate-700">Visible to Client</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks Visibility */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit">
                        Tasks Client Visibility ({projectDetails?.tasks?.length || 0})
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Tasks remain private by default. Check items you want clients to track in their portal.
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {(projectDetails?.tasks || []).map((t) => (
                        <div key={t.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{t.task_name}</span>
                            <span className="text-[11px] text-slate-400 block">
                              Status: {t.status} {t.deadline && `• Due: ${new Date(t.deadline).toLocaleDateString()}`}
                            </span>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <input
                              type="checkbox"
                              checked={Boolean(t.is_visible_to_client)}
                              onChange={(e) => handleToggleTaskVisibility(t.id, e.target.checked, t.client_description)}
                              className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                            />
                            <span className="font-bold text-[11px] text-slate-700">Client Visible</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: CLIENT REQUIREMENTS REVIEW */}
              {portalSubtab === 'requirements' && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit">
                      Client Requirement Assets & Uploaded Files
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Verify client-submitted brand assets, content files, and documents
                    </span>
                  </div>

                  {(!projectDetails?.requirements || projectDetails.requirements.length === 0) ? (
                    <EmptyState
                      icon={UploadSimple}
                      title="No requirements configured"
                      description="Add requirements from the Client Requirements tab."
                    />
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {projectDetails.requirements.map((req) => (
                        <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-900 text-sm font-outfit">{req.requirement_name}</strong>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                req.status === 'Approved' || req.status === 'Received'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : req.status === 'Submitted'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : req.status === 'Needs Revision'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            {req.file_url ? (
                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
                                  <FileText size={14} className="text-violet-600" />
                                  <span className="truncate">{req.file_name || 'Uploaded File'}</span>
                                  {req.file_size && <span className="text-slate-400">({(req.file_size / 1024).toFixed(0)} KB)</span>}
                                  <a
                                    href={req.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-700 font-bold hover:underline ml-2"
                                  >
                                    Download / View File
                                  </a>
                                </div>
                                {req.client_notes && (
                                  <p className="text-[11px] text-slate-600 italic pl-5">“{req.client_notes}”</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 block">No file uploaded yet by client.</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {req.file_url && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleReviewRequirement(req.id, 'Approved', 'Asset approved by delivery lead.')}
                                  disabled={actionLoading}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                                >
                                  Approve Asset
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewReqItem(req);
                                    setReqReviewNotes('Please upload higher resolution format / update missing information.');
                                  }}
                                  disabled={actionLoading}
                                  className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs cursor-pointer"
                                >
                                  Request Revision
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 5: PUBLISHED DELIVERABLES */}
              {portalSubtab === 'documents' && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit">
                      Published Client Portal Documents & Deliverables ({projectDetails?.portalDocuments?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowPublishDocModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Publish New Document</span>
                    </button>
                  </div>

                  {(!projectDetails?.portalDocuments || projectDetails.portalDocuments.length === 0) ? (
                    <EmptyState
                      icon={FileText}
                      title="No portal documents published"
                      description="Publish proposals, contracts, handover documents, and user guides to the client workspace."
                      actionLabel="Publish First Document"
                      onAction={() => setShowPublishDocModal(true)}
                    />
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {projectDetails.portalDocuments.map((doc) => (
                        <div key={doc.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-900">{doc.title}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                                {doc.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">v{doc.version || '1.0'}</span>
                            </div>
                            {doc.description && <p className="text-[11px] text-slate-500 mt-0.5">{doc.description}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 6: APPROVALS AUDIT TRAIL */}
              {portalSubtab === 'approvals' && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit">
                      Deliverable & Stage Client Approvals ({projectDetails?.approvals?.length || 0})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Cryptographically recorded client approvals with timestamp, version identifier, and client user identity.
                    </span>
                  </div>

                  {(!projectDetails?.approvals || projectDetails.approvals.length === 0) ? (
                    <EmptyState
                      icon={CheckCircle}
                      title="No client approvals recorded yet"
                      description="When the client approves design iterations, staging previews, or final project delivery, legally auditable records are listed here."
                    />
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {projectDetails.approvals.map((appr) => (
                        <div key={appr.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {appr.approval_type}
                              </span>
                              <strong className="text-slate-900 text-sm font-outfit">{appr.deliverable_title}</strong>
                              <span className="text-[10px] font-mono text-slate-400">v{appr.version || '1.0'}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Approved by: <strong>{appr.client_user_name || 'Authorized Contact'}</strong> ({appr.public_client_id}) • {new Date(appr.created_at).toLocaleString()}
                            </div>
                            {appr.client_comment && (
                              <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                “{appr.client_comment}”
                              </p>
                            )}
                          </div>

                          <div className="text-right font-mono text-[10px] text-slate-400 shrink-0">
                            IP Hash: {appr.ip_hash ? appr.ip_hash.substring(0, 16) + '...' : 'Verified Session'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* MODAL: CHANGE REQUEST REVIEW & IMPACT QUOTE */}
      {selectedChangeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
                  <ChatDots size={18} weight="bold" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">
                    Review Change Request #{selectedChangeRequest.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    From {selectedChangeRequest.author_name || 'Client'} ({selectedChangeRequest.public_client_id})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChangeRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Request Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <strong className="text-sm text-slate-900 font-outfit">{selectedChangeRequest.title}</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-100 text-violet-800">
                  {selectedChangeRequest.category}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedChangeRequest.description}
              </p>
              <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap pt-1">
                <span>Client Priority: <strong>{selectedChangeRequest.priority_preference || 'Medium'}</strong></span>
                {selectedChangeRequest.page_path && <span>• Route: <code className="bg-slate-200/60 px-1 py-0.5 rounded">{selectedChangeRequest.page_path}</code></span>}
                {selectedChangeRequest.attachment_url && (
                  <a href={selectedChangeRequest.attachment_url} target="_blank" rel="noopener noreferrer" className="text-violet-700 font-bold hover:underline">
                    • View Attachment
                  </a>
                )}
              </div>
            </div>

            {/* Scope, Status & Impact Assessment Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleSaveChangeRequest(selectedChangeRequest.id, crReviewForm);
              setSelectedChangeRequest(null);
            }} className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1 font-outfit">
                Scope & Impact Assessment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Change Request Status *</label>
                  <select
                    value={crReviewForm.status}
                    onChange={(e) => setCrReviewForm({ ...crReviewForm, status: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="More Information Required">More Information Required</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Quoted">Quoted (Requires Client Approval)</option>
                    <option value="Awaiting Client Approval">Awaiting Client Approval</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready for Review">Ready for Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Scope Classification *</label>
                  <select
                    value={crReviewForm.scope_decision}
                    onChange={(e) => setCrReviewForm({ ...crReviewForm, scope_decision: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    <option value="Included in Scope">Included in Current Scope (₹0)</option>
                    <option value="Additional Quote">Additional Quote Required</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Additional Cost ({currency})</label>
                  <input
                    type="number"
                    value={crReviewForm.impact_cost}
                    onChange={(e) => setCrReviewForm({ ...crReviewForm, impact_cost: e.target.value })}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Timeline Impact</label>
                  <input
                    type="text"
                    value={crReviewForm.timeline_impact}
                    onChange={(e) => setCrReviewForm({ ...crReviewForm, timeline_impact: e.target.value })}
                    placeholder="e.g. +2 business days"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={crReviewForm.estimated_completion_date}
                    onChange={(e) => setCrReviewForm({ ...crReviewForm, estimated_completion_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Internal Admin Notes (Never exposed to client)</label>
                <textarea
                  rows={2}
                  value={crReviewForm.admin_notes}
                  onChange={(e) => setCrReviewForm({ ...crReviewForm, admin_notes: e.target.value })}
                  placeholder="Private development estimates, scope notes, or technical considerations..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedChangeRequest(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  {actionLoading ? 'Updating...' : 'Save Scope & Status'}
                </button>
              </div>
            </form>

            {/* Conversation Thread & Response Composer */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-outfit">
                Client Message & Discussion
              </h4>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type a message or explanation to the client..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="w-3.5 h-3.5 text-violet-600 rounded"
                    />
                    <span>Post as Private Internal Note (Client will not see this)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleAddChangeRequestComment(selectedChangeRequest.id)}
                    disabled={!newCommentText.trim() || actionLoading}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUIREMENT REVISION REQUEST */}
      {reviewReqItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Request Asset Revision
              </h3>
              <button onClick={() => setReviewReqItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Requirement: <strong className="text-slate-900">{reviewReqItem.requirement_name}</strong>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Feedback / Revision Reason *</label>
              <textarea
                rows={3}
                value={reqReviewNotes}
                onChange={(e) => setReqReviewNotes(e.target.value)}
                placeholder="Explain what needs to be changed or re-uploaded..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewReqItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReviewRequirement(reviewReqItem.id, 'Needs Revision', reqReviewNotes)}
                disabled={actionLoading || !reqReviewNotes.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                {actionLoading ? 'Saving...' : 'Send Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH PORTAL DOCUMENT */}
      {showPublishDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FilePlus size={18} className="text-violet-600" weight="bold" />
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Publish Document to Portal
                </h3>
              </div>
              <button onClick={() => setShowPublishDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePublishDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={publishDocForm.title}
                  onChange={(e) => setPublishDocForm({ ...publishDocForm, title: e.target.value })}
                  placeholder="e.g. Website Handover & Admin Guide"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={publishDocForm.category}
                    onChange={(e) => setPublishDocForm({ ...publishDocForm, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    <option value="Deliverable">Deliverable</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Agreement">Agreement / Contract</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Receipt">Receipt</option>
                    <option value="Project Brief">Project Brief</option>
                    <option value="User Guide">User Guide</option>
                    <option value="Handover">Handover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Version</label>
                  <input
                    type="text"
                    value={publishDocForm.version}
                    onChange={(e) => setPublishDocForm({ ...publishDocForm, version: e.target.value })}
                    placeholder="1.0"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Document File URL *</label>
                <input
                  type="url"
                  required
                  value={publishDocForm.file_url}
                  onChange={(e) => setPublishDocForm({ ...publishDocForm, file_url: e.target.value })}
                  placeholder="https://... or cloud storage link"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={publishDocForm.description}
                  onChange={(e) => setPublishDocForm({ ...publishDocForm, description: e.target.value })}
                  placeholder="Short note on what this document contains..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={publishDocForm.is_client_downloadable}
                  onChange={(e) => setPublishDocForm({ ...publishDocForm, is_client_downloadable: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-slate-700 font-bold">Allow Client Download</span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPublishDocModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  {actionLoading ? 'Publishing...' : 'Publish Document'}
                </button>
              </div>
            </form>
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
