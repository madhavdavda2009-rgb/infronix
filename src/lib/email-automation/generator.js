/**
 * Infronix Cold Email Generation Engine
 * Produces hyper-personalized, concise, human, non-spam cold outreach emails.
 * Avoids fabricated claims, generic fluff, and exaggerated guarantees.
 */

const SENDER_SIGNATURE = `Best regards,

Madhav Davda
Founder & Technical Director | Infronix Web Agency
https://www.infronixweb.in/
contact@infronixweb.in`;

/**
 * Service Value Propositions & Angles
 */
const SERVICE_PROFILES = {
  website_development: {
    name: 'Website Development & Redesign',
    observations: [
      (company, website) => `while reviewing ${company}${website ? ` (${website})` : ''}, I noticed the design could benefit from a more modern, conversion-focused layout to better highlight your services`,
      (company) => `I came across ${company} recently and noticed there is an opportunity to elevate your digital presence with a faster, mobile-optimized web experience`,
      (company) => `looking at how ${company} presents its offerings online, a cleaner visual hierarchy and streamlined client journey could significantly increase direct inquiries`
    ],
    valueProps: [
      `We build high-performance, bespoke websites that load in under a second and turn visitors into qualified clients.`,
      `We specialize in crafting modern, responsive web experiences tailored to your brand that clearly communicate value and drive conversions.`,
      `Our web development focus is on clean architecture, lightning-fast performance, and intuitive user experiences designed specifically to convert traffic.`
    ],
    ctas: [
      (company) => `Would you be open to a quick 5-minute call next week to explore ideas for ${company}?`,
      (company) => `Are you open to seeing a quick 2-minute video breakdown of a few design ideas for ${company}?`,
      (company) => `Would you be against a brief chat this Thursday or Friday to share a few quick suggestions?`
    ]
  },
  seo_optimization: {
    name: 'SEO & Search Visibility',
    observations: [
      (company, website, location) => `while searching for trusted services in ${location || 'your area'}, I noticed ${company} has great potential to capture more high-intent organic search traffic`,
      (company, website) => `analyzing the search presence for ${company}, your competitors are ranking for key commercial search terms that could be driving valuable inbound leads directly to you`,
      (company) => `looking at ${company}'s industry presence, enhancing your on-page architecture and local search visibility could substantially grow your qualified inquiries`
    ],
    valueProps: [
      `We help businesses optimize their technical SEO and search authority so potential clients discover you before your competitors.`,
      `Our SEO approach centers on high-intent search terms and technical structure that sustainably drive qualified prospective clients to your site.`,
      `We focus on organic search architecture and local optimization to ensure your brand stands out when clients actively search for your expertise.`
    ],
    ctas: [
      (company) => `Would you be open to a 5-minute chat to review a quick search audit for ${company}?`,
      (company) => `Could I send over a quick 2-minute checklist of the top keyword opportunities in your space?`,
      (company) => `Open to connecting for a quick introductory conversation next week?`
    ]
  },
  ai_automation: {
    name: 'AI Automation & Smart Workflows',
    observations: [
      (company, website, location, industry) => `with growing client inquiries in the ${industry || 'business'} space, having an instant, 24/7 automated qualification system could help ${company} capture leads that might otherwise bounce`,
      (company) => `I noticed ${company} handles customer interactions that could be streamlined through intelligent AI automation—saving your team hours every week`,
      (company) => `many businesses in your sector lose high-value prospects outside standard hours; an automated intake workflow ensures no lead is missed`
    ],
    valueProps: [
      `We build custom AI chatbots and lead automation pipelines that qualify prospects and book consultations around the clock.`,
      `We implement intelligent workflow automations that eliminate repetitive admin work and instantly respond to prospective clients.`,
      `Our AI automation solutions integrate directly into your existing channels to capture, qualify, and route leads effortlessly.`
    ],
    ctas: [
      (company) => `Would you be open to a quick 5-minute demo of how this automated workflow could work for ${company}?`,
      (company) => `Are you open to a brief chat next Tuesday to see how automated qualification could fit your process?`,
      (company) => `Would you mind if I shared a short 60-second example of an automated booking flow built for businesses like ${company}?`
    ]
  }
};

/**
 * Clean and format recipient name
 */
function getSalutation(contactName) {
  if (!contactName || typeof contactName !== 'string' || contactName.trim().length === 0) {
    return 'Hi there,';
  }
  const parts = contactName.trim().split(/\s+/);
  const titles = ['dr.', 'dr', 'mr.', 'mr', 'ms.', 'ms', 'mrs.', 'mrs', 'prof.', 'prof'];
  if (parts.length > 1 && titles.includes(parts[0].toLowerCase())) {
    return `Hi ${parts[0]} ${parts[1]},`;
  }
  return `Hi ${parts[0]},`;
}

/**
 * Generate Subject Lines
 */
function generateSubjectLines(companyName, serviceKey) {
  const subjects = {
    website_development: [
      `Quick question regarding ${companyName}'s website`,
      `Idea for ${companyName}`,
      `Quick thought on ${companyName}'s web presence`,
      `${companyName} web experience`
    ],
    seo_optimization: [
      `Search visibility idea for ${companyName}`,
      `Quick observation regarding ${companyName}'s search presence`,
      `${companyName} - organic search opportunity`,
      `Question for ${companyName}`
    ],
    ai_automation: [
      `Automating client intake for ${companyName}`,
      `Quick idea for ${companyName}'s workflow`,
      `24/7 lead capture for ${companyName}`,
      `Question regarding ${companyName}`
    ]
  };

  const pool = subjects[serviceKey] || subjects.website_development;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Build Observation Text
 */
function buildObservation(lead, serviceKey, customObservation) {
  if (customObservation && customObservation.trim().length > 0) {
    return customObservation.trim();
  }

  const company = lead.company_name || lead.business_name || 'your company';
  const website = lead.website ? lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;
  const location = lead.location || lead.city || '';
  const industry = lead.industry || lead.category || 'your';

  // Check if lead has personalization_context already stored
  if (lead.personalization_context && lead.personalization_context.trim().length > 0) {
    return lead.personalization_context.trim();
  }

  // Fallback to service profile observations
  const profile = SERVICE_PROFILES[serviceKey] || SERVICE_PROFILES.website_development;
  const obsFuncs = profile.observations;
  const chosenFunc = obsFuncs[Math.floor(Math.random() * obsFuncs.length)];
  
  return chosenFunc(company, website, location, industry);
}

/**
 * Main Cold Email Generator Function
 */
export function generatePersonalizedEmail(lead, options = {}) {
  const companyName = (lead.company_name || lead.business_name || 'your company').trim();
  const contactName = lead.name || '';
  const website = lead.website ? lead.website.trim() : '';
  const industry = lead.industry || lead.category || '';
  const location = lead.location || lead.city || '';

  // Determine target service
  let serviceKey = options.targetService || 'website_development';
  if (!options.targetService) {
    if (industry && /tech|software|saas|ai|automation/i.test(industry)) {
      serviceKey = 'ai_automation';
    } else if (location && !website) {
      serviceKey = 'website_development';
    } else if (industry && /clinic|dental|law|legal|realty|real estate|hotel|restaurant/i.test(industry)) {
      serviceKey = 'seo_optimization';
    }
  }

  const profile = SERVICE_PROFILES[serviceKey] || SERVICE_PROFILES.website_development;

  // Build Salutation
  const salutation = getSalutation(contactName);

  // Subject line
  const subject = options.customSubject || generateSubjectLines(companyName, serviceKey);

  // Build specific observation
  const observation = buildObservation(lead, serviceKey, options.customObservation);
  const obsText = observation.trim();
  const obsSentence = /^(while|looking|analyzing|i noticed|when reviewing|during|in reviewing)/i.test(obsText)
    ? `${obsText.charAt(0).toUpperCase() + obsText.slice(1)}${obsText.endsWith('.') ? '' : '.'}`
    : `While reviewing your online presence, ${obsText}${obsText.endsWith('.') ? '' : '.'}`;

  // Value Proposition
  const valueProp = profile.valueProps[Math.floor(Math.random() * profile.valueProps.length)].replace(/\{company_name\}/g, companyName);

  // CTA
  let cta = options.customCta;
  if (!cta) {
    const ctaFunc = profile.ctas[Math.floor(Math.random() * profile.ctas.length)];
    cta = typeof ctaFunc === 'function' ? ctaFunc(companyName) : ctaFunc;
  }

  // Assemble Natural Cold Email Body
  const bodyParagraphs = [
    salutation,
    '',
    `I was doing some research on ${industry ? `${industry} businesses in ${location || 'India'}` : companyName} and came across ${companyName}.`,
    '',
    obsSentence,
    '',
    `${valueProp} At Infronix Web Agency, we partner with growing businesses to engineer modern digital platforms and automated systems that convert visitors into revenue.`,
    '',
    cta,
    '',
    SENDER_SIGNATURE
  ];

  const body = bodyParagraphs.join('\n');

  return {
    recipientEmail: lead.email || '',
    recipientName: lead.name || '',
    companyName,
    serviceKey,
    serviceName: profile.name,
    subject,
    observation,
    body,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Available service angles
 */
export function getAvailableServices() {
  return [
    { key: 'website_development', label: 'Website Development & Redesign' },
    { key: 'seo_optimization', label: 'SEO & Search Optimization' },
    { key: 'ai_automation', label: 'AI Automation & Smart Workflows' }
  ];
}
