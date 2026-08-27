"use client";
import { ArrowRight, Clock, WarningCircle, LockKey, Envelope } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatEmail, isValidEmail } from '@/utils/formFormatters';
import id6 from '@/assets/id-6.webp';

const RATE_LIMIT_2H_MS = 2 * 60 * 60 * 1000;

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    const lastSubTime = localStorage.getItem('infronix_last_submission_time');
    if (lastSubTime && (Date.now() - Number(lastSubTime) < RATE_LIMIT_2H_MS)) {
      setIsRateLimited(true);
    }
  }, []);

  function handleEmailBlur() {
    if (email) {
      const cleaned = formatEmail(email);
      setEmail(cleaned);
      if (!isValidEmail(cleaned)) {
        setEmailError('Please enter a valid work email (e.g. name@company.com)');
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

    const formattedEmail = formatEmail(email);
    setEmail(formattedEmail);

    if (!isValidEmail(formattedEmail)) {
      setEmailError('Please enter a valid work email address (e.g. name@company.com)');
      showToast('Please enter a valid work email address (e.g. name@company.com)', 'warning');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Quick',
          lastName: 'Inquiry',
          email: formattedEmail,
          company: 'N/A',
          projectDetails: 'Quick digital strategy consultation requested via Contact Section.'
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        localStorage.setItem('infronix_last_submission_time', Date.now().toString());
        setIsRateLimited(true);
        showToast('Thank you! Your request has been securely encrypted & submitted.', 'success');
        setEmail('');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(data.error, 'We were unable to process your request right now.');
        showToast(friendlyMsg, 'error');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'We are having trouble connecting. Please check your network connection.');
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full bg-surface relative overflow-hidden border-b border-outline-variant" aria-label="Contact Section">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">

        {/* Premium Visual Side */}
        <div className="py-8 lg:py-section-gap lg:pr-margin-desktop flex flex-col justify-center relative z-10 border-b lg:border-b-0 lg:border-r border-outline-variant">
          <div className="relative w-full aspect-square md:aspect-auto md:h-full max-h-[420px] lg:max-h-[500px] overflow-hidden rounded-[20px] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-muted to-transparent z-10 opacity-80 mix-blend-multiply"></div>
            <img
              src={id6.src || id6}
              alt="Abstract technology representation"
              className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-1000 hover:scale-105"
              width="800"
              height="800"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="bg-surface/10 backdrop-blur-md border border-champagne-light/40 p-4 sm:p-6 rounded-[14px]">
                <h3 className="font-headline-md text-xl sm:text-2xl text-champagne-light font-bold mb-2">Let&apos;s Build the Future</h3>
                <p className="font-body-md text-xs sm:text-sm text-white font-medium leading-relaxed">Our experts are ready to turn your vision into reality with cutting-edge technology and unparalleled support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Form Side */}
        <div id="contact" className="py-8 lg:py-section-gap lg:pl-margin-desktop flex flex-col justify-center relative z-10">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Get in Touch</span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-4 leading-tight">Ready to Elevate Your Brand?</h2>
          <p className="font-body-md text-xs sm:text-sm md:text-base text-on-surface-variant font-medium mb-6 max-w-md leading-relaxed">
            Schedule a complimentary digital strategy session with our technical directors to identify growth opportunities for your business.
          </p>

          {isRateLimited ? (
            <div className="p-5 sm:p-6 bg-navy-muted border border-secondary/50 text-white text-sm flex items-start gap-4 rounded-none shadow-lg relative overflow-hidden border-l-4 border-l-secondary">
              <Clock className="text-champagne-light text-2xl mt-0.5 shrink-0" weight="bold" />
              <div className="flex-1">
                <h3 className="font-label-caps uppercase tracking-widest text-xs font-bold text-champagne-light mb-1.5">2-Hour Submission Limit Active</h3>
                <p className="font-body-md text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  You have already requested a consultation within the last 2 hours. To maintain exceptional service quality, submissions are limited to once per 2 hours per client.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-champagne-light font-bold bg-ink-black/60 px-3 py-1.5 border border-secondary/30">
                  <LockKey className="text-sm" weight="bold" />
                  <span>Direct consultation limit enforced</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-margin-mobile max-w-md w-full" aria-label="Quick consultation form">
              <div className="relative group">
                <label htmlFor="corporate-email" className="sr-only">Corporate Email</label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Envelope className="text-slate-500 group-focus-within:text-secondary transition-colors" weight="bold" />
                </div>
                <input
                  id="corporate-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-surface text-on-surface font-body-md pl-[48px] pr-margin-mobile py-[16px] rounded-none border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-outline'
                    } focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-slate-600 font-medium`}
                  placeholder="Corporate Email Address"
                  type="email"
                  required
                />
              </div>
              {emailError && (
                <span className="text-xs text-red-600 font-semibold flex items-center gap-1 -mt-2">
                  <WarningCircle className="text-sm" weight="bold" />
                  {emailError}
                </span>
              )}
              <button
                disabled={loading}
                className="bg-navy-muted text-white font-label-caps uppercase tracking-widest px-margin-mobile py-[18px] rounded-none hover:bg-champagne-light hover:text-navy-muted transition-all duration-300 border border-transparent hover:border-navy-muted w-full flex justify-center items-center gap-2 group cursor-pointer disabled:opacity-50 font-bold shadow-md"
                type="submit"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <span>Schedule Consultation</span>
                    <ArrowRight className="text-[18px] transform group-hover:translate-x-1 transition-transform" weight="bold" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
