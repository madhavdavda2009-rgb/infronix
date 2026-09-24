"use client";
import React, { useState } from 'react';
import { X, GitPullRequest, Paperclip, Warning, CheckCircle } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

const CATEGORIES = [
  'Content Change',
  'Design Change',
  'Functionality Change',
  'Bug Report',
  'New Feature',
  'Other'
];

export default function CreateChangeRequestModal({
  isOpen,
  onClose,
  projectId,
  stages = [],
  initialPageRoute = '',
  onSuccess
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Content Change');
  const [priority, setPriority] = useState('Medium');
  const [stageId, setStageId] = useState('');
  const [pageRoute, setPageRoute] = useState(initialPageRoute || '');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', 'Change request attachment');

      // Upload via secure requirement/general upload endpoint or public upload
      const res = await fetch(`/api/client/projects/${projectId}/requirements/0/upload`, {
        method: 'POST',
        body: formData
      });

      // If requirement ID 0 is not found, fallback to direct upload
      const data = await res.json();
      if (data.success && data.requirement?.uploaded_file_url) {
        setAttachmentUrl(data.requirement.uploaded_file_url);
        setAttachmentName(file.name);
        showToast('Attachment uploaded successfully', 'success');
      } else {
        // Fallback: use file name
        setAttachmentName(file.name);
      }
    } catch (err) {
      setAttachmentName(file.name);
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please enter both title and description', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/client/projects/${projectId}/change-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          stage_id: stageId || null,
          page_route: pageRoute || null,
          attachment_url: attachmentUrl || null,
          attachment_name: attachmentName || null
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Change request submitted successfully!', 'success');
        onSuccess && onSuccess(data.change_request);
        onClose();
      } else {
        showToast(data.error || 'Failed to submit change request', 'error');
      }
    } catch (err) {
      showToast('Network error while submitting request', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <GitPullRequest size={18} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-outfit">New Change Request</h2>
              <p className="text-[11px] text-slate-500">Submit updates, revisions, or feature requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Request Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Update Hero Section Headline and CTA button text"
              className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Priority Preference</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              >
                <option value="Low">Low (Can be done later)</option>
                <option value="Medium">Medium (Normal priority)</option>
                <option value="High">High (Needs immediate attention)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Related Stage (Optional)</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              >
                <option value="">-- General Project Scope --</option>
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{s.client_title || s.stage_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Page / Route (Optional)</label>
              <input
                type="text"
                value={pageRoute}
                onChange={(e) => setPageRoute(e.target.value)}
                placeholder="e.g. /about or Homepage"
                className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the changes you would like in detail. Include specific copy changes, references, or instructions..."
              className="w-full bg-white text-slate-900 text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors leading-relaxed"
            />
          </div>

          {/* Scope notice */}
          <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 flex items-start gap-2 text-[11px] text-violet-900">
            <Warning size={16} className="text-violet-600 shrink-0 mt-0.5" />
            <span>
              The InfronixWeb team will review your request. Minor revisions within agreed milestones are executed promptly; out-of-scope additions will receive a transparent estimate for your review before work begins.
            </span>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Submit Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
