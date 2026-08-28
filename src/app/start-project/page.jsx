"use client";
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowLeft, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';

const SERVICES = [
  { id: 'website', title: 'Website Development', desc: 'Modern, fast and conversion-focused websites.', price: 'From ₹7,999' },
  { id: 'seo', title: 'SEO', desc: 'Improve your search visibility and organic growth.', price: 'From ₹5,999/month' },
  { id: 'automation', title: 'AI Automation', desc: 'Automate repetitive business workflows with AI.', price: 'From ₹9,999' },
  { id: 'website_seo', title: 'Website + SEO', desc: 'Build your website and establish a strong search foundation.', price: 'From ₹12,999' },
  { id: 'website_automation', title: 'Website + Automation', desc: 'A website connected to smart business automation.', price: 'From ₹19,999' },
  { id: 'custom', title: 'Custom Project', desc: 'Have something different in mind? Let\'s discuss it.', price: 'Custom pricing' },
];

export default function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    selectedServices: [],
    projectName: '',
    businessCategory: '',
    hasExistingWebsite: '',
    websiteUrl: '',
    projectDescription: '',
    websiteType: '',
    pageRequirement: '',
    features: [],
    seoGoals: [],
    seoLocation: '',
    seoBusinessDetails: '',
    automationDescription: '',
    automationPlatforms: [],
    existingAutomationTools: '',
    budget: '',
    timeline: '',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    preferredContactMethod: 'Email',
    additionalNotes: ''
  });

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".fade-up", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  const animateStepTransition = (nextStep) => {
    gsap.to(".step-content", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        gsap.fromTo(".step-content", 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1 && formData.selectedServices.length === 0) {
      setErrorMsg('Please select at least one service to continue.');
      return;
    }
    if (step === 2) {
      if (!formData.projectName.trim() || !formData.businessCategory.trim() || !formData.hasExistingWebsite || !formData.projectDescription.trim()) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
    }
    if (step === 3 && (!formData.budget || !formData.timeline)) {
      setErrorMsg('Please select a budget and timeline.');
      return;
    }
    animateStepTransition(step + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    animateStepTransition(step - 1);
  };

  const handleServiceToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter(s => s !== id)
        : [...prev.selectedServices, id]
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    const { fullName, email, phone } = formData;
    
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name, email, and phone number.');
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
          ...formData,
          fullName: formatTitleCase(fullName),
          companyName: formatTitleCase(formData.companyName),
          email: formattedEmail,
        })
      });

      const data = await parseJsonResponse(response);

      if (response.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(getFriendlyErrorMessage(data.error, 'Something went wrong while sending your request. Please try again.'));
      }
    } catch (err) {
      setErrorMsg('Something went wrong while sending your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const needsWebsite = formData.selectedServices.some(s => s.includes('website'));
  const needsSEO = formData.selectedServices.some(s => s.includes('seo'));
  const needsAutomation = formData.selectedServices.some(s => s.includes('automation'));

  if (success) {
    return (
      <section className="min-h-screen pt-32 pb-16 bg-surface flex items-center justify-center px-4" ref={containerRef}>
        <div className="max-w-2xl mx-auto text-center fade-up">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-secondary text-4xl" weight="fill" />
          </div>
          <h1 className="font-headline-lg text-3xl md:text-5xl text-primary font-bold mb-6">Project request received.</h1>
          <p className="font-body-md text-on-surface-variant text-lg mb-10 max-w-lg mx-auto">
            Thanks for reaching out to Infronix. We've received your project details and will review them before getting back to you.
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12 fade-up">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-3 block font-bold">Start A Project</span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl text-primary font-bold mb-4">Let's build something that matters.</h1>
          <p className="font-body-md text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto">
            Tell us what you're looking to build. We'll review your requirements and get back to you with the right approach, timeline and proposal.
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-2 fade-up">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1.5 w-10 sm:w-16 rounded-full transition-colors duration-300 ${step >= s ? 'bg-secondary' : 'bg-outline-variant'}`} />
          ))}
        </div>

        <div className="bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant shadow-sm step-content fade-up relative min-h-[400px]">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 rounded-md">
              <WarningCircle className="text-xl shrink-0 mt-0.5" weight="fill" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-6">01 — What can Infronix help you with?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map((srv) => {
                  const isSelected = formData.selectedServices.includes(srv.id);
                  return (
                    <div 
                      key={srv.id} 
                      onClick={() => handleServiceToggle(srv.id)}
                      className={`cursor-pointer p-5 border transition-all duration-200 ${isSelected ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' : 'border-outline hover:border-secondary/50 hover:bg-surface-container'}`}
                    >
                      <h3 className="font-headline-md text-base text-primary font-bold mb-1">{srv.title}</h3>
                      <p className="text-sm text-on-surface-variant mb-3">{srv.desc}</p>
                      <span className="inline-block px-2 py-1 bg-surface-container text-xs font-semibold text-secondary">{srv.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-2">02 — Tell us about your project</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Project / Business Name *</label>
                  <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="Acme Corp" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Business Category *</label>
                  <input type="text" name="businessCategory" value={formData.businessCategory} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="e.g. Real Estate, SaaS, E-commerce" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Do you already have a website? *</label>
                <div className="flex flex-wrap gap-4 mt-1">
                  {['Yes', 'No', "I'm planning a new one"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="hasExistingWebsite" value={opt} checked={formData.hasExistingWebsite === opt} onChange={handleChange} className="accent-secondary w-4 h-4" />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.hasExistingWebsite === 'Yes' && (
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Current Website URL</label>
                  <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="https://www.example.com" />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">What are you looking to build or improve? *</label>
                <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary min-h-[120px]" placeholder="Tell us about your business, your goals, what you need, and any important features you'd like us to know about." />
              </div>

              {needsWebsite && (
                <div className="mt-6 border-t border-outline-variant pt-6 flex flex-col gap-6">
                  <h3 className="font-headline-md text-lg text-primary font-bold">Website Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Website Type</label>
                      <select name="websiteType" value={formData.websiteType} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary">
                        <option value="">Select type...</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="Business Website">Business Website</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Agency Website">Agency Website</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Approximate Pages</label>
                      <select name="pageRequirement" value={formData.pageRequirement} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary">
                        <option value="">Select pages...</option>
                        <option value="1 Page">1 Page</option>
                        <option value="3–5 Pages">3–5 Pages</option>
                        <option value="6–10 Pages">6–10 Pages</option>
                        <option value="10+ Pages">10+ Pages</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Features Needed</label>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                      {['Contact Form', 'CMS', 'Authentication', 'Dashboard', 'Database', 'Payment Integration', 'API Integration', 'Blog', 'Booking System', 'AI Chatbot', 'Other'].map(feat => (
                        <label key={feat} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.features.includes(feat)} onChange={() => handleArrayToggle('features', feat)} className="accent-secondary w-4 h-4" />
                          <span className="text-sm font-medium">{feat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {needsSEO && (
                <div className="mt-6 border-t border-outline-variant pt-6 flex flex-col gap-6">
                  <h3 className="font-headline-md text-lg text-primary font-bold">SEO Requirements</h3>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">What are you trying to achieve with SEO?</label>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                      {['Local visibility', 'More website traffic', 'More leads', 'Better Google rankings', 'Technical SEO', 'Not sure'].map(goal => (
                        <label key={goal} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.seoGoals.includes(goal)} onChange={() => handleArrayToggle('seoGoals', goal)} className="accent-secondary w-4 h-4" />
                          <span className="text-sm font-medium">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Target Location</label>
                      <input type="text" name="seoLocation" value={formData.seoLocation} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="e.g. Mumbai, India, or Global" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Current SEO situation</label>
                      <input type="text" name="seoBusinessDetails" value={formData.seoBusinessDetails} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="Optional notes" />
                    </div>
                  </div>
                </div>
              )}

              {needsAutomation && (
                <div className="mt-6 border-t border-outline-variant pt-6 flex flex-col gap-6">
                  <h3 className="font-headline-md text-lg text-primary font-bold">AI & Automation Requirements</h3>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">What would you like to automate?</label>
                    <textarea name="automationDescription" value={formData.automationDescription} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary min-h-[80px]" placeholder="For example: lead collection, WhatsApp enquiries, customer support, email follow-ups..." />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Where does the automation need to work?</label>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                      {['Website', 'WhatsApp', 'Email', 'Google Sheets', 'CRM', 'Database', 'Slack', 'Telegram', 'Other'].map(plat => (
                        <label key={plat} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.automationPlatforms.includes(plat)} onChange={() => handleArrayToggle('automationPlatforms', plat)} className="accent-secondary w-4 h-4" />
                          <span className="text-sm font-medium">{plat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Do you currently use any automation tools?</label>
                    <select name="existingAutomationTools" value={formData.existingAutomationTools} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary">
                      <option value="">Select...</option>
                      <option value="No">No</option>
                      <option value="n8n">n8n</option>
                      <option value="Zapier">Zapier</option>
                      <option value="Make">Make</option>
                      <option value="Other">Other</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-2">03 — Let's understand your project range</h2>
              
              <div className="flex flex-col gap-3">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs mb-1">Project Budget *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹40,000', '₹40,000 – ₹75,000', '₹75,000+', 'I\'m not sure yet'].map(bg => (
                    <label key={bg} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.budget === bg ? 'border-secondary bg-secondary/5' : 'border-outline hover:border-secondary/50'}`}>
                      <input type="radio" name="budget" value={bg} checked={formData.budget === bg} onChange={handleChange} className="accent-secondary w-4 h-4" />
                      <span className="text-sm font-bold">{bg}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs mb-1">Target Timeline *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['As soon as possible', 'Within 1–2 weeks', 'Within 2–4 weeks', '1–2 months', 'Flexible'].map(tm => (
                    <label key={tm} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.timeline === tm ? 'border-secondary bg-secondary/5' : 'border-outline hover:border-secondary/50'}`}>
                      <input type="radio" name="timeline" value={tm} checked={formData.timeline === tm} onChange={handleChange} className="accent-secondary w-4 h-4" />
                      <span className="text-sm font-bold">{tm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-2">04 — Where can we reach you?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="Jane Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="Acme Corp" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="jane@company.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Phone / WhatsApp *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Preferred Contact Method</label>
                <div className="flex flex-wrap gap-6 mt-1">
                  {['Email', 'WhatsApp', 'Phone Call'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="preferredContactMethod" value={opt} checked={formData.preferredContactMethod === opt} onChange={handleChange} className="accent-secondary w-4 h-4" />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="font-label-caps uppercase tracking-widest text-on-surface font-bold text-xs">Anything else you'd like us to know?</label>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} className="w-full bg-surface text-on-surface font-body-md px-4 py-3 border border-outline focus:outline-none focus:border-secondary min-h-[80px]" placeholder="Optional notes" />
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-2">05 — Review</h2>
              
              <div className="bg-surface p-6 border border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-1 font-bold">Services</h3>
                  <p className="font-medium text-sm">{formData.selectedServices.map(id => SERVICES.find(s => s.id === id)?.title).join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-1 font-bold">Project / Budget</h3>
                  <p className="font-medium text-sm">{formData.projectName}</p>
                  <p className="font-medium text-sm text-on-surface-variant mt-1">{formData.budget} • {formData.timeline}</p>
                </div>
                {needsWebsite && formData.websiteType && (
                  <div className="md:col-span-2">
                    <h3 className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-1 font-bold">Website</h3>
                    <p className="font-medium text-sm">{formData.websiteType} • {formData.pageRequirement}</p>
                    {formData.features.length > 0 && <p className="font-medium text-sm text-on-surface-variant mt-1">Features: {formData.features.join(', ')}</p>}
                  </div>
                )}
                <div className="md:col-span-2">
                  <h3 className="font-label-caps text-xs text-secondary tracking-widest uppercase mb-1 font-bold">Contact</h3>
                  <p className="font-medium text-sm">{formData.fullName} {formData.companyName ? `(${formData.companyName})` : ''}</p>
                  <p className="font-medium text-sm text-on-surface-variant mt-1">{formData.email} • {formData.phone}</p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant mt-2">
                * Prices shown are starting prices. Final pricing depends on project requirements, scope and integrations.
                Project scope and included revisions will be clearly defined in the final proposal. Domain and third-party infrastructure costs may be billed separately depending on the project.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 pt-6 border-t border-outline-variant flex justify-between items-center">
            {step > 1 ? (
              <button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 border border-outline hover:bg-surface-container font-label-caps uppercase tracking-widest text-xs font-bold transition-colors">
                <ArrowLeft weight="bold" /> Back
              </button>
            ) : <div></div>}

            {step < 5 ? (
              <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 bg-navy-muted text-white hover:bg-ink-black font-label-caps uppercase tracking-widest text-xs font-bold transition-colors shadow-md">
                Next Step <ArrowRight weight="bold" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-4 bg-navy-muted text-white hover:bg-ink-black font-label-caps uppercase tracking-widest text-sm font-bold transition-colors shadow-md disabled:opacity-50">
                {loading ? 'Sending Request...' : 'Start My Project'} <ArrowRight weight="bold" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
