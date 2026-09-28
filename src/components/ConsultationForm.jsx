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
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);

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
        setEmailError('Please enter a valid work email (e.g. aarav@shreeindustries.in)');
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

    if (!consentGiven) {
      setConsentError(true);
      showToast('Please accept the Privacy Policy to continue.', 'warning');
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
      setEmailError('Please enter a valid work email address (e.g. aarav@shreeindustries.in)');
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

  const INPUT_CLASS = "w-full bg-surface text-on-surface font-body px-4 py-3 sm:py-3.5 rounded-xl border border-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-normal placeholder:text-text-light text-sm sm:text-base";
  const LABEL_CLASS = "font-heading uppercase tracking-wider text-on-surface font-semibold text-xs";

  return (
    <section id="consultation" className="w-full py-12 sm:py-16 md:py-24 bg-surface relative z-20 pt-20 sm:pt-24 md:pt-32" aria-labelledby="consultation-form-title">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 border-b border-outline pb-6 md:pb-8">
          <span className="font-heading text-xs text-primary tracking-widest uppercase mb-2 block font-semibold">Contact Us</span>
          <h1 id="consultation-form-title" className="font-heading text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">Get a Quote</h1>
          <p className="font-body text-xs sm:text-sm md:text-base text-main-text font-normal mt-2 max-w-2xl mx-auto leading-relaxed">
            Tell us about your website, marketing or automation needs. Our Ahmedabad-based team will review your enquiry and discuss the next steps.
          </p>
        </div>

        {isRateLimited && (
          <div className="mb-8 p-4 sm:p-6 bg-surface-container-lowest border border-primary/40 text-on-surface text-sm flex items-start gap-4 shadow-sm relative border-l-4 border-l-primary rounded-xl">
            <Clock className="text-primary text-2xl mt-0.5 shrink-0" weight="bold" />
            <div className="flex-1">
              <h2 className="font-heading text-base sm:text-lg text-on-surface font-bold mb-1.5 tracking-wide">2-Hour Submission Limit Active</h2>
              <p className="text-xs sm:text-sm text-main-text leading-relaxed font-normal">
                You have already submitted a request within the last 2 hours. To ensure highest service quality, new submissions are limited.
              </p>
              <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-outline text-primary text-xs font-mono font-bold tracking-wide rounded-lg">
                <Timer className="text-sm" weight="bold" />
                <span>Next submission available in: {timeRemainingText}</span>
              </div>
            </div>
          </div>
        )}

        {submittedRefId && (
          <div className="mb-8 p-5 sm:p-6 bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-4 shadow-sm relative border-l-4 border-l-green-600 rounded-xl">
            <CheckCircle className="text-green-600 text-2xl mt-0.5 shrink-0" weight="fill" />
            <div className="flex-1">
              <h2 className="font-heading text-base sm:text-lg text-green-900 font-bold mb-1 tracking-wide">Enquiry Successfully Received</h2>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed font-normal">
                Your confirmation has been recorded with Reference ID: <strong className="font-mono text-green-900 font-bold">{submittedRefId}</strong>. A confirmation email has been dispatched to your inbox.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full bg-surface-container-lowest p-5 sm:p-8 md:p-10 border border-outline shadow-sm rounded-2xl" aria-label="Full consultation form">
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
                <label htmlFor="first-name" className={LABEL_CLASS}>First Name *</label>
                <input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleFirstNameBlur}
                  className={INPUT_CLASS}
                  placeholder="Aarav"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="last-name" className={LABEL_CLASS}>Last Name *</label>
                <input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleLastNameBlur}
                  className={INPUT_CLASS}
                  placeholder="Mehta"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={LABEL_CLASS}>Work Email *</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-surface text-on-surface font-body px-4 py-3 sm:py-3.5 rounded-xl border ${emailError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-outline'} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 placeholder:text-text-light font-normal text-sm sm:text-base`}
                  placeholder="aarav@shreeindustries.in"
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
                <label htmlFor="company" className={LABEL_CLASS}>Company Name</label>
                <input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={handleCompanyBlur}
                  className={INPUT_CLASS}
                  placeholder="Shree Logistics Pvt Ltd"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="project-details" className={LABEL_CLASS}>Project Details *</label>
              <textarea
                id="project-details"
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="w-full bg-surface text-on-surface font-body px-4 py-3 sm:py-3.5 rounded-xl border border-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[130px] sm:min-h-[150px] resize-y disabled:opacity-50 placeholder:text-text-light font-normal text-sm sm:text-base"
                placeholder="Tell us about your goals, website requirements, and what you're looking to achieve..."
                required
              ></textarea>
            </div>

            {/* Privacy Policy Consent */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cf-consent"
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  consentError
                    ? 'border-red-400 bg-red-50'
                    : consentGiven
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline hover:border-primary/40 bg-surface'
                }`}
              >
                <input
                  id="cf-consent"
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => {
                    setConsentGiven(e.target.checked);
                    if (e.target.checked) setConsentError(false);
                  }}
                  className="accent-primary w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                  required
                />
                <span className="text-xs text-main-text leading-relaxed">
                  I agree to InfronixWeb&apos;s{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark"
                  >
                    Privacy Policy
                  </a>
                  {' '}and consent to being contacted regarding my enquiry. My data will be used solely to respond to this request and will not be shared with third parties.
                </span>
              </label>
              {consentError && (
                <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <WarningCircle size={13} weight="bold" />
                  You must accept the Privacy Policy to submit this form.
                </span>
              )}
            </div>

            <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <button
                disabled={loading || isRateLimited}
                className="bg-primary text-white font-semibold px-7 py-3.5 sm:px-8 sm:py-4 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-primary/25 rounded-xl text-xs sm:text-sm w-full sm:w-auto"
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
                className="bg-surface hover:bg-surface-container-lowest text-on-surface font-semibold px-7 py-3.5 sm:px-8 sm:py-4 transition-all border border-outline hover:border-primary/40 flex items-center justify-center gap-2 shadow-xs cursor-pointer rounded-xl text-xs sm:text-sm w-full sm:w-auto"
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
