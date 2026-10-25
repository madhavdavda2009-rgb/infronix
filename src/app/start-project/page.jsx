"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle, WarningCircle, Globe, MagnifyingGlass, GoogleLogo, MetaLogo,
  OpenAiLogo, ChatsCircle, Question, Minus, Plus, PencilSimple, WhatsappLogo, Phone, EnvelopeSimple, Check
} from "@phosphor-icons/react";
import { services } from '@/lib/services';
import { WEBSITE_PACKAGES, QUOTE_ADDONS, PACKAGE_PAGES, EXTRA_PAGE_PRICE, estimateWebsiteQuote, formatInr } from '@/lib/pricing';
import Breadcrumb from '@/components/Breadcrumb';
import { getFriendlyErrorMessage, parseJsonResponse } from '@/utils/errorHandler';
import { formatTitleCase, formatEmail, isValidEmail } from '@/utils/formFormatters';

const TIMELINE_OPTIONS = ['As soon as possible', 'Within 1–2 weeks', 'Within 2–4 weeks', '1–2 months', 'Flexible'];
const AD_BUDGETS = ['Under ₹15,000', '₹15,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000', 'Not decided yet'];
const CONTACT_METHODS = [
  { id: 'WhatsApp', icon: WhatsappLogo },
  { id: 'Phone call', icon: Phone },
  { id: 'Email', icon: EnvelopeSimple },
];
const SERVICE_OPTIONS = [
  { id: 'Website Development', label: 'A new website', desc: 'Business website or online store', icon: Globe },
  { id: 'SEO', label: 'Show up on Google (SEO)', desc: 'Search and Google Maps visibility', icon: MagnifyingGlass },
  { id: 'Google Ads', label: 'Google Ads', desc: 'Ads when people search for you', icon: GoogleLogo },
  { id: 'Meta Ads', label: 'Facebook & Instagram Ads', desc: 'Reach the right audience', icon: MetaLogo },
  { id: 'ChatGPT Ads', label: 'ChatGPT Ads', desc: 'Sponsored spots inside ChatGPT', icon: OpenAiLogo },
  { id: 'Social Media Marketing', label: 'Social media management', desc: 'Posts, reels and content', icon: ChatsCircle },
  { id: 'Not sure', label: "I'm not sure yet", desc: 'Help me choose the right thing', icon: Question },
];
const AD_SERVICES = ['Google Ads', 'Meta Ads', 'ChatGPT Ads', 'Social Media Marketing'];
const DRAFT_KEY = 'infronixweb_quote_draft';

const EMPTY_ANSWERS = {
  services: [],
  packageId: '',
  addons: [],
  extraPages: 0,
  adBudget: '',
  websiteUrl: '',
  noWebsite: false,
  projectDescription: '',
  timeline: '',
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  contactMethod: 'WhatsApp',
};

const INPUT_CLASS = "w-full bg-surface-container-lowest text-on-surface font-body px-5 py-4 rounded-2xl border border-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all placeholder:text-text-light text-base sm:text-lg";

function buildSteps(a) {
  const wantsWebsite = a.services.includes('Website Development');
  const wantsAds = a.services.some(s => AD_SERVICES.includes(s));
  return [
    'services',
    ...(wantsWebsite ? ['package', 'addons'] : []),
    ...(wantsAds ? ['adBudget'] : []),
    'website',
    'project',
    'timeline',
    'name',
    'company',
    'contact',
    'review',
  ];
}

function ChoiceCard({ selected, onClick, icon: Icon, label, desc, multi, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
        selected ? 'border-primary bg-primary/[0.06] ring-2 ring-primary/20' : 'border-outline bg-surface-container-lowest hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm'
      }`}
    >
      {Icon && (
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
          <Icon size={22} weight="duotone" />
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block font-heading font-bold text-base sm:text-lg text-on-surface">{label}</span>
        {desc && <span className="block text-sm text-text-light mt-0.5 leading-snug">{desc}</span>}
        {children}
      </span>
      <span className={`mt-1 w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-colors ${multi ? 'rounded-md' : 'rounded-full'} ${selected ? 'border-primary bg-primary text-white' : 'border-outline-variant'}`} aria-hidden="true">
        {selected && <Check size={12} weight="bold" />}
      </span>
    </button>
  );
}

export default function StartProjectPage() {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const stepRef = useRef(null);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const estimate = useMemo(() => estimateWebsiteQuote(answers), [answers]);

  // Restore a saved draft, then apply ?service= / ?package= from links on the site.
  useEffect(() => {
    let next = { ...EMPTY_ANSWERS };
    let savedStep = 0;
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (draft?.answers) { next = { ...next, ...draft.answers }; savedStep = draft.stepIndex || 0; }
      const savedRef = localStorage.getItem('infronixweb_project_ref');
      if (savedRef) setReferenceId(savedRef);
    } catch { /* storage unavailable */ }

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('service')?.toLowerCase();
    const pkg = params.get('package')?.toLowerCase();
    if (requested || pkg) {
      const option = SERVICE_OPTIONS.find(o => o.id.toLowerCase() === requested);
      const service = services.find(s => s.slug === requested || s.name.toLowerCase() === requested);
      const name = option?.id || (service && (service.pillar === 'Website Development' ? 'Website Development' : service.name));
      if (name && !next.services.includes(name)) next.services = [...next.services.filter(s => s !== 'Not sure'), name];
      if (WEBSITE_PACKAGES.some(p => p.id === pkg)) {
        if (!next.services.includes('Website Development')) next.services = [...next.services, 'Website Development'];
        next.packageId = pkg;
      }
      savedStep = 0;
    }
    setAnswers(next);
    setStepIndex(savedStep);
    if (typeof crypto !== 'undefined' && crypto.randomUUID) setIdempotencyKey(crypto.randomUUID());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || success) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, stepIndex })); } catch { /* ignore */ }
  }, [answers, stepIndex, hydrated, success]);

  useEffect(() => {
    if (!hydrated) return;
    const el = stepRef.current?.querySelector('input:not([type=hidden]):not([type=checkbox]), textarea');
    if (el) setTimeout(() => el.focus({ preventScroll: true }), 250);
  }, [step, hydrated]);

  const set = (patch) => { setAnswers(a => ({ ...a, ...patch })); setErrorMsg(''); };

  const validate = useCallback((id) => {
    const a = answers;
    switch (id) {
      case 'services': return a.services.length ? '' : 'Pick at least one option.';
      case 'package': return a.packageId ? '' : 'Choose a package, or pick "Not sure".';
      case 'adBudget': return a.adBudget ? '' : 'Choose a rough monthly budget.';
      case 'website': return a.noWebsite || !a.websiteUrl.trim() || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/i.test(a.websiteUrl.trim()) ? '' : 'That doesn’t look like a website address.';
      case 'project': return a.projectDescription.trim().length >= 10 ? '' : 'A line or two helps us prepare – at least a few words.';
      case 'timeline': return a.timeline ? '' : 'Choose when you’d like to start.';
      case 'name': return a.fullName.trim().length >= 2 ? '' : 'Please enter your name.';
      case 'contact':
        if (!isValidEmail(formatEmail(a.email))) return 'Please enter a valid email address.';
        if (a.phone.replace(/\D/g, '').length < 10) return 'Please enter a phone or WhatsApp number.';
        return '';
      default: return '';
    }
  }, [answers]);

  const goTo = (index) => {
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
    setErrorMsg('');
  };

  const next = () => {
    const problem = validate(step);
    if (problem) { setErrorMsg(problem); return; }
    goTo(stepIndex + 1);
  };

  // Single-choice questions move on by themselves after a short beat.
  const chooseAndAdvance = (patch) => {
    set(patch);
    setTimeout(() => { setDirection(1); setStepIndex(i => i + 1); }, 260);
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || step === 'review') return;
    if (e.target.tagName === 'TEXTAREA' && !(e.ctrlKey || e.metaKey)) return;
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    next();
  };

  const selectedPackage = WEBSITE_PACKAGES.find(p => p.id === answers.packageId);
  const addonLabels = answers.addons.map(id => QUOTE_ADDONS.find(a => a.id === id)?.label).filter(Boolean);
  const estimateText = estimate ? `${estimate.isStarting ? 'from ' : ''}${formatInr(estimate.oneTime)}${estimate.monthly ? ` + ${formatInr(estimate.monthly)}/month` : ''}` : '';

  const handleSubmit = async () => {
    if (!consentGiven) {
      setConsentError(true);
      setErrorMsg('Please accept the Privacy Policy to submit this form.');
      return;
    }
    for (const id of steps) {
      const problem = validate(id);
      if (problem) { goTo(steps.indexOf(id)); setErrorMsg(problem); return; }
    }

    const summary = [
      selectedPackage ? `Package: ${selectedPackage.name} (${formatInr(selectedPackage.price)}${selectedPackage.priceNote === 'starting' ? '+' : ''})` : answers.services.includes('Website Development') ? 'Package: Not sure – please suggest' : '',
      addonLabels.length ? `Add-ons: ${addonLabels.join(', ')}` : '',
      answers.extraPages ? `Extra pages: ${answers.extraPages}` : '',
      estimateText ? `Website estimate shown: ${estimateText}` : '',
      answers.adBudget ? `Monthly ad budget: ${answers.adBudget}` : '',
      `Preferred contact: ${answers.contactMethod}`,
    ].filter(Boolean).join('\n');

    const budget = [estimateText && `Website ${estimateText}`, answers.adBudget && `Ads ${answers.adBudget}/mo`].filter(Boolean).join('; ').slice(0, 100);

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/enquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedServices: answers.services.map(s => (s === 'Not sure' ? 'Not sure – needs guidance' : s)),
          fullName: formatTitleCase(answers.fullName),
          email: formatEmail(answers.email),
          phone: answers.phone,
          companyName: formatTitleCase(answers.companyName),
          websiteUrl: answers.noWebsite ? '' : answers.websiteUrl,
          projectDescription: answers.projectDescription,
          projectType: selectedPackage ? `${selectedPackage.name} website` : undefined,
          budget: budget || undefined,
          timeline: answers.timeline,
          preferredContactMethod: answers.contactMethod,
          additionalNotes: summary,
          formType: 'Start Project Form',
          sourcePage: '/start-project',
          idempotencyKey: idempotencyKey || undefined,
          website_hp_check: honeypot
        })
      });
      const data = await parseJsonResponse(response);
      if (response.ok && data.success) {
        const ref = data.referenceId || '';
        try {
          if (ref) localStorage.setItem('infronixweb_project_ref', ref);
          localStorage.removeItem(DRAFT_KEY);
        } catch { /* ignore */ }
        if (ref) setReferenceId(ref);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(getFriendlyErrorMessage(data.error, 'Something went wrong. Please try again.'));
      }
    } catch {
      setErrorMsg('We are having trouble connecting. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main id="main-content" className="min-h-screen pt-24 sm:pt-32 pb-16 bg-surface flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center bg-surface-container-lowest p-8 sm:p-12 rounded-3xl border border-outline shadow-xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <CheckCircle className="text-primary text-3xl sm:text-4xl" weight="fill" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl text-on-surface font-heading font-bold mb-4 sm:mb-6">Quote request received.</h1>
          {referenceId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-primary/30 rounded-xl mb-6 shadow-xs">
              <span className="text-xs uppercase font-semibold text-text-light tracking-wider">Reference ID:</span>
              <span className="text-sm font-mono font-bold text-primary">{referenceId}</span>
            </div>
          )}
          <p className="text-main-text text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
            Your project details have been received. Keep your reference ID for follow-up. If an email verification link arrives, use it to confirm your address. You can also contact support@infronixweb.in for help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a href="/" className="inline-flex items-center justify-center bg-primary text-white font-semibold px-7 py-3.5 sm:px-8 sm:py-4 hover:bg-primary-dark transition-all shadow-md rounded-xl text-xs sm:text-sm">Back to Home</a>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setAnswers(EMPTY_ANSWERS);
                setStepIndex(0);
                setConsentGiven(false);
                if (typeof crypto !== 'undefined' && crypto.randomUUID) setIdempotencyKey(crypto.randomUUID());
              }}
              className="inline-flex items-center justify-center bg-surface text-on-surface font-semibold px-7 py-3.5 sm:px-8 sm:py-4 hover:bg-surface-container-lowest border border-outline hover:border-primary/40 transition-all shadow-xs rounded-xl text-xs sm:text-sm"
            >
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const firstName = answers.fullName.trim().split(' ')[0];
  const QUESTIONS = {
    services: { title: 'What can we help you with?', hint: 'Pick everything that applies.' },
    package: { title: 'Which website package fits best?', hint: 'You can change this later – it just gives us a starting point.' },
    addons: { title: 'Anything extra you’d like?', hint: 'Optional. Skip if you’re not sure yet.' },
    adBudget: { title: 'Roughly how much would you like to spend on ads each month?', hint: 'This is your ad budget paid to Google, Meta or ChatGPT – our fee is quoted separately after a call.' },
    website: { title: 'Do you have a website right now?', hint: 'Share the link so we can take a look before we talk.' },
    project: { title: 'Tell us a little about your business.', hint: 'What do you do, and what should this project achieve? A few lines is perfect.' },
    timeline: { title: 'When would you like to start?', hint: '' },
    name: { title: 'Great! What’s your name?', hint: '' },
    company: { title: `Nice to meet you${firstName ? `, ${firstName}` : ''}. What’s your business called?`, hint: 'Optional.' },
    contact: { title: 'How can we reach you?', hint: 'We usually reply within one working day.' },
    review: { title: 'All set. Does this look right?', hint: 'Tap any line to change it.' },
  };
  const q = QUESTIONS[step];

  const reviewRows = [
    ['services', 'Services', answers.services.join(', ')],
    selectedPackage || answers.packageId === 'unsure' ? ['package', 'Package', selectedPackage ? `${selectedPackage.name} – ${formatInr(selectedPackage.price)}${selectedPackage.priceNote === 'starting' ? '+' : ''}` : 'Not sure – please suggest'] : null,
    steps.includes('addons') ? ['addons', 'Extras', [...addonLabels, answers.extraPages ? `${answers.extraPages} extra page${answers.extraPages > 1 ? 's' : ''}` : ''].filter(Boolean).join(', ') || 'None'] : null,
    answers.adBudget ? ['adBudget', 'Monthly ad budget', answers.adBudget] : null,
    ['website', 'Current website', answers.noWebsite || !answers.websiteUrl ? 'No website yet' : answers.websiteUrl],
    ['project', 'About the project', answers.projectDescription],
    ['timeline', 'Start', answers.timeline],
    ['name', 'Name', answers.fullName],
    ['company', 'Business', answers.companyName || '—'],
    ['contact', 'Contact', `${answers.email} · ${answers.phone} · prefers ${answers.contactMethod}`],
  ].filter(Boolean);

  return (
    <main id="main-content" className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-16 bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Breadcrumb className="justify-center" />

        <div className="text-center mt-2 mb-8 sm:mb-10">
          <span className="font-heading text-xs text-primary tracking-widest uppercase mb-2 block font-semibold">Get a Quote</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-on-surface font-heading font-bold">Let&apos;s plan your next step.</h1>
          {stepIndex === 0 && (
            <p className="text-main-text text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-3">
              Tell us what you need so we can discuss a practical scope and proposal. Based in Ahmedabad, Gujarat, and working with businesses across India.
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6" aria-hidden={!hydrated}>
          <div className="flex items-center justify-between text-xs font-semibold text-text-light mb-2">
            <span>Question {stepIndex + 1} of {steps.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-outline/60 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
            <motion.div className="h-full bg-primary rounded-full" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
          </div>
        </div>

        {/* Honeypot field for bot protection */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="website_hp_check" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <div className="relative bg-surface-container-lowest border border-outline rounded-3xl shadow-sm p-5 sm:p-8 md:p-10 overflow-hidden" onKeyDown={onKeyDown}>
          {/* Enter-only slide: the question is always visible even if animations are paused. */}
          <motion.div
              key={step}
              ref={stepRef}
              initial={hydrated ? { x: direction * 32 } : false}
              animate={{ x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-on-surface leading-snug" aria-live="polite">{q.title}</h2>
              {q.hint && <p className="text-sm sm:text-base text-text-light mt-2 leading-relaxed">{q.hint}</p>}

              <div className="mt-6 sm:mt-8">
                {step === 'services' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map(opt => (
                      <ChoiceCard
                        key={opt.id}
                        multi
                        icon={opt.icon}
                        label={opt.label}
                        desc={opt.desc}
                        selected={answers.services.includes(opt.id)}
                        onClick={() => {
                          setErrorMsg('');
                          setAnswers(a => {
                            const has = a.services.includes(opt.id);
                            if (opt.id === 'Not sure') return { ...a, services: has ? [] : ['Not sure'] };
                            const rest = a.services.filter(s => s !== 'Not sure' && s !== opt.id);
                            return { ...a, services: has ? rest : [...rest, opt.id] };
                          });
                        }}
                      />
                    ))}
                  </div>
                )}

                {step === 'package' && (
                  <div className="space-y-3">
                    {WEBSITE_PACKAGES.map(pkg => (
                      <ChoiceCard
                        key={pkg.id}
                        label={
                          <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <span>{pkg.name}{pkg.popular && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">Most popular</span>}</span>
                            <span className="text-primary">{pkg.priceNote === 'starting' ? 'from ' : ''}{formatInr(pkg.price)}</span>
                          </span>
                        }
                        desc={`${pkg.tagline} ${pkg.features[0]}.`}
                        selected={answers.packageId === pkg.id}
                        onClick={() => chooseAndAdvance({ packageId: pkg.id })}
                      />
                    ))}
                    <ChoiceCard icon={Question} label="Not sure – suggest the right one" selected={answers.packageId === 'unsure'} onClick={() => chooseAndAdvance({ packageId: 'unsure' })} />
                    <a href="/pricing" target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary hover:underline mt-1">Compare packages in detail ↗</a>
                  </div>
                )}

                {step === 'addons' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {QUOTE_ADDONS.map(addon => {
                        const selected = answers.addons.includes(addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setAnswers(a => ({ ...a, addons: a.addons.includes(addon.id) ? a.addons.filter(id => id !== addon.id) : [...a.addons, addon.id] }))}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${selected ? 'border-primary bg-primary/[0.06] ring-2 ring-primary/20' : 'border-outline hover:border-primary/40'}`}
                          >
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${selected ? 'border-primary bg-primary text-white' : 'border-outline-variant'}`}>{selected && <Check size={12} weight="bold" />}</span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold text-on-surface">{addon.label}</span>
                              <span className="block text-xs text-text-light">{addon.note}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {PACKAGE_PAGES[answers.packageId] && (
                      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-outline">
                        <span>
                          <span className="block text-sm font-semibold text-on-surface">Extra pages</span>
                          <span className="block text-xs text-text-light">{PACKAGE_PAGES[answers.packageId]} pages included · {formatInr(EXTRA_PAGE_PRICE)} per extra page</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <button type="button" aria-label="Remove a page" onClick={() => setAnswers(a => ({ ...a, extraPages: Math.max(0, a.extraPages - 1) }))} className="w-9 h-9 rounded-lg border border-outline flex items-center justify-center hover:border-primary/50 cursor-pointer"><Minus size={14} weight="bold" /></button>
                          <span className="w-8 text-center font-heading font-bold text-lg text-on-surface" aria-live="polite">{answers.extraPages}</span>
                          <button type="button" aria-label="Add a page" onClick={() => setAnswers(a => ({ ...a, extraPages: Math.min(40, a.extraPages + 1) }))} className="w-9 h-9 rounded-lg border border-outline flex items-center justify-center hover:border-primary/50 cursor-pointer"><Plus size={14} weight="bold" /></button>
                        </span>
                      </div>
                    )}

                    {estimate && (
                      <div className="rounded-2xl bg-primary text-white p-5 flex items-center justify-between gap-4">
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-widest text-white/70">Estimated price</span>
                          <span className="block text-[11px] text-white/70 mt-0.5">Final quote is shared in writing after a quick call.</span>
                        </span>
                        <span className="text-right">
                          <span className="block font-heading font-bold text-2xl sm:text-3xl">{estimate.isStarting ? <span className="text-sm font-semibold mr-1">from</span> : null}{formatInr(estimate.oneTime)}</span>
                          {estimate.monthly ? <span className="block text-xs text-white/80">+ {formatInr(estimate.monthly)} / month</span> : null}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {step === 'adBudget' && (
                  <div className="space-y-2.5">
                    {AD_BUDGETS.map(b => (
                      <ChoiceCard key={b} label={b} desc={b === 'Not decided yet' ? 'We’ll suggest a sensible test budget' : 'per month'} selected={answers.adBudget === b} onClick={() => chooseAndAdvance({ adBudget: b })} />
                    ))}
                  </div>
                )}

                {step === 'website' && (
                  <div className="space-y-3">
                    <input
                      type="url"
                      inputMode="url"
                      className={INPUT_CLASS}
                      placeholder="https://yourbusiness.in"
                      value={answers.websiteUrl}
                      onChange={e => set({ websiteUrl: e.target.value, noWebsite: false })}
                      aria-label="Current website address"
                    />
                    <button type="button" onClick={() => chooseAndAdvance({ noWebsite: true, websiteUrl: '' })} className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer ${answers.noWebsite ? 'border-primary bg-primary/[0.06] text-on-surface' : 'border-outline text-main-text hover:border-primary/40'}`}>
                      I don&apos;t have a website yet
                    </button>
                  </div>
                )}

                {step === 'project' && (
                  <div>
                    <textarea
                      className={`${INPUT_CLASS} min-h-[150px] resize-y leading-relaxed`}
                      placeholder="e.g. We run a dental clinic in Bopal and want more appointment enquiries from Google…"
                      value={answers.projectDescription}
                      onChange={e => set({ projectDescription: e.target.value })}
                      aria-label="About your business and project"
                      maxLength={6000}
                    />
                    <p className="text-xs text-text-light mt-2">Press Ctrl + Enter to continue.</p>
                  </div>
                )}

                {step === 'timeline' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIMELINE_OPTIONS.map(t => (
                      <ChoiceCard key={t} label={t} selected={answers.timeline === t} onClick={() => chooseAndAdvance({ timeline: t })} />
                    ))}
                  </div>
                )}

                {step === 'name' && (
                  <input type="text" autoComplete="name" className={INPUT_CLASS} placeholder="Your full name" value={answers.fullName} onChange={e => set({ fullName: e.target.value })} aria-label="Full name" />
                )}

                {step === 'company' && (
                  <input type="text" autoComplete="organization" className={INPUT_CLASS} placeholder="e.g. Shree Logistics Pvt Ltd" value={answers.companyName} onChange={e => set({ companyName: e.target.value })} aria-label="Business name" />
                )}

                {step === 'contact' && (
                  <div className="space-y-3">
                    <input type="email" autoComplete="email" className={INPUT_CLASS} placeholder="you@business.in" value={answers.email} onChange={e => set({ email: e.target.value })} aria-label="Email" />
                    <input type="tel" autoComplete="tel" inputMode="tel" className={INPUT_CLASS} placeholder="Phone / WhatsApp, e.g. +91 98250 12345" value={answers.phone} onChange={e => set({ phone: e.target.value })} aria-label="Phone or WhatsApp number" />
                    <div className="pt-2">
                      <span className="block text-sm font-semibold text-on-surface mb-2">Best way to reach you</span>
                      <div className="grid grid-cols-3 gap-2">
                        {CONTACT_METHODS.map(({ id, icon: Icon }) => (
                          <button key={id} type="button" aria-pressed={answers.contactMethod === id} onClick={() => set({ contactMethod: id })} className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${answers.contactMethod === id ? 'border-primary bg-primary/[0.06] text-primary' : 'border-outline text-main-text hover:border-primary/40'}`}>
                            <Icon size={18} weight="duotone" /> {id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'review' && (
                  <div className="space-y-5">
                    <dl className="divide-y divide-outline rounded-2xl border border-outline overflow-hidden">
                      {reviewRows.map(([id, label, value]) => (
                        <button key={id} type="button" onClick={() => goTo(steps.indexOf(id))} className="w-full text-left px-4 py-3 flex items-start gap-4 hover:bg-primary/[0.04] transition-colors cursor-pointer group">
                          <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-text-light pt-0.5">{label}</dt>
                          <dd className="flex-1 min-w-0 text-sm text-on-surface break-words line-clamp-3">{value}</dd>
                          <PencilSimple size={15} className="text-text-light group-hover:text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        </button>
                      ))}
                    </dl>
                    {estimateText && (
                      <p className="text-sm text-main-text">Estimated website price: <strong className="text-on-surface">{estimateText}</strong>. We confirm the final quote in writing.</p>
                    )}
                    <label
                      htmlFor="sp-consent"
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${consentError ? 'border-red-400 bg-red-50' : consentGiven ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline hover:border-primary/40 bg-surface'}`}
                    >
                      <input
                        id="sp-consent"
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => { setConsentGiven(e.target.checked); if (e.target.checked) { setConsentError(false); setErrorMsg(''); } }}
                        className="accent-primary w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                      />
                      <span className="text-xs text-main-text leading-relaxed">
                        I agree to InfronixWeb&apos;s{' '}
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark">Privacy Policy</a>
                        {' '}and consent to being contacted regarding this project enquiry. My data will be used solely to respond to this request and will not be shared with third parties.
                      </span>
                    </label>
                  </div>
                )}
              </div>
          </motion.div>

          {errorMsg && (
            <div role="alert" className="mt-5 p-3.5 bg-primary/10 border border-primary/30 text-on-surface text-sm flex items-start gap-2.5 rounded-xl">
              <WarningCircle className="text-lg text-primary shrink-0 mt-0.5" weight="duotone" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <button type="button" onClick={() => goTo(stepIndex - 1)} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-main-text hover:text-on-surface hover:bg-surface cursor-pointer">
                <ArrowLeft size={16} weight="bold" /> Back
              </button>
            ) : <span />}

            {step === 'review' ? (
              <button type="button" onClick={handleSubmit} disabled={loading} className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-primary text-white hover:bg-primary-dark font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-xl">
                {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>) : (<>Get a Quote <ArrowRight weight="bold" /></>)}
              </button>
            ) : (
              <button type="button" onClick={next} className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-primary text-white hover:bg-primary-dark font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:shadow-primary/25 cursor-pointer rounded-xl">
                {(step === 'addons' && !answers.addons.length && !answers.extraPages) || (step === 'company' && !answers.companyName.trim()) || (step === 'website' && !answers.websiteUrl.trim() && !answers.noWebsite) ? 'Skip' : 'Continue'}
                <ArrowRight weight="bold" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-text-light mt-5">
          Takes about a minute · Your answers are saved on this device until you submit
        </p>
      </div>
    </main>
  );
}
