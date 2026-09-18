"use client";
import { Clock, Timer, WarningCircle, ChatCircle, CheckCircle } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';

const RATE_LIMIT_2H_MS = 2 * 60 * 60 * 1000;

export default function ConsultationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [submittedRefId, setSubmittedRefId] = useState('');

  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeRemainingText, setTimeRemainingText] = useState('');
  const [emailError, setEmailError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    checkRateLimit();
    if (!idempotencyKey && typeof crypto !== 'undefined' && crypto.randomUUID) {
      setIdempotencyKey(crypto.randomUUID());
    }
  }, []);

  function checkRateLimit() {
    const lastSubTime = localStorage.getItem('infronix_last_submission_time');
    if (lastSubTime) {
      const elapsed = Date.now() - Number(lastSubTime);
      if (elapsed < RATE_LIMIT_2H_MS) {
        setIsRateLimited(true);
        const remainingMs = RATE_LIMIT_2H_MS - elapsed;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemainingText(`${hours}h ${minutes}m`);
      } else {
        setIsRateLimited(false);
      }
    }
  }

  function handleFirstNameBlur() {
    if (firstName) setFirstName(formatTitleCase(firstName));
  }

  function handleLastNameBlur() {
    if (lastName) setLastName(formatTitleCase(lastName));
  }

  function handleCompanyBlur() {
    if (company) setCompany(formatTitleCase(company));
  }

  function handleEmailBlur() {
    if (email) {
      const cleaned = formatEmail(email);
      setEmail(cleaned);
      if (!isValidEmail(cleaned)) {
        setEmailError('Please enter a valid work email (e.g. jane@company.com)');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isRateLimited) {
      showToast('You have already submitted a request within the last 2 hours.', 'warning');
      return;
    }

    const formattedFirstName = formatTitleCase(firstName);
    const formattedLastName = formatTitleCase(lastName);
    const formattedCompany = formatTitleCase(company);
    const formattedEmail = formatEmail(email);
    const formattedDetails = projectDetails.trim();

    setFirstName(formattedFirstName);
    setLastName(formattedLastName);
    setCompany(formattedCompany);
    setEmail(formattedEmail);

    if (!isValidEmail(formattedEmail)) {
      setEmailError('Please enter a valid work email address (e.g. jane@company.com)');
      showToast('Please enter a valid work email address', 'warning');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('/api/enquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formattedFirstName,
          lastName: formattedLastName,
          email: formattedEmail,
          company: formattedCompany,
          projectDetails: formattedDetails,
          formType: 'Consultation Form',
          sourcePage: '/contact',
          idempotencyKey: idempotencyKey || undefined,
          website_hp_check: honeypot
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        localStorage.setItem('infronix_last_submission_time', Date.now().toString());
        setIsRateLimited(true);
        setTimeRemainingText('2h 0m');
        setSubmittedRefId(data.referenceId || '');
        showToast(data.message || `Thank you! Your enquiry has been received. Reference: ${data.referenceId}`, 'success');
        setFirstName('');
        setLastName('');
        setEmail('');
        setCompany('');
        setProjectDetails('');
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          setIdempotencyKey(crypto.randomUUID());
        }
      } else {
        showToast(getFriendlyErrorMessage(data.error, 'Unable to submit your request.'), 'error');
      }
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'We are having trouble connecting.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="consultation" className="w-full py-12 sm:py-16 md:py-24 bg-surface relative z-20 pt-20 sm:pt-24 md:pt-32" aria-labelledby="consultation-form-title">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 border-b border-outline-variant pb-6 md:pb-8">
          <span className="font-label-caps text-xs text-primary tracking-widest uppercase mb-2 block font-bold">Contact Us</span>
          <h1 id="consultation-form-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">Get a Quote</h1>
          <p className="font-body-md text-xs sm:text-sm md:text-base text-main-text font-medium mt-2 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your digital presence? Fill out the form below and one of our creative directors will get back to you within 24 hours.
          </p>
        </div>

        {isRateLimited && (
          <div className="mb-8 p-4 sm:p-6 bg-surface-container-lowest border border-primary/50 text-on-surface text-sm flex items-start gap-4 shadow-lg relative border-l-4 border-l-primary rounded-xl">
            <Clock className="text-primary text-2xl mt-0.5 shrink-0" weight="bold" />
            <div className="flex-1">
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold mb-1.5 tracking-wide">2-Hour Submission Limit Active</h2>
              <p className="font-body-md text-xs sm:text-sm text-main-text leading-relaxed font-medium">
                You have already submitted a request within the last 2 hours. To ensure highest service quality, new submissions are limited.
              </p>
              <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-outline-variant text-primary text-xs font-mono font-bold tracking-wide rounded">
                <Timer className="text-sm" weight="bold" />
                <span>Next submission available in: {timeRemainingText}</span>
              </div>
            </div>
          </div>
        )}

        {submittedRefId && (
          <div className="mb-8 p-5 sm:p-6 bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-4 shadow-md relative border-l-4 border-l-green-600 rounded-xl">
            <CheckCircle className="text-green-600 text-2xl mt-0.5 shrink-0" weight="fill" />
            <div className="flex-1">
              <h2 className="font-headline-md text-base sm:text-lg text-green-900 font-bold mb-1 tracking-wide">Enquiry Successfully Received</h2>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed font-medium">
                Your confirmation has been recorded with Reference ID: <strong className="font-mono text-green-900 font-bold">{submittedRefId}</strong>. A confirmation email has been dispatched to your inbox.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full bg-surface-container-lowest p-5 sm:p-8 md:p-10 border border-outline-variant shadow-md rounded-2xl" aria-label="Full consultation form">
          {/* Honeypot field for bot protection */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website_hp_check"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <fieldset disabled={isRateLimited} className="flex flex-col gap-6 w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="first-name" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">First Name *</label>
                <input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleFirstNameBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-4 py-3 sm:py-4 rounded-lg border border-outline focus:outline-none focus:border-primary transition-all disabled:opacity-50 placeholder:text-text-light font-medium text-sm sm:text-base"
                  placeholder="Jane"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="last-name" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Last Name *</label>
                <input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleLastNameBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-4 py-3 sm:py-4 rounded-lg border border-outline focus:outline-none focus:border-primary transition-all disabled:opacity-50 placeholder:text-text-light font-medium text-sm sm:text-base"
                  placeholder="Doe"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Work Email *</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-surface text-on-surface font-body-md px-4 py-3 sm:py-4 rounded-lg border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-outline'} focus:outline-none focus:border-primary transition-all disabled:opacity-50 placeholder:text-text-light font-medium text-sm sm:text-base`}
                  placeholder="jane@company.com"
                  type="email"
                  required
                />
                {emailError && (
                  <span className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <WarningCircle className="text-sm" weight="bold" />
                    {emailError}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="company" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Company Name</label>
                <input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={handleCompanyBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-4 py-3 sm:py-4 rounded-lg border border-outline focus:outline-none focus:border-primary transition-all disabled:opacity-50 placeholder:text-text-light font-medium text-sm sm:text-base"
                  placeholder="Acme Corp"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="project-details" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Project Details *</label>
              <textarea
                id="project-details"
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="w-full bg-surface text-on-surface font-body-md px-4 py-3 sm:py-4 rounded-lg border border-outline focus:outline-none focus:border-primary transition-all min-h-[130px] sm:min-h-[150px] resize-y disabled:opacity-50 placeholder:text-text-light font-medium text-sm sm:text-base"
                placeholder="Tell us about your goals and what you're looking to achieve..."
                required
              ></textarea>
            </div>

            <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <button
                disabled={loading || isRateLimited}
                className="bg-primary text-white font-label-caps uppercase tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 hover:bg-primary-dark transition-all border border-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md rounded-lg text-xs sm:text-sm w-full sm:w-auto"
                type="submit"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Request...</span>
                  </>
                ) : isRateLimited ? (
                  <span>Rate Limited (2h)</span>
                ) : (
                  <span>Get a Quote</span>
                )}
              </button>

              <a
                href="https://wa.me/919106291540?text=Hi%20InfronixWeb!%20I'm%20on%20your%20website%20and%20would%20like%20to%20chat%20about%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest hover:bg-surface text-on-surface font-label-caps uppercase tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 transition-all border border-outline-variant flex items-center justify-center gap-2 font-bold shadow-sm cursor-pointer rounded-lg text-xs sm:text-sm w-full sm:w-auto"
              >
                <ChatCircle className="text-lg text-primary" weight="bold" />
                <span>Chat Instantly</span>
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
