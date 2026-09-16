"use client";
import { useState, useEffect } from 'react';
import { X, Sparkle, ArrowsClockwise, FloppyDisk, PaperPlaneTilt, Buildings, User, Globe, Tag, Eye } from "@phosphor-icons/react";
import SendConfirmModal from './SendConfirmModal';

const SERVICES = [
  { id: 'website_development', name: 'Website Development & Redesign' },
  { id: 'seo_optimization', name: 'SEO & Search Optimization' },
  { id: 'ai_automation', name: 'AI Automation & Smart Workflows' }
];

export default function EmailStudioModal({ isOpen, onClose, lead, onEmailSent, showToast }) {
  const [selectedService, setSelectedService] = useState('website_development');
  const [customObservation, setCustomObservation] = useState('');
  
  // Email fields
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [draftId, setDraftId] = useState(null);
  
  // Loading & State
  const [generating, setGenerating] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [generatedOnce, setGeneratedOnce] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      setRecipient(lead.email || '');
      setCustomObservation(lead.personalization_context || '');
      
      // Auto pick best service if not set
      const ind = (lead.industry || lead.category || '').toLowerCase();
      if (ind.includes('tech') || ind.includes('saas') || ind.includes('software')) {
        setSelectedService('ai_automation');
      } else if (ind.includes('clinic') || ind.includes('law') || ind.includes('real estate') || ind.includes('restaurant')) {
        setSelectedService('seo_optimization');
      } else {
        setSelectedService('website_development');
      }

      // Check if lead already has a draft
      fetchLeadDraft(lead.id);
    }
  }, [lead, isOpen]);

  async function fetchLeadDraft(leadId) {
    try {
      const res = await fetch(`/api/admin/email-automation/drafts?leadId=${leadId}`);
      const data = await res.json();
      if (res.ok && data.success && data.data && data.data.length > 0) {
        const latestDraft = data.data[0];
        setDraftId(latestDraft.id);
        setSubject(latestDraft.subject);
        setBody(latestDraft.body);
        if (latestDraft.target_service) setSelectedService(latestDraft.target_service);
        if (latestDraft.observation) setCustomObservation(latestDraft.observation);
        setGeneratedOnce(true);
      } else {
        // If no draft exists, generate fresh draft automatically
        generateEmailForLead(lead, false);
      }
    } catch (err) {
      generateEmailForLead(lead, false);
    }
  }

  async function generateEmailForLead(currentLead = lead, notify = true) {
    if (!currentLead) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/email-automation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: currentLead.id,
          targetService: selectedService,
          customObservation: customObservation.trim() || undefined,
          saveAsDraft: true
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubject(data.data.subject);
        setBody(data.data.body);
        setDraftId(data.data.draftId);
        setGeneratedOnce(true);
        if (notify) showToast?.('Personalized email generated successfully!', 'success');
      } else {
        showToast?.(data.error || 'Failed to generate email', 'error');
      }
    } catch (err) {
      showToast?.('Error connecting to email generator.', 'error');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveDraft() {
    if (!subject.trim() || !body.trim()) {
      showToast?.('Subject and body cannot be empty', 'error');
      return;
    }
    setSavingDraft(true);
    try {
      const res = await fetch('/api/admin/email-automation/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId,
          leadId: lead?.id,
          subject,
          body,
          targetService: selectedService,
          observation: customObservation
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast?.('Draft saved successfully.', 'success');
      } else {
        showToast?.(data.error || 'Failed to save draft', 'error');
      }
    } catch (err) {
      showToast?.('Error saving draft', 'error');
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleConfirmSend() {
    if (!recipient.trim() || !recipient.includes('@')) {
      showToast?.('Please enter a valid recipient email address.', 'error');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      showToast?.('Email subject and body are required.', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/admin/email-automation/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead?.id,
          recipient: recipient.trim(),
          subject: subject.trim(),
          body: body.trim(),
          draftId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast?.(`Email sent successfully to ${recipient}!`, 'success');
        setShowConfirmModal(false);
        onEmailSent?.();
        onClose();
      } else {
        showToast?.(data.error || 'Failed to send email via Hostinger.', 'error');
      }
    } catch (err) {
      showToast?.('Unable to connect to email sending service.', 'error');
    } finally {
      setSending(false);
    }
  }

  if (!isOpen || !lead) return null;

  const companyName = lead.company_name || lead.business_name || 'Lead';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fadeIn">
        <div className="bg-surface-container-lowest border border-primary/40 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
          
          {/* Studio Header */}
          <div className="p-6 border-b border-primary/20 flex justify-between items-center bg-surface/90 backdrop-blur-md sticky top-0 z-10">
            <div>
              <span className="font-label-caps text-xs text-primary uppercase tracking-widest block font-bold flex items-center gap-1.5">
                <Sparkle size={14} weight="fill" />
                Personalized Outreach Studio
              </span>
              <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface font-bold mt-0.5">
                {companyName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-light hover:text-on-surface p-2 transition-colors cursor-pointer"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Lead Context & Generation Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Lead Information Card */}
              <div className="bg-surface/90 border border-outline-variant p-4 space-y-2.5">
                <h4 className="font-label-caps text-xs text-primary uppercase tracking-wider font-bold border-b border-outline-variant pb-2">
                  Lead Information
                </h4>
                
                <div className="text-xs space-y-1.5 text-main-text">
                  <div className="flex items-center gap-2">
                    <Buildings className="text-text-light shrink-0" size={14} />
                    <span className="text-text-light">Company:</span>
                    <span className="text-on-surface font-semibold">{companyName}</span>
                  </div>

                  {lead.name && (
                    <div className="flex items-center gap-2">
                      <User className="text-text-light shrink-0" size={14} />
                      <span className="text-text-light">Contact:</span>
                      <span className="text-on-surface">{lead.name}</span>
                    </div>
                  )}

                  {lead.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="text-text-light shrink-0" size={14} />
                      <span className="text-text-light">Website:</span>
                      <a 
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary hover:underline truncate max-w-[200px]"
                      >
                        {lead.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  {(lead.industry || lead.category) && (
                    <div className="flex items-center gap-2">
                      <Tag className="text-text-light shrink-0" size={14} />
                      <span className="text-text-light">Industry:</span>
                      <span className="text-on-surface">{lead.industry || lead.category}</span>
                    </div>
                  )}

                  {lead.location && (
                    <div className="text-text-light">
                      <span>Location: </span>
                      <span className="text-main-text">{lead.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Angle Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-label-caps text-main-text uppercase tracking-wider font-semibold">
                  Target Service Angle
                </label>
                <div className="space-y-1.5">
                  {SERVICES.map(svc => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedService(svc.id)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-medium transition-all border cursor-pointer flex items-center justify-between ${
                        selectedService === svc.id
                          ? 'bg-primary/15 border-primary text-on-surface font-bold'
                          : 'bg-surface/60 border-outline-variant text-text-light hover:text-main-text hover:border-outline'
                      }`}
                    >
                      <span>{svc.name}</span>
                      {selectedService === svc.id && <Sparkle size={14} className="text-primary" weight="fill" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Observation Override */}
              <div className="space-y-1.5">
                <label className="block text-xs font-label-caps text-main-text uppercase tracking-wider font-semibold">
                  Specific Observation / Note
                </label>
                <textarea
                  rows={3}
                  value={customObservation}
                  onChange={(e) => setCustomObservation(e.target.value)}
                  placeholder="e.g. while looking at your homepage, I noticed the hero button doesn't link to a booking form..."
                  className="w-full bg-surface text-on-surface font-body-md p-3 text-xs border border-outline focus:outline-none focus:border-primary transition-colors"
                />
                <span className="text-[11px] text-text-light block">
                  Add direct observation to tailor the generated email.
                </span>
              </div>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={() => generateEmailForLead(lead, true)}
                disabled={generating}
                className="w-full py-2.5 bg-surface hover:bg-outline-variant border border-primary/60 hover:border-primary text-primary text-xs uppercase font-label-caps tracking-widest font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ArrowsClockwise className={generating ? 'animate-spin' : ''} size={16} weight="bold" />
                <span>{generating ? 'Generating Email...' : 'Regenerate Email'}</span>
              </button>
            </div>

            {/* Right Column: Live Editable Email Preview (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
                <h4 className="font-label-caps text-xs text-primary uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Eye size={16} />
                  Email Preview & Editor
                </h4>
                <span className="text-[11px] text-text-light font-label-caps">
                  Editable Before Sending
                </span>
              </div>

              {/* To field */}
              <div className="bg-surface/90 border border-outline-variant p-2.5 flex items-center gap-3">
                <span className="text-xs font-label-caps text-text-light uppercase tracking-wider w-14 font-semibold">
                  To:
                </span>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@company.com"
                  className="w-full bg-transparent text-on-surface font-body-md text-xs focus:outline-none placeholder:text-text-light font-medium"
                />
              </div>

              {/* Subject field */}
              <div className="bg-surface/90 border border-outline-variant p-2.5 flex items-center gap-3">
                <span className="text-xs font-label-caps text-text-light uppercase tracking-wider w-14 font-semibold">
                  Subject:
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Cold outreach subject line..."
                  className="w-full bg-transparent text-primary font-body-md text-xs focus:outline-none font-semibold"
                />
              </div>

              {/* Body field */}
              <div className="flex-grow flex flex-col">
                <span className="text-xs font-label-caps text-text-light uppercase tracking-wider mb-1.5 font-semibold">
                  Body:
                </span>
                <textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Personalized cold email body..."
                  className="w-full flex-grow bg-surface/95 text-on-surface font-mono text-xs leading-relaxed p-4 border border-outline focus:outline-none focus:border-primary transition-colors resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-outline-variant flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  className="px-4 py-2 border border-outline hover:border-primary/50 text-main-text text-xs uppercase font-label-caps tracking-widest transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FloppyDisk size={16} weight="bold" />
                  <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-text-light hover:text-on-surface text-xs uppercase font-label-caps tracking-widest transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!recipient.trim()) {
                        showToast?.('Please enter a recipient email before sending.', 'error');
                        return;
                      }
                      setShowConfirmModal(true);
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs uppercase font-label-caps tracking-widest font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Review & Send Email</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Manual Approval & Dispatch Confirmation Modal */}
      <SendConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
        loading={sending}
        emailData={{
          recipient,
          subject,
          companyName
        }}
      />
    </>
  );
}
