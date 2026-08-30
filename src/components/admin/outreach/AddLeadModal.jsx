"use client";
import { useState, useEffect } from 'react';
import { X, FloppyDisk, Buildings, User, EnvelopeSimple, Globe, MapPin, Tag, FileText, Sparkle } from "@phosphor-icons/react";

const STATUS_OPTIONS = [
  'New',
  'Ready',
  'Email Generated',
  'Sent',
  'Replied',
  'Interested',
  'Not Interested',
  'Follow Up',
  'Converted'
];

export default function AddLeadModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    website: '',
    industry: '',
    location: '',
    company_description: '',
    personalization_context: '',
    lead_source: 'Manual',
    status: 'New'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company_name: initialData.company_name || initialData.business_name || '',
        email: initialData.email || '',
        website: initialData.website || '',
        industry: initialData.industry || initialData.category || '',
        location: initialData.location || '',
        company_description: initialData.company_description || '',
        personalization_context: initialData.personalization_context || '',
        lead_source: initialData.lead_source || initialData.source || 'Manual',
        status: initialData.status || 'New'
      });
    } else {
      setFormData({
        name: '',
        company_name: '',
        email: '',
        website: '',
        industry: '',
        location: '',
        company_description: '',
        personalization_context: '',
        lead_source: 'Manual',
        status: 'New'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name.trim() && !formData.name.trim() && !formData.email.trim()) {
      setError('Please provide at least a Company Name, Contact Name, or Email.');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-champagne-light/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-champagne-light/20 flex justify-between items-center bg-navy-muted/90 backdrop-blur-md sticky top-0 z-10">
          <div>
            <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest block font-bold">
              {initialData ? 'Edit Lead Record' : 'Create New Lead'}
            </span>
            <h2 className="font-headline-lg text-xl md:text-2xl text-white font-bold mt-0.5">
              {initialData ? (formData.company_name || 'Lead Details') : 'Add Outreach Lead'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 transition-colors cursor-pointer"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Company Name *
              </label>
              <div className="relative">
                <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="e.g. Apex Dental Care"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Contact Person Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Dr. Aryan Mehta"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>

            {/* Industry / Category */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Industry / Niche
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  placeholder="e.g. Healthcare, Real Estate, Law"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>

            {/* Location (City / Area) */}
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
              Company Description / Services
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea
                rows={2}
                value={formData.company_description}
                onChange={(e) => handleChange('company_description', e.target.value)}
                placeholder="Brief summary of what this business does, target clients, specialties..."
                className="w-full bg-slate-900 text-white font-body-md pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
              />
            </div>
          </div>

          {/* Personalization Context / Specific Observations */}
          <div>
            <label className="block text-xs font-label-caps text-champagne-light uppercase tracking-wider mb-1.5 font-semibold flex items-center gap-1.5">
              <Sparkle size={14} weight="fill" />
              Personalization Context & Observations
            </label>
            <textarea
              rows={2}
              value={formData.personalization_context}
              onChange={(e) => handleChange('personalization_context', e.target.value)}
              placeholder="e.g. Website takes 5s to load on mobile; No online appointment booking widget; Missing local SEO citations"
              className="w-full bg-slate-900 text-white font-body-md px-3 py-2 text-sm border border-champagne-light/40 focus:outline-none focus:border-champagne-light transition-colors"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              This context will be directly referenced in the personalized email generation engine.
            </span>
          </div>

          {/* Lead Source & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Lead Source
              </label>
              <input
                type="text"
                value={formData.lead_source}
                onChange={(e) => handleChange('lead_source', e.target.value)}
                placeholder="e.g. Google Maps, LinkedIn, Referral, Manual"
                className="w-full bg-slate-900 text-white font-body-md px-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                Lead Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-slate-900 text-white font-body-md px-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light transition-colors"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs uppercase font-label-caps tracking-widest transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-champagne-light hover:bg-white text-navy-muted text-xs uppercase font-label-caps tracking-widest font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FloppyDisk size={16} weight="bold" />
              <span>{loading ? 'Saving...' : (initialData ? 'Update Lead' : 'Save Lead')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
