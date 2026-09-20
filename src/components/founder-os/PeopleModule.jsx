"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Plus, Pencil, Trash, X, Envelope, Phone, Briefcase, 
  Globe, Image, LinkedinLogo, GithubLogo, InstagramLogo, LinkSimple,
  ShieldCheck, ArrowSquareOut, UploadSimple
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
  const [websiteFilter, setWebsiteFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [responsibilities, setResponsibilities] = useState([]);
  const [newRespInput, setNewRespInput] = useState('');
  
  // Website profile modal state
  const [showOnWebsite, setShowOnWebsite] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [showOnAboutPage, setShowOnAboutPage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bioCharCount, setBioCharCount] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

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
      setShowOnWebsite(Boolean(person.show_on_website));
      setShowOnHomepage(Boolean(person.show_on_homepage));
      setShowOnAboutPage(Boolean(person.show_on_about_page));
      setProfileImageUrl(person.profile_image_url || '');
      setBioCharCount((person.public_bio || '').length);
    } else {
      setResponsibilities([]);
      setShowOnWebsite(false);
      setShowOnHomepage(false);
      setShowOnAboutPage(false);
      setProfileImageUrl('');
      setBioCharCount(0);
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

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be under 10MB', 'error');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/founder-os/people/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setProfileImageUrl(data.imageUrl);
        showToast('Profile image uploaded successfully', 'success');
      } else {
        showToast(data.error || 'Failed to upload image', 'error');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Error uploading image. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSavePerson(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    
    const isFounder = editingPerson?.is_founder || editingPerson?.employment_type === 'Founder' || form.employment_type?.value === 'Founder';

    const payload = {
      name: form.elements.namedItem('name').value,
      role: form.role.value,
      email: form.email.value,
      phone: form.phone.value,
      joining_date: form.joining_date.value || null,
      employment_type: isFounder ? 'Founder' : form.employment_type.value,
      status: form.status.value,
      notes: form.notes.value,
      responsibilities_json: responsibilities,
      // Website Profile
      show_on_website: showOnWebsite,
      show_on_homepage: showOnWebsite ? showOnHomepage : false,
      show_on_about_page: showOnWebsite ? showOnAboutPage : false,
      public_role: form.public_role?.value || form.role.value,
      public_slug: form.public_slug?.value || null,
      public_bio: form.public_bio?.value || null,
      profile_image_url: profileImageUrl || null,
      display_order: parseInt(form.display_order?.value || '0', 10),
      linkedin_url: form.linkedin_url?.value || null,
      github_url: form.github_url?.value || null,
      portfolio_url: form.portfolio_url?.value || null,
      instagram_url: form.instagram_url?.value || null
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

  const filteredPeople = people.filter(p => {
    if (websiteFilter === 'WEBSITE') return p.show_on_website;
    if (websiteFilter === 'HOMEPAGE') return p.show_on_website && p.show_on_homepage;
    if (websiteFilter === 'ABOUT') return p.show_on_website && p.show_on_about_page;
    if (websiteFilter === 'HIDDEN') return !p.show_on_website;
    return true;
  });

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

          <select
            value={websiteFilter}
            onChange={(e) => setWebsiteFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 shadow-xs focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="ALL">All Website Visibility</option>
            <option value="WEBSITE">Published on Website</option>
            <option value="HOMEPAGE">Shown on Homepage</option>
            <option value="ABOUT">Shown on About Page</option>
            <option value="HIDDEN">Internal Only (Hidden)</option>
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
      {filteredPeople.length === 0 && !loading ? (
        <EmptyState
          icon={Users}
          title="No team members match your filters"
          description="Add founders, developers, designers, and specialists or adjust your filters above."
          actionLabel="Add Team Member"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => {
            let resp = [];
            try {
              resp = typeof person.responsibilities_json === 'string' ? JSON.parse(person.responsibilities_json) : (person.responsibilities_json || []);
            } catch (e) {
              resp = [];
            }

            const isFounder = person.is_founder || person.employment_type === 'Founder' || (person.name && person.name.toLowerCase().includes('madhav'));

            return (
              <div
                key={person.id}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  isFounder ? 'border-violet-300 ring-1 ring-violet-400/30' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {person.profile_image_url ? (
                        <img 
                          src={person.profile_image_url} 
                          alt={person.name}
                          className="w-11 h-11 rounded-full object-cover border border-violet-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center font-bold text-violet-700 text-sm">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 font-outfit">
                            {person.name}
                          </h3>
                          {isFounder && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 text-violet-800 uppercase tracking-wider">
                              <ShieldCheck size={11} weight="fill" /> Founder
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-violet-600 font-semibold block">
                          {person.public_role || person.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        person.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {person.status}
                      </span>
                      {Number.isInteger(person.display_order) && (
                        <span className="text-[10px] text-slate-600 font-mono font-semibold">
                          Order #{person.display_order}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Website Visibility Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    {person.show_on_website ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Globe size={11} /> Website
                        </span>
                        {person.show_on_homepage && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            Home
                          </span>
                        )}
                        {person.show_on_about_page && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            About
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                        Internal Only
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3">
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

                  {/* Public Bio Preview */}
                  {person.public_bio && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 line-clamp-2 italic mb-3">
                      "{person.public_bio}"
                    </div>
                  )}

                  {/* Social Profiles */}
                  {(person.linkedin_url || person.github_url || person.instagram_url || person.portfolio_url) && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-slate-500">
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors" title="LinkedIn">
                          <LinkedinLogo size={15} weight="fill" />
                        </a>
                      )}
                      {person.github_url && (
                        <a href={person.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors" title="GitHub">
                          <GithubLogo size={15} weight="fill" />
                        </a>
                      )}
                      {person.instagram_url && (
                        <a href={person.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors" title="Instagram">
                          <InstagramLogo size={15} weight="fill" />
                        </a>
                      )}
                      {person.portfolio_url && (
                        <a href={person.portfolio_url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors" title="Website">
                          <LinkSimple size={15} weight="bold" />
                        </a>
                      )}
                    </div>
                  )}

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
                      title="Edit Member & Website Profile"
                    >
                      <Pencil size={15} />
                    </button>
                    {isFounder ? (
                      <span 
                        className="p-1.5 text-slate-300 cursor-not-allowed" 
                        title="The Founder record is protected and cannot be deleted."
                      >
                        <ShieldCheck size={15} />
                      </span>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, id: person.id, title: person.name })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash size={15} />
                      </button>
                    )}
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
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  {editingPerson ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                {editingPerson?.is_founder && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800 uppercase">
                    <ShieldCheck size={12} weight="fill" /> Protected Founder
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowPersonModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="space-y-4 text-xs">
              {/* Basic Internal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    name="name"
                    defaultValue={editingPerson?.name || ''}
                    required
                    placeholder="e.g. Madhav Davda"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Internal Role / Designation *</label>
                  <input
                    name="role"
                    defaultValue={editingPerson?.role || ''}
                    required
                    placeholder="e.g. Lead Engineer"
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
                    placeholder="support@infronixweb.in"
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
                    disabled={editingPerson?.is_founder || editingPerson?.employment_type === 'Founder'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 disabled:bg-slate-100 disabled:text-slate-500"
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

              {/* ================= WEBSITE PROFILE SECTION ================= */}
              <div className="pt-4 border-t-2 border-violet-100 bg-violet-50/40 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-violet-600" weight="bold" />
                    <span className="font-bold text-slate-900 text-sm font-outfit">Website Profile & Public Visibility</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Syncs with Homepage & About Page</span>
                </div>

                {/* Visibility Checkboxes */}
                <div className="p-3 bg-white rounded-xl border border-violet-200/80 space-y-2.5">
                  <label className="flex items-center gap-2.5 font-semibold text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnWebsite}
                      onChange={(e) => {
                        setShowOnWebsite(e.target.checked);
                        if (!e.target.checked) {
                          setShowOnHomepage(false);
                          setShowOnAboutPage(false);
                        } else {
                          setShowOnHomepage(true);
                          setShowOnAboutPage(true);
                        }
                      }}
                      className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500"
                    />
                    <span>Show on InfronixWeb Website (Publicly Visible)</span>
                  </label>

                  {showOnWebsite && (
                    <div className="pl-6 pt-1 flex flex-wrap gap-4 text-slate-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnHomepage}
                          onChange={(e) => setShowOnHomepage(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                        />
                        <span className="font-medium">Show in Homepage Team Section</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnAboutPage}
                          onChange={(e) => setShowOnAboutPage(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="font-medium">Show in About Us Team Section</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Public Role & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Public Display Role</label>
                    <input
                      name="public_role"
                      defaultValue={editingPerson?.public_role || editingPerson?.role || ''}
                      placeholder="e.g. Founder & Lead Engineer"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                    <input
                      name="display_order"
                      type="number"
                      min="0"
                      defaultValue={editingPerson?.display_order !== undefined ? editingPerson.display_order : 10}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                    />
                    <span className="text-[10px] text-slate-600">Lower numbers appear first</span>
                  </div>
                </div>

                {/* Profile Image Upload & Preview */}
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">Profile Photo / Avatar</label>
                  <div className="flex items-center gap-3">
                    {profileImageUrl ? (
                      <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                        <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProfileImageUrl('')}
                          className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <Image size={24} />
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.svg"
                          className="hidden"
                          id="team-photo-upload"
                        />
                        <label
                          htmlFor="team-photo-upload"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer ${
                            uploadingImage ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                        </label>

                        {profileImageUrl && (
                          <button
                            type="button"
                            onClick={() => setProfileImageUrl('')}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={profileImageUrl}
                        onChange={(e) => setProfileImageUrl(e.target.value)}
                        placeholder="Or paste image URL (e.g. /my-image.jpeg or https://...)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Public Biography */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-semibold">Public Biography</label>
                    <span className={`text-[10px] ${bioCharCount > 500 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                      {bioCharCount}/500 chars
                    </span>
                  </div>
                  <textarea
                    name="public_bio"
                    rows={3}
                    maxLength={500}
                    defaultValue={editingPerson?.public_bio || ''}
                    onChange={(e) => setBioCharCount(e.target.value.length)}
                    placeholder="Short professional summary displayed on About Us and team cards..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">Public Social & Portfolio Links</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5">
                      <LinkedinLogo size={16} className="text-[#0A66C2] shrink-0" weight="fill" />
                      <input
                        name="linkedin_url"
                        type="url"
                        defaultValue={editingPerson?.linkedin_url || ''}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5">
                      <GithubLogo size={16} className="text-slate-800 shrink-0" weight="fill" />
                      <input
                        name="github_url"
                        type="url"
                        defaultValue={editingPerson?.github_url || ''}
                        placeholder="https://github.com/username"
                        className="w-full text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5">
                      <InstagramLogo size={16} className="text-[#E1306C] shrink-0" weight="fill" />
                      <input
                        name="instagram_url"
                        type="url"
                        defaultValue={editingPerson?.instagram_url || ''}
                        placeholder="https://instagram.com/username"
                        className="w-full text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5">
                      <LinkSimple size={16} className="text-violet-600 shrink-0" weight="bold" />
                      <input
                        name="portfolio_url"
                        type="url"
                        defaultValue={editingPerson?.portfolio_url || ''}
                        placeholder="https://yourportfolio.com"
                        className="w-full text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Slug (Optional) */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Public URL Slug</label>
                  <input
                    name="public_slug"
                    defaultValue={editingPerson?.public_slug || ''}
                    placeholder="e.g. madhav-davda (auto-generated if empty)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              {/* Responsibilities Tag Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <label className="block text-slate-700 font-semibold">
                  Internal Assigned Responsibilities ({responsibilities.length})
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
                <label className="block text-slate-700 font-semibold mb-1">Internal Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingPerson?.notes || ''}
                  placeholder="Private employment or contract notes (never exposed publicly)..."
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
                  disabled={actionLoading || uploadingImage}
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
        message={`Are you sure you want to remove "${deleteConfirm.title}" from the team directory? This will remove public visibility while preserving historical project records.`}
        confirmLabel="Remove"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
}
