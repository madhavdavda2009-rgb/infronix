"use client";
import { Clock, Timer, WarningCircle, ChatCircle } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';

const RATE_LIMIT_2H_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export default function ConsultationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeRemainingText, setTimeRemainingText] = useState('');
  const [emailError, setEmailError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    checkRateLimit();
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

  // Real-time blur formatters
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
      showToast('You have already submitted a consultation request within the last 2 hours.', 'warning');
      return;
    }

    // Auto-format all fields regardless of how user entered them
    const formattedFirstName = formatTitleCase(firstName);
    const formattedLastName = formatTitleCase(lastName);
    const formattedCompany = formatTitleCase(company);
    const formattedEmail = formatEmail(email);
    const formattedDetails = projectDetails.trim();

    // Update state to match clean formatting
    setFirstName(formattedFirstName);
    setLastName(formattedLastName);
    setCompany(formattedCompany);
    setEmail(formattedEmail);

    // Validate email format
    if (!isValidEmail(formattedEmail)) {
      setEmailError('Please enter a valid work email address (e.g. jane@company.com)');
      showToast('Please enter a valid work email address (e.g. jane@company.com)', 'warning');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formattedFirstName,
          lastName: formattedLastName,
          email: formattedEmail,
          company: formattedCompany,
          projectDetails: formattedDetails
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        localStorage.setItem('infronix_last_submission_time', Date.now().toString());
        setIsRateLimited(true);
        setTimeRemainingText('2h 0m');

        showToast(data.message || 'Thank you! Your request has been securely received.', 'success');

        setFirstName('');
        setLastName('');
        setEmail('');
        setCompany('');
        setProjectDetails('');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'Unable to submit your request at this time. Please check your entries and try again.');
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'We are having trouble connecting to our services. Please try again shortly.');
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="consultation" className="w-full py-16 md:py-24 bg-surface relative z-20 pt-24 md:pt-32" aria-labelledby="consultation-form-title">
      <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-8 md:mb-12 border-b border-outline-variant pb-6 md:pb-8">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Get in Touch</span>
          <h1 id="consultation-form-title" className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold">Schedule a Consultation</h1>
          <p className="font-body-md text-xs sm:text-sm md:text-base text-on-surface-variant font-medium mt-2 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your digital presence? Fill out the form below and one of our creative directors will get back to you within 24 hours.
          </p>
        </div>

        {isRateLimited && (
          <div className="mb-8 p-5 sm:p-6 bg-navy-muted border border-secondary/50 text-white text-sm flex items-start gap-4 rounded-none shadow-lg relative overflow-hidden border-l-4 border-l-secondary">
            <Clock className="text-champagne-light text-2xl mt-0.5 shrink-0" weight="bold" />
            <div className="flex-1">
              <h2 className="font-headline-md text-base sm:text-lg text-champagne-light font-bold mb-1.5 tracking-wide">2-Hour Submission Limit Active</h2>
              <p className="font-body-md text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                You have already submitted a consultation request within the last 2 hours. To ensure highest service quality, new submissions are limited to once every 2 hours per client.
              </p>
              <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-ink-black/80 border border-secondary/40 text-champagne-light text-xs font-mono font-bold tracking-wide">
                <Timer className="text-sm text-champagne-light" weight="bold" />
                <span>Next submission available in: {timeRemainingText}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full bg-surface-container-lowest p-6 sm:p-8 md:p-10 border border-outline-variant shadow-md" aria-label="Full consultation form">
          <fieldset disabled={isRateLimited} className="flex flex-col gap-margin-mobile w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-margin-mobile">
              <div className="flex flex-col gap-unit">
                <label htmlFor="first-name" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">First Name *</label>
                <input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleFirstNameBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border border-outline focus:outline-none focus:border-secondary transition-all disabled:opacity-50 placeholder:text-slate-500 font-medium"
                  placeholder="Jane"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-unit">
                <label htmlFor="last-name" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Last Name *</label>
                <input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleLastNameBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border border-outline focus:outline-none focus:border-secondary transition-all disabled:opacity-50 placeholder:text-slate-500 font-medium"
                  placeholder="Doe"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-margin-mobile">
              <div className="flex flex-col gap-unit">
                <label htmlFor="email" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Work Email *</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-outline'
                    } focus:outline-none focus:border-secondary transition-all disabled:opacity-50 placeholder:text-slate-500 font-medium`}
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
              <div className="flex flex-col gap-unit">
                <label htmlFor="company" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Company Name</label>
                <input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={handleCompanyBlur}
                  className="w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border border-outline focus:outline-none focus:border-secondary transition-all disabled:opacity-50 placeholder:text-slate-500 font-medium"
                  placeholder="Acme Corp"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-unit">
              <label htmlFor="project-details" className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Project Details *</label>
              <textarea
                id="project-details"
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border border-outline focus:outline-none focus:border-secondary transition-all min-h-[150px] resize-y disabled:opacity-50 placeholder:text-slate-500 font-medium"
                placeholder="Tell us about your goals and what you're looking to achieve..."
                required
              ></textarea>
            </div>

            <div className="mt-unit flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <button
                disabled={loading || isRateLimited}
                className="bg-navy-muted text-white font-label-caps uppercase tracking-widest px-margin-mobile py-[16px] rounded-none hover:bg-ink-black transition-all border border-navy-muted flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
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
                  <span>Submit Request</span>
                )}
              </button>

              <a
                href="https://wa.me/916355792936?text=Hi%20Infronix!%20I'm%20on%20your%20website%20and%20would%20like%20to%20chat%20about%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-champagne-light hover:bg-white text-navy-muted font-label-caps uppercase tracking-widest px-margin-mobile py-[16px] rounded-none transition-all border border-champagne-light flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
              >
                <ChatCircle className="text-lg" weight="bold" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
