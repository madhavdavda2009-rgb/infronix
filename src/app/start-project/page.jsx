"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, CheckCircle, WarningCircle, X, Star,
  Globe, MagnifyingGlass, Robot, PaperPlaneTilt, Phone,
  EnvelopeSimple, WhatsappLogo, Clock
} from "@phosphor-icons/react";
import Breadcrumb from '@/components/Breadcrumb';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';

const TIMELINE_OPTIONS = ['As soon as possible', 'Within 1–2 weeks', 'Within 2–4 weeks', '1–2 months', 'Flexible'];

const INPUT_CLASS = "w-full bg-surface text-on-surface font-body-md px-4 py-3.5 sm:py-4 rounded-lg border border-outline focus:outline-none focus:border-primary transition-all font-medium placeholder:text-text-light text-sm sm:text-base";
const LABEL_CLASS = "font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs";

export default function StartProjectPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDescription: '',
    websiteUrl: '',
    timeline: '',
    additionalNotes: ''
  });

  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('infronix_project_submitted')) {
      setSuccess(true);
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(".fade-up",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { fullName, email, phone, projectDescription } = formData;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name, email, and phone number.');
      return;
    }

    if (!projectDescription.trim()) {
      setErrorMsg('Please tell us about your project.');
      return;
    }

    const formattedEmail = formatEmail(email);
    if (!isValidEmail(formattedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedServices: ['custom'],
          projectName: formData.companyName || formData.fullName,
          hasExistingWebsite: formData.websiteUrl ? 'Yes' : 'No',
          websiteUrl: formData.websiteUrl,
          projectDescription: formData.projectDescription,
          timeline: formData.timeline,
          fullName: formatTitleCase(fullName),
          email: formattedEmail,
          phone: formData.phone,
          companyName: formatTitleCase(formData.companyName),
          additionalNotes: formData.additionalNotes
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        localStorage.setItem('infronix_project_submitted', 'true');
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(getFriendlyErrorMessage(data.error, 'Something went wrong. Please try again.'));
      }
    } catch (err) {
      setErrorMsg('We are having trouble connecting. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="min-h-screen pt-24 sm:pt-32 pb-16 bg-surface flex items-center justify-center px-4" ref={containerRef}>
        <div className="max-w-2xl mx-auto text-center fade-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <CheckCircle className="text-primary text-3xl sm:text-4xl" weight="fill" />
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-4xl md:text-5xl text-on-surface font-bold mb-4 sm:mb-6">Quote request received.</h1>
          <p className="font-body-md text-main-text text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-lg mx-auto">
            Thanks for reaching out to Infronix. We&apos;ve received your project details and will review them before getting back to you within 24 hours.
          </p>
          <a href="/" className="inline-block bg-primary text-white font-label-caps uppercase tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 hover:bg-primary-dark transition-all border border-primary font-bold shadow-md rounded-lg text-xs sm:text-sm">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-16 bg-surface" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumb className="justify-center" />

        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 fade-up">
          <span className="font-label-caps text-xs text-primary tracking-widest uppercase mb-2 block font-bold">Get a Quote</span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold mb-3 sm:mb-4">Let&apos;s build something that matters.</h1>
          <p className="font-body-md text-main-text text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Tell us what you need — we&apos;ll get back to you with a tailored proposal within 24 hours.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8 fade-up">

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 rounded-lg">
              <WarningCircle className="text-xl shrink-0 mt-0.5" weight="fill" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* ═══ SECTION 1: YOUR DETAILS ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-5 sm:p-8 md:p-10 shadow-md rounded-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold">01</span>
              <h2 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">Your Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-fullName" className={LABEL_CLASS}>Full Name *</label>
                <input id="sp-fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={INPUT_CLASS} placeholder="Jane Doe" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-email" className={LABEL_CLASS}>Email *</label>
                <input id="sp-email" type="email" name="email" value={formData.email} onChange={handleChange} className={INPUT_CLASS} placeholder="jane@company.com" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-phone" className={LABEL_CLASS}>Phone / WhatsApp *</label>
                <input id="sp-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className={INPUT_CLASS} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-company" className={LABEL_CLASS}>Company / Business Name</label>
                <input id="sp-company" type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={INPUT_CLASS} placeholder="Acme Corp" />
              </div>
            </div>
          </div>

          {/* ═══ SECTION 2: PROJECT DETAILS ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-5 sm:p-8 md:p-10 shadow-md rounded-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold">02</span>
              <h2 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">Project Details</h2>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-description" className={LABEL_CLASS}>Tell us about your project *</label>
                <textarea
                  id="sp-description"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className={`${INPUT_CLASS} min-h-[120px] sm:min-h-[140px] resize-y`}
                  placeholder="Describe your goals, requirements, target audience and anything else we should know about your project..."
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sp-websiteUrl" className={LABEL_CLASS}>Current Website URL <span className="text-text-light font-normal">(optional)</span></label>
                <input id="sp-websiteUrl" type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className={INPUT_CLASS} placeholder="https://www.example.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sp-notes" className={LABEL_CLASS}>Additional Notes <span className="text-text-light font-normal">(optional)</span></label>
                <textarea
                  id="sp-notes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className={`${INPUT_CLASS} min-h-[80px] resize-y`}
                  placeholder="Any other details, preferences, or references you'd like to share..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* ═══ SECTION 3: TIMELINE ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-5 sm:p-8 md:p-10 shadow-md rounded-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold">03</span>
              <h2 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">Timeline</h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className={LABEL_CLASS}>Target Timeline</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                  {TIMELINE_OPTIONS.map(tm => (
                    <label key={tm} className={`flex items-center gap-3 p-3.5 sm:p-4 border rounded-lg cursor-pointer transition-all ${formData.timeline === tm
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-outline hover:border-primary/50'
                      }`}>
                      <input type="radio" name="timeline" value={tm} checked={formData.timeline === tm} onChange={handleChange} className="accent-primary w-4 h-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-on-surface">{tm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ SUBMIT ═══ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 pb-8 border-t border-outline-variant">
            <p className="text-xs text-main-text max-w-md leading-relaxed font-medium">
              We&apos;ll share a detailed, customized proposal and next steps within 24 hours of receiving your request.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 bg-primary text-white hover:bg-primary-dark font-label-caps uppercase tracking-widest text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap border border-primary rounded-lg w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Get a Quote</span>
                  <ArrowRight weight="bold" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
