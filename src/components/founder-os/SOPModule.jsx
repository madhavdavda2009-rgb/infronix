"use client";
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  X,
  ArrowLeft,
  CheckCircle,
  User,
  Clock,
  CaretRight,
  ListNumbers
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

const SOP_CATEGORIES = [
  'Sales',
  'Client Onboarding',
  'Design',
  'Development',
  'QA',
  'Deployment',
  'Finance',
  'Security',
  'Offboarding'
];

export default function SOPModule({ initialSopId, settings = {}, onRefreshDashboard }) {
  const [sops, setSops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedSop, setSelectedSop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSopModal, setShowSopModal] = useState(false);
  const [editingSop, setEditingSop] = useState(null);
  const [modalSteps, setModalSteps] = useState([{ title: '', details: '' }]);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchSOPs();
  }, [selectedCategory, search]);

  useEffect(() => {
    if (initialSopId) {
      loadSop(initialSopId);
    }
  }, [initialSopId]);

  async function fetchSOPs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/founder-os/sops?category=${selectedCategory}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setSops(data.sops || []);
      }
    } catch (err) {
      showToast('Error loading SOPs', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadSop(id) {
    try {
      const res = await fetch(`/api/founder-os/sops/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedSop(data.sop);
      }
    } catch (err) {
      showToast('Error loading SOP details', 'error');
    }
  }

  function handleOpenModal(sop = null) {
    setEditingSop(sop);
    if (sop) {
      let steps = [];
      try {
        steps = typeof sop.steps_json === 'string' ? JSON.parse(sop.steps_json) : (sop.steps_json || []);
      } catch (e) {
        steps = [];
      }
      setModalSteps(steps.length > 0 ? steps : [{ title: '', details: '' }]);
    } else {
      setModalSteps([{ title: '', details: '' }]);
    }
    setShowSopModal(true);
  }

  function handleAddStep() {
    setModalSteps([...modalSteps, { title: '', details: '' }]);
  }

  function handleRemoveStep(index) {
    setModalSteps(modalSteps.filter((_, i) => i !== index));
  }

  function handleStepChange(index, field, value) {
    const updated = [...modalSteps];
    updated[index][field] = value;
    setModalSteps(updated);
  }

  async function handleSaveSop(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      name: form.name.value,
      category: form.category.value,
      description: form.description.value,
      owner: form.owner.value,
      version: form.version.value,
      steps_json: modalSteps.filter(s => s.title.trim() !== '')
    };

    try {
      let res;
      if (editingSop) {
        res = await fetch(`/api/founder-os/sops/${editingSop.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/sops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingSop ? 'SOP updated' : 'SOP created successfully', 'success');
        setShowSopModal(false);
        setEditingSop(null);
        fetchSOPs();
        if (selectedSop?.id === (editingSop?.id || data.sop?.id)) {
          setSelectedSop(data.sop || editingSop);
        }
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save SOP', 'error');
      }
    } catch (err) {
      showToast('Error saving SOP', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/sops/${deleteConfirm.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('SOP deleted', 'success');
        setDeleteConfirm({ isOpen: false, id: null, title: '' });
        setSelectedSop(null);
        fetchSOPs();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete SOP', 'error');
      }
    } catch (err) {
      showToast('Error deleting SOP', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* If SOP is selected, render Reader View */}
      {selectedSop ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedSop(null)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                    {selectedSop.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    v{selectedSop.version}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                  {selectedSop.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenModal(selectedSop)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Edit SOP
              </button>
              <button
                onClick={() => setDeleteConfirm({ isOpen: true, id: selectedSop.id, title: selectedSop.name })}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-xs transition-colors cursor-pointer"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          {/* SOP Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {selectedSop.description && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Purpose & Context
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedSop.description}
                  </p>
                </div>
              )}

              {/* Steps Ordered List */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-outfit">
                  Standard Execution Steps
                </h3>

                {(() => {
                  let steps = [];
                  try {
                    steps = typeof selectedSop.steps_json === 'string' ? JSON.parse(selectedSop.steps_json) : (selectedSop.steps_json || []);
                  } catch (e) {
                    steps = [];
                  }

                  if (!steps || steps.length === 0) {
                    return (
                      <div className="p-6 text-xs text-slate-500 text-center bg-slate-50 rounded-xl border border-slate-200/60">
                        No steps specified for this SOP yet.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {steps.map((step, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                          <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 mb-1">
                              {step.title}
                            </h4>
                            {step.details && (
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {step.details}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* SOP Metadata Sidebar */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-outfit mb-3">
                  Document Metadata
                </h3>
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Owner</span>
                  <span className="font-bold text-slate-900">{selectedSop.owner || 'Founder'}</span>
                </div>
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Category</span>
                  <span className="font-bold text-slate-900">{selectedSop.category}</span>
                </div>
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Version</span>
                  <span className="font-mono font-bold text-slate-900">v{selectedSop.version}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Last Updated</span>
                  <span className="font-mono text-slate-500">
                    {selectedSop.last_updated ? new Date(selectedSop.last_updated).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SOPs DIRECTORY VIEW */
        <div className="space-y-4">
          {/* Categories Pill Filter & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'ALL' 
                    ? 'bg-violet-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All Categories
              </button>
              {SOP_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-violet-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-[200px] w-full md:w-auto">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search SOPs..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus size={15} weight="bold" />
                <span>New SOP</span>
              </button>
            </div>
          </div>

          {sops.length === 0 && !loading ? (
            <EmptyState
              icon={BookOpen}
              title="No SOPs created yet"
              description="Document agency processes for Client Onboarding, Design, QA, Deployment, and Security."
              actionLabel="Add First SOP"
              onAction={() => handleOpenModal()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sops.map((sop) => {
                let steps = [];
                try {
                  steps = typeof sop.steps_json === 'string' ? JSON.parse(sop.steps_json) : (sop.steps_json || []);
                } catch (e) {
                  steps = [];
                }

                return (
                  <div
                    key={sop.id}
                    onClick={() => setSelectedSop(sop)}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                          {sop.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          v{sop.version}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 font-outfit group-hover:text-violet-600 transition-colors mb-1.5">
                        {sop.name}
                      </h3>

                      {sop.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                          {sop.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{steps.length} Steps</span>
                      <span>Owner: {sop.owner || 'Founder'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- MODAL: ADD / EDIT SOP --- */}
      {showSopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingSop ? 'Edit SOP' : 'Create New Standard Operating Procedure'}
              </h3>
              <button 
                onClick={() => setShowSopModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSop} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SOP Name *</label>
                  <input
                    name="name"
                    defaultValue={editingSop?.name || ''}
                    required
                    placeholder="e.g. Client Onboarding & WhatsApp Setup"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingSop?.category || 'Client Onboarding'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {SOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Document Owner</label>
                  <input
                    name="owner"
                    defaultValue={editingSop?.owner || 'Founder'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Version</label>
                  <input
                    name="version"
                    defaultValue={editingSop?.version || '1.0'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Goal</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingSop?.description || ''}
                  placeholder="Why does this procedure exist and what does it achieve?"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Dynamic Steps Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Execution Steps ({modalSteps.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                  >
                    <Plus size={13} weight="bold" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {modalSteps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 relative group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Step #{idx + 1}
                        </span>
                        {modalSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                      <input
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        placeholder="Step action title (e.g. Create client shared drive folder)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <textarea
                        value={step.details}
                        onChange={(e) => handleStepChange(idx, 'details', e.target.value)}
                        rows={2}
                        placeholder="Detailed instructions, links, or templates..."
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSopModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingSop ? 'Update SOP' : 'Save SOP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        isDestructive={true}
        title="Delete SOP"
        message={`Are you sure you want to delete SOP "${deleteConfirm.title}"?`}
        confirmLabel="Delete SOP"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
}
