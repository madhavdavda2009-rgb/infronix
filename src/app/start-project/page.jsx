"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, CheckCircle, WarningCircle, X, Star,
  Globe, MagnifyingGlass, Robot, PaperPlaneTilt, Phone,
  EnvelopeSimple, WhatsappLogo, Clock, CurrencyInr
} from "@phosphor-icons/react";
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';
import { pricingData, getServicePricing, getPackage } from '@/components/pricing/pricingData';

// Budget options mapped per service
const BUDGET_OPTIONS = {
  'web-development': ['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹40,000', '₹40,000 – ₹75,000', '₹75,000+', "I'm not sure yet"],
  'seo': ['Under ₹5,000/mo', '₹5,000 – ₹10,000/mo', '₹10,000 – ₹18,000/mo', '₹18,000+/mo', "I'm not sure yet"],
  'ai-automation': ['Under ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹50,000', '₹50,000 – ₹75,000', '₹75,000+', "I'm not sure yet"],
};
const DEFAULT_BUDGETS = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+', "I'm not sure yet"];

const TIMELINE_OPTIONS = ['As soon as possible', 'Within 1–2 weeks', 'Within 2–4 weeks', '1–2 months', 'Flexible'];

const SERVICE_ICONS = {
  'web-development': Globe,
  'seo': MagnifyingGlass,
  'ai-automation': Robot,
};

// CSS classes reused throughout — matches existing ConsultationForm & site design
const INPUT_CLASS = "w-full bg-surface text-on-surface font-body-md px-margin-mobile py-[16px] rounded-none border border-outline focus:outline-none focus:border-secondary transition-all font-medium placeholder:text-slate-500";
const LABEL_CLASS = "font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs";

export default function StartProjectPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // Pricing state
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [resolvedService, setResolvedService] = useState(null);
  const [resolvedPackage, setResolvedPackage] = useState(null);
  const [showPackagePicker, setShowPackagePicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDescription: '',
    websiteUrl: '',
    budget: '',
    timeline: '',
    additionalNotes: ''
  });

  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('infronix_project_submitted')) {
      setSuccess(true);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get('service');
      const packageId = params.get('package');

      if (serviceId && packageId) {
        const service = getServicePricing(serviceId);
        const pkg = getPackage(serviceId, packageId);

        if (service && pkg) {
          setSelectedServiceId(serviceId);
          setSelectedPackageId(packageId);
          setResolvedService(service);
          setResolvedPackage(pkg);
        }
      }
    }
    setIsChecking(false);
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

  // Package selection
  function selectService(serviceId) {
    setSelectedServiceId(serviceId);
    setSelectedPackageId('');
    setResolvedService(getServicePricing(serviceId));
    setResolvedPackage(null);
    setShowPackagePicker(true);
    setFormData(prev => ({ ...prev, budget: '' }));
  }

  function selectPackage(serviceId, packageId) {
    const service = getServicePricing(serviceId);
    const pkg = getPackage(serviceId, packageId);
    if (service && pkg) {
      setSelectedServiceId(serviceId);
      setSelectedPackageId(packageId);
      setResolvedService(service);
      setResolvedPackage(pkg);
      setShowPackagePicker(false);

      // Clean URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `/start-project?service=${serviceId}&package=${packageId}`);
      }

      // Scroll to form
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  function clearPackageSelection() {
    setSelectedServiceId('');
    setSelectedPackageId('');
    setResolvedService(null);
    setResolvedPackage(null);
    setShowPackagePicker(false);
    setFormData(prev => ({ ...prev, budget: '' }));
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/start-project');
    }
  }

  function handleChangePackage() {
    setShowPackagePicker(true);
    setSelectedPackageId('');
    setResolvedPackage(null);
  }

  // Submit
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
      // Build legacy-compatible payload
      const serviceMap = { 'web-development': 'website', 'seo': 'seo', 'ai-automation': 'automation' };
      const selectedServices = selectedServiceId ? [serviceMap[selectedServiceId] || 'custom'] : ['custom'];

      const response = await fetch('/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedServices,
          projectName: formData.companyName || formData.fullName,
          businessCategory: '',
          hasExistingWebsite: formData.websiteUrl ? 'Yes' : 'No',
          websiteUrl: formData.websiteUrl,
          projectDescription: formData.projectDescription,
          websiteType: '',
          pageRequirement: '',
          features: [],
          seoGoals: [],
          seoLocation: '',
          seoBusinessDetails: '',
          automationDescription: '',
          automationPlatforms: [],
          existingAutomationTools: '',
          budget: formData.budget,
          timeline: formData.timeline,
          fullName: formatTitleCase(fullName),
          email: formattedEmail,
          phone: formData.phone,
          companyName: formatTitleCase(formData.companyName),
          preferredContactMethod: 'Email',
          additionalNotes: formData.additionalNotes,
          serviceId: selectedServiceId,
          packageId: selectedPackageId,
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

  // Derived
  const budgetOptions = selectedServiceId ? (BUDGET_OPTIONS[selectedServiceId] || DEFAULT_BUDGETS) : DEFAULT_BUDGETS;
  const ServiceIcon = selectedServiceId ? SERVICE_ICONS[selectedServiceId] : null;

  // Loading spinner
  if (isChecking) {
    return (
      <section className="min-h-screen pt-32 pb-16 bg-surface flex items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  // Success state
  if (success) {
    return (
      <section className="min-h-screen pt-32 pb-16 bg-surface flex items-center justify-center px-4" ref={containerRef}>
        <div className="max-w-2xl mx-auto text-center fade-up">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-secondary text-4xl" weight="fill" />
          </div>
          <h1 className="font-headline-lg text-3xl md:text-5xl text-primary font-bold mb-6">Project request received.</h1>
          <p className="font-body-md text-on-surface-variant text-lg mb-10 max-w-lg mx-auto">
            Thanks for reaching out to Infronix. We&apos;ve received your project details and will review them before getting back to you within 24 hours.
          </p>
          <a href="/" className="inline-block bg-navy-muted text-white font-label-caps uppercase tracking-widest px-8 py-4 hover:bg-ink-black transition-all border border-navy-muted font-bold shadow-md">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 md:pt-32 pb-16 bg-surface" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16 fade-up">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">Start A Project</span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-4">Let&apos;s build something that matters.</h1>
          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Tell us what you need — we&apos;ll get back to you with a tailored proposal within 24 hours.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 1: PROJECT SELECTION                    */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="mb-8 fade-up">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <span className="font-label-caps text-xs text-secondary tracking-widest uppercase font-bold">01</span>
            <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Project Selection</h2>
          </div>

          {/* Selected Package Card — shown when we have a full resolution */}
          {resolvedService && resolvedPackage && !showPackagePicker && (
            <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 md:p-10 shadow-md relative overflow-hidden">
              {/* Gold accent stripe */}
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4">
                <div className="flex items-start gap-4">
                  {ServiceIcon && <ServiceIcon className="text-secondary text-3xl mt-1 shrink-0" weight="duotone" />}
                  <div>
                    <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest font-bold block">Selected Package</span>
                    <h3 className="font-headline-md text-lg md:text-xl text-primary font-bold mt-1">{resolvedPackage.name}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mt-0.5 font-medium">{resolvedService.name} • {resolvedPackage.scope}</p>
                    <div className="mt-3 inline-flex items-center gap-2">
                      <span className="font-display text-2xl text-primary font-bold">{resolvedPackage.price}</span>
                      {resolvedPackage.label === 'Starting from' && (
                        <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">starting</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleChangePackage}
                  className="self-start sm:self-center px-4 py-2 border border-secondary text-secondary text-xs font-label-caps uppercase tracking-widest hover:bg-secondary hover:text-white font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Change Package
                </button>
              </div>
            </div>
          )}

          {/* Package Picker — shown when no package is selected OR user clicked Change Package */}
          {(!resolvedPackage || showPackagePicker) && (
            <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 md:p-10 shadow-md">

              {/* Service selector */}
              <p className={`${LABEL_CLASS} mb-4`}>Select a service</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {Object.values(pricingData).map(service => {
                  const Icon = SERVICE_ICONS[service.id];
                  const isActive = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => selectService(service.id)}
                      className={`p-4 border text-left transition-all cursor-pointer group ${isActive
                        ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                        : 'border-outline hover:border-secondary/50 hover:bg-surface-container'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className={`text-2xl shrink-0 ${isActive ? 'text-secondary' : 'text-on-surface-variant group-hover:text-secondary'}`} weight="duotone" />}
                        <span className="font-headline-md text-sm text-primary font-bold">{service.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Package cards within selected service */}
              {resolvedService && (
                <div>
                  <p className={`${LABEL_CLASS} mb-4`}>Choose a package</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resolvedService.packages.map(pkg => {
                      const isSelected = selectedPackageId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => selectPackage(selectedServiceId, pkg.id)}
                          className={`p-4 md:p-5 border text-left transition-all cursor-pointer relative ${isSelected
                            ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                            : 'border-outline hover:border-secondary/50 hover:bg-surface-container'
                            }`}
                        >
                          {pkg.isRecommended && (
                            <span className="absolute top-0 right-0 bg-secondary text-white font-label-caps uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 flex items-center gap-1">
                              <Star weight="fill" className="text-[10px]" /> Best Value
                            </span>
                          )}
                          <h4 className="font-headline-md text-base text-primary font-bold">{pkg.name}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{pkg.scope}</p>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-display text-lg text-secondary font-bold">{pkg.price}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                              {pkg.label === '/month' ? '/month' : 'starting'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No service selected hint */}
              {!selectedServiceId && (
                <p className="text-sm text-on-surface-variant text-center py-4 font-medium">
                  Select a service to see available packages. Or skip this section and describe your project below.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* FORM BODY                                      */}
        {/* ═══════════════════════════════════════════════ */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8 fade-up">

          {/* Error */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 rounded-sm">
              <WarningCircle className="text-xl shrink-0 mt-0.5" weight="fill" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* ═══ SECTION 2: YOUR DETAILS ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-secondary tracking-widest uppercase font-bold">02</span>
              <h2 className="font-headline-md text-xl text-primary font-bold">Your Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          {/* ═══ SECTION 3: PROJECT DETAILS ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-secondary tracking-widest uppercase font-bold">03</span>
              <h2 className="font-headline-md text-xl text-primary font-bold">Project Details</h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="sp-description" className={LABEL_CLASS}>Tell us about your project *</label>
                <textarea
                  id="sp-description"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className={`${INPUT_CLASS} min-h-[140px] resize-y`}
                  placeholder="Describe your goals, requirements, target audience and anything else we should know about your project..."
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sp-websiteUrl" className={LABEL_CLASS}>Current Website URL <span className="text-on-surface-variant font-normal">(optional)</span></label>
                <input id="sp-websiteUrl" type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className={INPUT_CLASS} placeholder="https://www.example.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sp-notes" className={LABEL_CLASS}>Additional Notes <span className="text-on-surface-variant font-normal">(optional)</span></label>
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

          {/* ═══ SECTION 4: BUDGET & TIMELINE ═══ */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="font-label-caps text-xs text-secondary tracking-widest uppercase font-bold">04</span>
              <h2 className="font-headline-md text-xl text-primary font-bold">Budget &amp; Timeline</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Budget */}
              <div className="flex flex-col gap-3">
                <label className={LABEL_CLASS}>
                  Project Budget
                  {selectedServiceId && resolvedService && (
                    <span className="text-secondary ml-2 font-normal normal-case tracking-normal">for {resolvedService.name}</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {budgetOptions.map(bg => (
                    <label key={bg} className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${formData.budget === bg
                      ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                      : 'border-outline hover:border-secondary/50'
                      }`}>
                      <input type="radio" name="budget" value={bg} checked={formData.budget === bg} onChange={handleChange} className="accent-secondary w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-on-surface">{bg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-3">
                <label className={LABEL_CLASS}>Target Timeline</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {TIMELINE_OPTIONS.map(tm => (
                    <label key={tm} className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${formData.timeline === tm
                      ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                      : 'border-outline hover:border-secondary/50'
                      }`}>
                      <input type="radio" name="timeline" value={tm} checked={formData.timeline === tm} onChange={handleChange} className="accent-secondary w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-on-surface">{tm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ SUBMIT ═══ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 pb-8 border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant max-w-md leading-relaxed font-medium">
              Prices shown are starting prices. Final pricing depends on project scope and requirements. We&apos;ll share a detailed proposal within 24 hours.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-10 py-[16px] bg-navy-muted text-white hover:bg-ink-black font-label-caps uppercase tracking-widest text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap border border-navy-muted"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Start My Project</span>
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
