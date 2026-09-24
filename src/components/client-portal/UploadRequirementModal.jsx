"use client";
import React, { useState } from 'react';
import { X, UploadSimple, FileText, CheckCircle, Warning } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

export default function UploadRequirementModal({
  isOpen,
  onClose,
  projectId,
  requirement,
  onSuccess
}) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !requirement) return null;

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message);

      const res = await fetch(`/api/client/projects/${projectId}/requirements/${requirement.id}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast('Requirement uploaded successfully!', 'success');
        onSuccess && onSuccess(data.requirement);
        onClose();
      } else {
        showToast(data.error || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Network error while uploading file', 'error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <UploadSimple size={18} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-outfit">Upload Requirement</h2>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{requirement.item_name}</p>
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
        <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs">
          {requirement.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
              <strong>Instructions from Team:</strong> {requirement.notes}
            </div>
          )}

          {/* File Input */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Select File <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 hover:bg-violet-50/20">
              <input
                type="file"
                id="portal-req-file"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.doc,.docx,.zip,.txt,.csv"
              />
              <label htmlFor="portal-req-file" className="cursor-pointer block">
                <UploadSimple size={28} className="text-violet-600 mx-auto mb-2" weight="duotone" />
                {file ? (
                  <div>
                    <span className="font-bold text-slate-900 block truncate max-w-xs mx-auto">{file.name}</span>
                    <span className="text-[10px] text-slate-400">({(file.size / (1024 * 1024)).toFixed(2)} MB) - Click to change</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs">Click to browse or drag file</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">PDF, PNG, JPG, SVG, DOCX, ZIP (Max 15MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Notes / Message (Optional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Attached the latest high-res SVG vectors and brand color palette."
              className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-colors"
            />
          </div>

          {/* Footer */}
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
              disabled={uploading || !file}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Upload Deliverable</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
