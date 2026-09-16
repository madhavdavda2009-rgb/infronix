"use client";
import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  X,
  Envelope,
  Phone,
  Calendar,
  CheckCircle,
  Briefcase,
  ListBullets,
  Tag
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

const EMPLOYMENT_TYPES = [
  'Founder',
  'Employee',
  'Freelancer',
  'Contractor',
  'Intern'
];

export default function PeopleModule({ settings = {}, onRefreshDashboard }) {
  const [people, setPeople] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [responsibilities, setResponsibilities] = useState([]);
  const [newRespInput, setNewRespInput] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchPeople();
  }, [statusFilter, typeFilter]);

  async function fetchPeople() {
    setLoading(true);
    try {
      const res = await fetch(`/api/founder-os/people?status=${statusFilter}&type=${typeFilter}`);
      const data = await res.json();
      if (data.success) {
        setPeople(data.people || []);
      }
    } catch (err) {
      showToast('Error loading team directory', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(person = null) {
    setEditingPerson(person);
    if (person) {
      let resp = [];
      try {
        resp = typeof person.responsibilities_json === 'string' ? JSON.parse(person.responsibilities_json) : (person.responsibilities_json || []);
      } catch (e) {
        resp = [];
      }
      setResponsibilities(resp);
    } else {
      setResponsibilities([]);
    }
    setNewRespInput('');
    setShowPersonModal(true);
  }

  function handleAddResponsibility() {
    if (newRespInput.trim() !== '') {
      setResponsibilities([...responsibilities, newRespInput.trim()]);
      setNewRespInput('');
    }
  }

  function handleRemoveResponsibility(idx) {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  }

  async function handleSavePerson(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      name: form.name.value,
      role: form.role.value,
      email: form.email.value,
      phone: form.phone.value,
      joining_date: form.joining_date.value || null,
      employment_type: form.employment_type.value,
      status: form.status.value,
      notes: form.notes.value,
      responsibilities_json: responsibilities
    };

    try {
      let res;
      if (editingPerson) {
        res = await fetch(`/api/founder-os/people/${editingPerson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/people', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(editingPerson ? 'Team member updated' : 'Team member added', 'success');
        setShowPersonModal(false);
        setEditingPerson(null);
        fetchPeople();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save team member', 'error');
      }
    } catch (err) {
      showToast('Error saving team member', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/people/${deleteConfirm.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Team member removed', 'success');
        setDeleteConfirm({ isOpen: false, id: null, title: '' });
        fetchPeople();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete team member', 'error');
      }
    } catch (err) {
      showToast('Error deleting team member', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="ALL">All Employment Types</option>
            {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Directory Grid */}
      {people.length === 0 && !loading ? (
        <EmptyState
          icon={Users}
          title="No team members added yet"
          description="Add founders, developers, designers, contractors, and interns to manage roles and responsibilities."
          actionLabel="Add Team Member"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => {
            let resp = [];
            try {
              resp = typeof person.responsibilities_json === 'string' ? JSON.parse(person.responsibilities_json) : (person.responsibilities_json || []);
            } catch (e) {
              resp = [];
            }

            return (
              <div
                key={person.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center font-bold text-violet-700 text-sm">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 font-outfit">
                          {person.name}
                        </h3>
                        <span className="text-xs text-violet-600 font-semibold">
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      person.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {person.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      <span>{person.employment_type}</span>
                    </div>
                    {person.email && (
                      <div className="flex items-center gap-2">
                        <Envelope size={14} className="text-slate-400" />
                        <span className="truncate">{person.email}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>{person.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Responsibilities */}
                  {resp.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Assigned Responsibilities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {resp.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            • {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Joined {person.joining_date ? new Date(person.joining_date).toLocaleDateString() : '—'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(person)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: person.id, title: person.name })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL: ADD / EDIT TEAM MEMBER --- */}
      {showPersonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingPerson ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button 
                onClick={() => setShowPersonModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    name="name"
                    defaultValue={editingPerson?.name || ''}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role / Designation *</label>
                  <input
                    name="role"
                    defaultValue={editingPerson?.role || ''}
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingPerson?.email || ''}
                    placeholder="john@infronixweb.in"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    name="phone"
                    defaultValue={editingPerson?.phone || ''}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employment Type</label>
                  <select
                    name="employment_type"
                    defaultValue={editingPerson?.employment_type || 'Employee'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingPerson?.status || 'Active'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Joining Date</label>
                  <input
                    name="joining_date"
                    type="date"
                    defaultValue={editingPerson?.joining_date ? String(editingPerson.joining_date).substring(0, 10) : ''}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* Responsibilities Tag Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <label className="block text-slate-700 font-semibold">
                  Assigned Responsibilities ({responsibilities.length})
                </label>
                <div className="flex gap-2">
                  <input
                    value={newRespInput}
                    onChange={(e) => setNewRespInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddResponsibility(); } }}
                    placeholder="e.g. Next.js architecture, Code review, 3D Canvas"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {responsibilities.map((r, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium"
                    >
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(idx)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Emergency Contact</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingPerson?.notes || ''}
                  placeholder="Additional notes..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPersonModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingPerson ? 'Update Member' : 'Add Member'}
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
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deleteConfirm.title}" from the team directory?`}
        confirmLabel="Remove"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
}
