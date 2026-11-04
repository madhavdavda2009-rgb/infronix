// Scripted answers for the website chat assistant. No AI service is called:
// each visitor message is matched to a topic by keywords (English, Hinglish and Gujarati in Latin script).
//
// Rules for answers:
// - Business facts (prices, packages, process, policies) must already be published on the website:
//   pricing page, FAQ, service pages, About, Contact, Terms. Prices are read from lib/pricing.js.
// - When the website does not state a fact (refund terms, GST, payment methods, company history…),
//   the answer says the team will confirm and offers WhatsApp / call. Never invent it.
// - General explanations (what is SEO, hosting, CPC…) are plain-language definitions.
//
// To add an answer: add a topic { id, k: [keywords], a: 'answer' }. Longer, more specific
// keyword phrases win over single words. Run the test questions after editing.
import { WEBSITE_PACKAGES, PRICING_ADDONS, PAYMENT_TERMS, formatInr } from '@/lib/pricing';

const PHONE_1 = '+91 6355 792 936';
const PHONE_2 = '+91 91062 91540';
const EMAIL = 'support@infronixweb.in';
const WHATSAPP = 'https://wa.me/919106291540';
const HOURS = 'Monday to Saturday, 9:00 AM to 8:00 PM';
const ADDRESS = 'Shree Eklingji Residency 2, Sanand, Ahmedabad 382110, Gujarat';

const [STARTER, BUSINESS, PREMIUM] = WEBSITE_PACKAGES;
const addon = (name) => PRICING_ADDONS.find((a) => a.name.startsWith(name))?.price || '';
const payTerms = PAYMENT_TERMS.map((t) => `${t.label} ${t.text.toLowerCase()}`).join(', ');

// Links shown as buttons under an answer.
const L = {
  quote: { label: 'Get a Quote', href: '/start-project' },
  pricing: { label: 'See pricing', href: '/pricing' },
  whatsapp: { label: 'WhatsApp', href: WHATSAPP },
  call: { label: 'Call now', href: 'tel:+916355792936' },
  email: { label: 'Email us', href: `mailto:${EMAIL}` },
  web: { label: 'Website Development', href: '/web-development' },
  ecom: { label: 'E-commerce websites', href: '/web-development/ecommerce-website-development-ahmedabad' },
  seo: { label: 'SEO services', href: '/seo' },
  localSeo: { label: 'Local SEO', href: '/seo/local-seo-services-ahmedabad' },
  dm: { label: 'Digital Marketing', href: '/digital-marketing' },
  smm: { label: 'Social Media Marketing', href: '/digital-marketing/social-media-marketing' },
  gads: { label: 'Google Ads', href: '/google-ads' },
  meta: { label: 'Meta Ads', href: '/meta-ads' },
  chatgpt: { label: 'ChatGPT Ads', href: '/chatgpt-ads' },
  perf: { label: 'Performance Marketing', href: '/performance-marketing' },
  projects: { label: 'Our Work', href: '/projects' },
  about: { label: 'About us', href: '/about' },
  contact: { label: 'Contact page', href: '/contact' },
  services: { label: 'All services', href: '/services' },
  mfg: { label: 'For manufacturers', href: '/digital-marketing-for-manufacturers' },
  terms: { label: 'Terms', href: '/terms-and-conditions' },
  areas: { label: 'Areas we serve', href: '/digital-marketing-agency' },
};

// Answer used when a fact is not published on the website.
const ASK_TEAM = 'Our team will confirm this for you directly. Message us on WhatsApp or call during working hours.';
const TEAM_LINKS = [L.whatsapp, L.call];

const C = {
  start: ['What services do you offer?', 'Website pricing', 'Help me choose', 'Contact the team'],
  web: ['Website pricing', 'How long does a website take?', 'Get a Quote'],
  seo: ['How long does SEO take?', 'Local SEO', 'Get a Quote'],
  ads: ['Ad budget', 'Do you guarantee leads?', 'Get a Quote'],
  money: ['Payment terms', 'What is not included?', 'Get a Quote'],
  team: ['Contact the team', 'Help me choose'],
};

export const BOT_NAME = 'Niya';

export const WELCOME = {
  text: "Hi, I'm Niya! Ask me anything about websites, SEO, social media, ads, pricing or how we work. You can type in English, Hinglish or Gujarati.",
  chips: C.start,
};

const TOPICS = [
  // ───────────────────────── Assistant itself ─────────────────────────
  { id: 'bot', k: ['are you a robot', 'are you a bot', 'robot', 'chatbot are you', 'talking to a human', 'am i talking', 'are you human', 'is this chatgpt', 'are you chatgpt', 'are you ai', 'your name', 'who are you', 'niya', 'who is niya', 'naam kya', 'tamaru naam', 'kaun ho', 'tame kon'],
    a: "I'm Niya, InfronixWeb's automated assistant. I'm not a person and not ChatGPT. I answer common questions instantly. For anything specific, a real person from our team is available on WhatsApp or by phone.",
    links: TEAM_LINKS, chips: C.start },
  { id: 'bot-hours', k: ['24 7', '24x7', 'available 24', 'all the time', 'available always', 'night', 'raat'],
    a: `I'm available any time. Our team works ${HOURS}; messages sent outside those hours are answered on the next working day.`,
    links: TEAM_LINKS },
  { id: 'real-person', k: ['real person', 'speak to a person', 'talk to a human', 'talk to someone', 'human agent', 'insaan', 'manas sathe'],
    a: `Of course. Message the team on WhatsApp or call ${PHONE_1} (${HOURS}).`, links: [L.whatsapp, L.call, L.email] },
  { id: 'language', k: ['gujarati', 'hindi', 'speak gujarati', 'speak hindi', 'gujarati ma vaat', 'gujarati ma', 'hindi mein', 'language', 'bhasha'],
    a: 'I understand common Hindi and Gujarati words typed in English letters, and I reply in English. To talk in Gujarati or Hindi, message the team on WhatsApp in the language you are comfortable with. Content language for your website or social media is agreed in your plan.',
    links: [L.whatsapp] },
  { id: 'eli5', k: ['explain like', 'like im five', 'simple language', 'simple words', 'without technical', 'non technical', 'dont understand technology', 'not technical', 'samaj nahi', 'samajh nahi', 'easy language', 'saral'],
    a: "No problem, here it is simply:\n• Website: your shop on the internet, open 24 hours.\n• SEO: helps people find that shop on Google without paying for each visit.\n• Google / Meta Ads: paid posters that show your business to people right now.\n• Social media: keeps your business visible and trusted on Instagram and Facebook.\nWe handle the technical work and explain every step in plain words.",
    chips: ['Help me choose', 'Website pricing'] },

  // ───────────────────────── Lead flow trigger ─────────────────────────
  { id: 'guide', action: 'lead', w: 1.5,
    k: ['help me choose', 'guide me', 'no idea what i need', 'suggest', 'su suggest', 'what should i do', 'kya karu', 'shu karu', 'recommend', 'where do i start', 'where to start', 'start a project', 'how do i start', 'how to start', 'get started', 'review my requirements', 'build my entire business', 'sales down', 'sales nahi', 'more customers', 'more leads', 'grow my business', 'business badhana', 'customers chahiye', 'grahak'],
    a: "Let's find the right plan for you. I'll ask a few quick questions (about a minute). You can type 'cancel' any time." },

  // ───────────────────────── Agency ─────────────────────────
  { id: 'about', k: ['what is infronixweb', 'about infronixweb', 'infronixweb do', 'what does infronixweb', 'who is infronixweb', 'tell me about', 'about your agency', 'about your company', 'what do you do'],
    a: 'InfronixWeb is an agency in Ahmedabad, Gujarat that helps businesses get found and contacted online: we build websites, run digital marketing (social media, Google Ads, Meta Ads) and improve SEO, all under one accountable team.',
    links: [L.about, L.services], chips: C.start },
  { id: 'name-meaning', k: ['infronixweb mean', 'does infronixweb mean', 'meaning of infronixweb', 'name mean', 'why the name', 'naam ka matlab'],
    a: "That's a story our founders love to tell! Ask them on WhatsApp. In short, InfronixWeb is our brand for website development, digital marketing and SEO.", links: [L.whatsapp] },
  { id: 'services', k: ['services', 'what services', 'service list', 'what do you offer', 'kya karte', 'shu karo cho', 'kaam karte', 'kya kya'],
    a: 'We offer three main services:\n• Website Development: business websites, online stores, landing pages and redesigns.\n• Digital Marketing: social media, Google Ads, Meta Ads, ChatGPT Ads and performance marketing.\n• SEO: website health, useful content, local search and Google Business Profile.',
    links: [L.services, L.pricing], chips: ['Website pricing', 'SEO', 'Digital marketing'] },
  { id: 'dm', w: 0.9, k: ['digital marketing', 'online marketing', 'social media and ads', 'social media or ads', 'marketing services', 'marketing karo', 'marketing karvu'],
    a: 'Our digital marketing covers social media (Instagram, Facebook, LinkedIn), Google Ads, Meta Ads, ChatGPT Ads and performance marketing. We plan the content or campaigns, the landing page and the tracking together, and report on real enquiries. It is quoted after a free call.',
    links: [L.dm, L.smm, L.gads, L.meta], chips: ['Social media cost', 'Ad budget', 'Get a Quote'] },
  { id: 'stuck', w: 1.3, k: ['stuck', 'cant find', 'cannot find', 'can not find', 'not able to', 'unable to', 'page not loading', 'form not working', 'not submitting', 'form submit', 'submit nahi', 'nahi ho raha', 'not opening', 'khulta nahi', 'button not working', 'link not working', 'error on', 'confused', 'need help', 'samajh nahi aa raha', 'kuch samaj', 'something is not working', 'site not working'],
    a: "Sorry about that! Tell me what you were trying to do and I'll point you the right way. You can also reach the team directly and they'll sort it out.",
    links: [L.whatsapp, L.call, L.quote], chips: ['Get a Quote', 'Website pricing', 'Talk to the team'] },
  { id: 'freelancer', k: ['freelancer', 'company or', 'agency or', 'are you a company', 'individual'],
    a: 'We are an agency with a team: Madhav Davda (Founder), Kunj Shah (Co-Founder) and Dhara Nagar (Marketing). You work directly with the people planning and building your project, without the gaps of managing several separate freelancers.',
    links: [L.about] },
  { id: 'founder', k: ['founder', 'founded', 'owner', 'ceo', 'who started', 'madhav', 'kunj', 'malik'],
    a: 'InfronixWeb was founded by Madhav Davda (Founder), with Kunj Shah as Co-Founder and Head of Business Development. You can talk to them directly on WhatsApp or by phone.',
    links: [L.about, L.whatsapp, L.call] },
  { id: 'team', k: ['team', 'how big', 'team size', 'how many people', 'who will handle', 'who will work', 'who handles', 'project manager', 'who will do'],
    a: 'Our public team is Madhav Davda (Founder), Kunj Shah (Co-Founder) and Dhara Nagar (Marketing). You work directly with the people planning, designing and building your project, not through layers of account managers.',
    links: [L.about] },
  { id: 'company-details', k: ['how old', 'since when', 'established', 'registered', 'registration', 'legal entity', 'gst number', 'company registered', 'experience', 'kitne saal', 'ketla varsh'],
    a: `Company details like registration and history aren't listed on the website yet. ${ASK_TEAM}`, links: TEAM_LINKS },
  { id: 'location', k: ['where', 'located', 'location', 'address', 'office', 'kaha', 'kahan', 'kya che', 'kya chhe', 'ahmedabad ma', 'ahmedabad mein', 'sanand'],
    a: `Our office is at ${ADDRESS}. We work ${HOURS}, with a remote-first workflow for clients across Gujarat and India.`,
    links: [L.contact, { label: 'Directions', href: 'https://www.google.com/maps/search/?api=1&query=Shree+Eklingji+Residency+2,+Sanand,+Ahmedabad+382110' }] },
  { id: 'areas', k: ['only in ahmedabad', 'only ahmedabad', 'across india', 'all over india', 'other cities', 'which cities', 'outside ahmedabad', 'gujarat', 'nationwide', 'surat', 'vadodara', 'rajkot', 'mumbai', 'delhi', 'pune', 'bangalore'],
    a: 'InfronixWeb is headquartered in Ahmedabad, Gujarat. We collaborate directly with businesses locally across Gujarat and remotely with companies nationwide.',
    links: [L.areas] },
  { id: 'international', k: ['international', 'abroad', 'outside india', 'foreign', 'overseas', 'usa', 'canada', 'dubai', 'uae', 'australia', 'uk client'],
    a: `Our website mentions clients across Gujarat and India. For a project outside India, ${ASK_TEAM.toLowerCase()}`, links: TEAM_LINKS },
  { id: 'visit', k: ['visit your office', 'visit office', 'meet in person', 'meet you', 'come to office', 'office aavu', 'milna', 'mil sakte', 'malva'],
    a: `Our office is at ${ADDRESS}. Please book a time with the team on WhatsApp or by phone before visiting so the right person is available.`,
    links: [L.whatsapp, L.call] },
  { id: 'video-call', k: ['video meeting', 'video call', 'zoom', 'google meet', 'online meeting', 'meeting', 'call me', 'call you', 'phone call', 'requirements over a call', 'explain on call'],
    a: `Yes, you can discuss your requirements on a call. Call ${PHONE_1} or ${PHONE_2}, or ask on WhatsApp to arrange a call or video meeting at a convenient time (${HOURS}).`,
    links: [L.call, L.whatsapp] },
  { id: 'free-consult', k: ['free consultation', 'consultation', 'free call', 'free discussion', 'free advice', 'free initial', 'quotation free', 'quote free', 'free quote'],
    a: 'You can start with a free call: digital marketing and SEO are quoted after a free call, and website quotes are shared in writing before any work begins.',
    links: [L.quote, L.whatsapp] },
  { id: 'new-business', k: ['new business', 'starting a business', 'starting a new', 'new brand', 'newly launched', 'just started', 'startup', 'start up', 'no online presence', 'nothing online', 'naya business', 'navo business'],
    a: 'Welcome! For a new business, the website and Google Business Profile usually come first, because SEO and ads both send people there. Our Starter website begins at ' + formatInr(STARTER.price) + ' and includes a contact form, WhatsApp button, Google Map and basic SEO setup.',
    links: [L.pricing], chips: ['Help me choose', 'Website pricing'] },
  { id: 'existing-business', k: ['already running', 'existing business', 'established business', 'running business', 'already have a business', 'business chal raha'],
    a: 'We start by reviewing what you already have (website, Google listing, social media and ads) and suggest where to begin. We can scope one service or coordinate related work.',
    chips: ['Help me choose', 'Contact the team'] },
  { id: 'why-us', w: 1.2, k: ['why should i choose', 'why choose', 'why infronixweb', 'different from other', 'better than other', 'what makes you different', 'why you', 'why should i trust', 'trust your agency', 'genuine', 'fake agency', 'scam', 'bharosa', 'vishwas'],
    a: `Good question. Here is what you can check:\n• A real office: ${ADDRESS}.\n• A named team you talk to directly.\n• Published prices, with a written quote before any work.\n• One accountable team for website, marketing and SEO.\n• Honest reporting: we don't promise rankings or leads we can't control.`,
    links: [L.about, L.projects, L.pricing] },
  { id: 'portfolio', k: ['portfolio', 'previous clients', 'past clients', 'your clients', 'previous work', 'your work', 'samples', 'examples of', 'case study', 'real client', 'client projects', 'projects you', 'worked with', 'kaam dikhao'],
    a: 'You can see our work on the Our Work page, including the Toyon Industry product website: an interactive product site with collection browsing and business enquiries.',
    links: [L.projects] },
  { id: 'reference', k: ['existing client', 'talk to a client', 'reference', 'speak to a client', 'contact your client'],
    a: `Ask the team on WhatsApp which client references are available for your type of project. ${'You can also see our published projects and Google review.'}`,
    links: [L.whatsapp, L.projects] },
  { id: 'reviews-agency', k: ['google reviews', 'your reviews', 'testimonials', 'client testimonials', 'ratings', 'rating'],
    a: 'Yes, you can read our client reviews on the homepage, including our Google review.',
    links: [{ label: 'Client reviews', href: '/#reviews' }] },
  { id: 'before-after', k: ['before and after', 'before after', 'results of clients', 'proof of results', 'case results'],
    a: `We only share results that clients have agreed to publish. ${ASK_TEAM}`, links: [L.whatsapp, L.projects] },
  { id: 'industry-experience', k: ['my industry', 'worked in', 'have you worked', 'experience in', 'startups', 'worked with startups'],
    a: 'We work with small and local businesses, startups, product and service businesses, personal brands, e-commerce and manufacturers. Tell us your industry and we\'ll share relevant work.',
    links: [L.projects, L.whatsapp] },
  { id: 'business-size', k: ['small business', 'small businesses', 'small shop', 'large company', 'large companies', 'big company', 'big companies', 'enterprise', 'corporate', 'all sizes', 'chhota business', 'nano business'],
    a: 'Yes. We work with businesses of all sizes: small and local businesses, startups, growing companies, e-commerce businesses and manufacturers. Each proposal is scoped to your needs.',
    chips: ['Website pricing', 'Help me choose'] },
  { id: 'one-service', k: ['one small task', 'small task', 'just one', 'one service', 'only one service', 'single service', 'one campaign', 'one task', 'purchase only', 'only seo', 'only website', 'only ads', 'start small'],
    a: 'Yes. Start with a website, a search visibility review, an advertising campaign or a digital marketing plan. We agree the work around your current priority.',
    chips: ['Get a Quote', 'Contact the team'] },
  { id: 'combine', k: ['combine', 'together', 'package of', 'website and seo', 'social media and meta', 'all services', 'everything together', 'bundle', 'entire business', 'complete package'],
    a: 'Yes. You can scope one service or combine related work, like a website with SEO, or social media with Meta Ads. One team handles it, so the website, marketing and follow-up work together.',
    links: [L.quote] },
  { id: 'existing-team', k: ['existing developer', 'my developer', 'marketing team', 'my team', 'in house', 'inhouse', 'work with my'],
    a: 'Yes. We review the tools and people you already work with and agree who does what. Your accounts and information remain under your control.' },

  // ───────────────────────── Website basics ─────────────────────────
  { id: 'want-website', w: 1.2, k: ['website chahiye', 'website banani', 'website banana', 'website banwani', 'website banvani', 'website banavvi', 'website banavi', 'website banavvani', 'banavi aapsho', 'website bana', 'need a website', 'want a website', 'i want website', 'new website'],
    a: `Great! Our website packages:\n• ${STARTER.name}: ${formatInr(STARTER.price)} (up to 5 pages, delivered in 7–10 working days)\n• ${BUSINESS.name}: ${formatInr(BUSINESS.price)} (up to 10 pages, blog, custom design, 2–3 weeks)\n• ${PREMIUM.name}: from ${formatInr(PREMIUM.price)} (online store / fully custom)\nTell me a little about your business and I'll suggest the right one.`,
    links: [L.pricing], chips: ['Help me choose', 'What is not included?', 'Get a Quote'] },
  { id: 'what-website', k: ['what is a website', 'what is website', 'website kya', 'website shu'],
    a: 'A website is your business\'s own page on the internet: people can open it from Google, WhatsApp or Instagram to see what you do, check your work and contact you, 24 hours a day.', chips: C.web },
  { id: 'why-website', k: ['why does my business need', 'need a website', 'website necessary', 'really necessary', 'why website', 'website increase', 'increase my sales', 'is a website', 'already have instagram', 'have instagram', 'isnt that enough', 'profile isnt that enough', 'is that enough', 'business profile enough', 'website kyu', 'website ki jarur', 'jaroor'],
    a: 'Instagram and Google listings are great, but you don\'t own them and they show limited information. A website is yours: it answers customers\' questions, shows your services and work, builds trust, and turns visitors into enquiries through forms, WhatsApp and call buttons. It also gives SEO and ads a place to send people. A website alone doesn\'t guarantee sales, but it makes your business much easier to choose.',
    chips: C.web },
  { id: 'found-on-google', k: ['find my website on google', 'found on google', 'people find', 'show on google', 'appear on google', 'google pe naam', 'google pe mera', 'google ma business', 'google ma', 'google par'],
    a: 'Yes. Every website package includes basic SEO setup (titles, meta descriptions, sitemap and Google Search Console) so Google can find your pages. To rank for competitive searches, ongoing SEO and a Google Business Profile help most.',
    links: [L.seo, L.localSeo], chips: C.seo },
  { id: 'availability', k: ['without the internet', 'without internet', 'need electricity', 'electricity', 'midnight', 'another country', 'other country', 'open it at', 'work on mobile', 'on mobile', 'iphone', 'android', 'tablet', 'laptop', 'mobile friendly', 'mobile responsive', 'responsiveness'],
    a: 'Your website runs on an online server, so customers can open it any time, day or night, from any country, on iPhone, Android, tablet or computer. They just need internet, and you don\'t need to keep anything switched on. All our packages are mobile-friendly.' },
  { id: 'share-link', k: ['link on whatsapp', 'send my website link', 'link in my instagram bio', 'website link', 'qr code', 'business card', 'share the link', 'share link', 'link kaise', 'website ka link'],
    a: 'Yes. Once your website is live, its address (for example yourbusiness.com) is the link: share it on WhatsApp, put it in your Instagram bio, print it as a QR code on business cards, or add it to your Google Business Profile.' },
  { id: 'design-custom', k: ['change my websites color', 'color', 'colour', 'my photo', 'put videos', 'videos on my website', 'animation', 'animations', 'brand colors', 'brand colours', 'like apple', 'premium look', 'design my'],
    a: `Yes. Your website is designed around your brand: your colours, photos, videos and smooth animations where they help. The Business package includes a custom design for your brand, and Premium is fully custom. Colours and content can be updated later too.`,
    chips: C.web },
  { id: 'copy-design', k: ['copy another', 'copy a website', 'copy website', 'clone', 'exactly like', 'copy design'],
    a: 'We don\'t copy another company\'s website, design or branding; that would violate their rights. You can share reference websites you like, and we\'ll design something original in a similar style for your brand.' },
  { id: 'marketplace', k: ['like amazon', 'like flipkart', 'marketplace', 'multi vendor', 'multivendor'],
    a: `A full marketplace like Amazon is a large custom project. Most businesses need an online store for their own products, and our Premium / E-commerce package starts at ${formatInr(PREMIUM.price)}. A big marketplace would be scoped and quoted separately.`,
    links: [L.ecom, L.quote] },
  { id: 'diy', k: ['without coding', 'build my own', 'build it myself', 'make it myself', 'do it myself', 'wix', 'ai website builder', 'ai builder', 'ai build', 'website for free', 'free website', 'use shopify myself', 'diy'],
    a: 'You can use a builder like Wix, Shopify or an AI tool yourself, and for some it is enough. What we add: planning pages around your customers, a design that builds trust, fast loading, working enquiry forms, SEO setup, and someone to fix things later. We also train you to manage your website.',
    links: [L.pricing] },
  { id: 'landing-page', k: ['landing page', 'landing pages'],
    a: 'A landing page is a single focused page built for one goal, usually for an ad campaign: it explains one offer and asks for one action, like an enquiry or call. We build landing pages for campaigns, products and lead generation.',
    links: [L.web] },
  { id: 'page-types', k: ['single page', 'one page website', 'multi page', 'multipage', 'multi-page', 'how many pages'],
    a: `A single-page website puts everything on one scrolling page; a multi-page website has separate pages (Home, About, Services, Contact…). The Starter package includes up to ${'5'} pages, Business up to 10, and extra pages are ${addon('Extra page (simple)')}.`,
    links: [L.pricing] },
  { id: 'responsive', k: ['responsive website', 'what is responsive', 'responsive'],
    a: 'A responsive website adjusts itself to every screen (phone, tablet and computer) so it is easy to read and use everywhere. All our websites are mobile-friendly and checked on mobile and desktop before launch.' },
  { id: 'static-dynamic', k: ['dynamic website', 'static website', 'static or dynamic', 'what is static', 'what is dynamic'],
    a: 'A static website shows the same fixed pages to everyone; it is simple and fast. A dynamic website loads content from a database, for example blogs, products, logins or bookings, so content can change without editing code. We suggest what fits your needs.' },
  { id: 'cms', k: ['cms', 'content management', 'wordpress', 'what is wordpress', 'wordpress or custom', 'custom coding', 'custom website development', 'custom development', 'custom web'],
    a: 'A CMS (content management system, like WordPress) lets you edit text and images without code. Custom development means the website is built specifically for your needs, which often makes it faster and more flexible. WordPress suits simple sites you edit often; custom suits special features and performance. We recommend the right option during planning.' },
  { id: 'improve-website', k: ['redesign', 'old website', 'fix my', 'broken website', 'website faster', 'make my website faster', 'speed up', 'slow website', 'improve my website', 'improve our current', 'existing website', 'update my website', 'purani website'],
    a: 'Yes. We first review what works on your current website, then propose targeted fixes (speed, mobile, broken parts, security) or a redesign where the old system holds you back. We protect useful pages and links so existing Google traffic isn\'t lost; rankings can\'t be guaranteed.',
    links: [L.web, L.quote] },
  { id: 'multilingual', k: ['multilingual', 'multi language', 'multiple languages', 'two languages', 'hindi website', 'gujarati website'],
    a: 'A website in more than one language (for example English plus Gujarati or Hindi) can be included in your scope. The extra pages and translation are quoted in your proposal.',
    links: [L.quote] },
  { id: 'design-only', k: ['sirf design', 'only design', 'design or development', 'banaoge ya', 'design and development'],
    a: 'We do both: we plan and design the website, build it, test it on mobile and desktop, launch it, and hand it over with access and training.' },

  { id: 'mobile-app', w: 1.3, k: ['mobile app', 'android app', 'ios app', 'app development', 'make an app', 'make app', 'application', 'app'],
    a: `We build websites and web applications (customer portals, dashboards and custom business tools) that work in any phone browser. For a native Android or iOS app, ${'our team will tell you what is possible for your project.'}`,
    links: TEAM_LINKS },

  // ───────────────────────── Website features ─────────────────────────
  { id: 'contact-features', k: ['contact me through', 'contact form', 'enquiry form', 'inquiry form', 'whatsapp button', 'call button', 'google map', 'google maps on', 'add google maps', 'map on website'],
    a: `Yes. Every package includes a contact form, WhatsApp button and Google Map; a click-to-call button is easy to add too. Enquiries reach you directly.`,
    links: [L.pricing] },
  { id: 'booking', k: ['book appointments', 'appointment', 'booking', 'bookings', 'schedule appointment'],
    a: `Yes. Online booking / appointments is an add-on at ${addon('Online booking')}.`, links: [L.pricing] },
  { id: 'portal', k: ['upload documents', 'create accounts', 'customer account', 'log in', 'login', 'sign up', 'admin dashboard', 'customer dashboard', 'dashboard', 'password protected', 'password-protected', 'members only', 'portal'],
    a: 'Yes. Logins, customer accounts, document uploads, password-protected pages and dashboards are custom features. We build customer portals and custom web tools; they are scoped in the Premium / custom range and quoted after we understand your workflow.',
    links: [L.quote] },
  { id: 'self-edit', k: ['update website content myself', 'update content myself', 'myself', 'edit my website', 'upload new photos', 'add new products', 'change content', 'update it myself', 'khud update', 'jate update', 'admin access', 'admin panel'],
    a: 'Yes. Handover confirms your account access, and the Premium package includes training to manage your website, so you can update text, photos or products yourself. If you prefer, maintenance covers updates for you.',
    chips: ['Maintenance', 'Website pricing'] },
  { id: 'blog', k: ['blog', 'articles section', 'news section'],
    a: `Yes. The Business package includes a blog section, or blog setup is ${addon('Blog setup')} as an add-on.`, links: [L.pricing] },
  { id: 'gallery', k: ['testimonials section', 'add testimonials', 'customer reviews on', 'add customer reviews', 'add reviews', 'photo gallery', 'video gallery', 'gallery', 'downloadable', 'pdf', 'brochure', 'social media links', 'social links', 'instagram feed'],
    a: 'Yes. Galleries (the Starter package includes a Gallery page), video sections, testimonials and reviews, downloadable PDFs or brochures and social media links can all be added to your website.' },
  { id: 'search-filters', k: ['search bar', 'search box', 'filters', 'filter', 'sorting'],
    a: `Yes. Search and filters are common for product listings. Complex pages like product listings with filters are ${addon('Extra page (complex')}.`, links: [L.pricing] },
  { id: 'custom-tools', k: ['calculator', 'quotation generator', 'price quotation', 'invoice generator', 'quote generator', 'estimate tool', 'custom tool', 'automation', 'crm'],
    a: 'Yes. We build custom business tools like calculators, quotation or invoice generators and workflows that bring a manual task online. These are scoped and quoted after we understand how you work.',
    links: [L.quote] },
  { id: 'payments', k: ['online payments', 'online payment', 'pay online', 'payment gateway', 'razorpay', 'upi payments', 'accept upi', 'credit card', 'debit card', 'international payments', 'cash on delivery', 'cod'],
    a: `Yes. We connect a payment gateway such as Razorpay (add-on ${addon('Payment gateway')}, included in Premium / E-commerce). Gateways like Razorpay support UPI, cards and more; which methods, international payments and the fees are set by the provider once your business account is approved. Cash on delivery can be offered as a checkout option in stores.`,
    links: [L.pricing, L.ecom] },
  { id: 'chatbot', k: ['add a chatbot', 'chatbot', 'live chat', 'chat on website', 'whatsapp chat'],
    a: 'Yes, just like this one! We can add a chat assistant that answers common questions, a WhatsApp chat button, or live chat connected to your team.', links: [L.quote] },
  { id: 'analytics', k: ['google analytics', 'search console', 'integrate google', 'tracking code', 'analytics'],
    a: 'Yes. All packages include Google Search Console setup, and the Business package adds Google Analytics. For ads we also check conversion tracking.' },

  // ───────────────────────── Pricing & timelines ─────────────────────────
  { id: 'pricing', w: 1.6,
    k: ['price', 'prices', 'pricing', 'cost', 'costs', 'charges', 'charge', 'fees', 'rate', 'kitna', 'kitne ki', 'kitne ka', 'kitni', 'kharcha', 'kharch', 'kharcho', 'ketlo', 'ketla rupiya', 'paisa', 'paise', 'package', 'packages', 'cheapest', 'minimum rate', 'starting price', 'expensive', 'mehenga', 'monghu'],
    a: `Business websites start at ${formatInr(STARTER.price)}:\n• ${STARTER.name}: ${formatInr(STARTER.price)} one-time (up to 5 pages)\n• ${BUSINESS.name}: ${formatInr(BUSINESS.price)} one-time (up to 10 pages, blog, custom design)\n• ${PREMIUM.name}: from ${formatInr(PREMIUM.price)} (online store / fully custom)\nDigital marketing and SEO are quoted after a free call. Your final quote is shared in writing before any work begins.`,
    links: [L.pricing, L.quote], chips: ['What is not included?', 'Payment terms', 'How long does a website take?'] },
  { id: 'low-budget', w: 1.7, k: ['rs 2 000', 'rs 5 000', '2000', '5000', '2 000', '5 000', 'budget kam', 'low budget', 'less budget', 'small budget', 'within my budget', 'my budget', 'cheaper', 'budget ochu', 'saste'],
    a: `Our lowest website package is ${STARTER.name} at ${formatInr(STARTER.price)}. We don't offer websites below that, because a working business website needs design, setup, testing and SEO basics. Share your budget with the team and they'll tell you honestly what fits.`,
    links: [L.pricing, L.whatsapp] },
  { id: 'price-factors', w: 1.7, k: ['why do some websites cost', 'affects website pricing', 'affect the price', 'what affects', 'cost more', 'others rs 50 000', 'price difference', 'calculate project cost', 'how do you calculate'],
    a: 'Price depends on the number of pages, design (template vs custom), features (store, booking, payments, logins), who writes the content, integrations and speed/SEO work. Cheap websites often skip planning, mobile testing, SEO setup and support. Our quote lists exactly what\'s included.',
    links: [L.pricing] },
  { id: 'not-included', w: 1.7, k: ['domain included', 'hosting included', 'ssl included', 'hidden charges', 'hidden cost', 'additional charges', 'extra charges', 'not included', 'what is not included', 'included'],
    a: `Not included in website packages: domain and hosting charges (we set them up at actual cost + setup), content writing (unless your package includes it), logo design, and paid plugins, stock photos or subscriptions. Mobile-friendly design and basic SEO setup are included in every package. There are no hidden charges: everything is listed in your written quote. SSL (the padlock) normally comes with hosting; the team confirms it in your quote.`,
    links: [L.pricing] },
  { id: 'seo-included', w: 1.8, k: ['is seo included', 'seo included', 'seo free with'],
    a: 'Basic SEO setup is included in every website package (titles, meta, sitemap, Search Console). Ongoing SEO to grow rankings is a separate service, quoted after a free call.', links: [L.seo] },
  { id: 'recurring', w: 1.6, k: ['one time', 'one-time', 'every month', 'every year', 'monthly', 'yearly', 'renewal', 'annual', 'har mahine', 'dar mahine', 'mahine'],
    a: `Website packages are a one-time payment. Recurring costs are only: domain + hosting renewal (yearly, at actual cost) and optional maintenance at ${addon('Website maintenance')}. Digital marketing and SEO are usually monthly work, quoted after a free call.`,
    links: [L.pricing] },
  { id: 'payment-terms', w: 1.7, k: ['installment', 'installments', 'emi', 'advance payment', 'advance', 'pay after', 'payment terms', 'payment schedule', 'pay later', 'pay after the website', 'monthly payment plan', 'hapta', 'kisht', 'after i become successful'],
    a: `Website payments are split into stages: ${payTerms}. Work starts after the advance. Other schedules are specified in your quotation or agreement.`,
    links: [L.pricing] },
  { id: 'payment-methods', w: 1.6, k: ['pay through upi', 'pay by upi', 'bank transfer', 'neft', 'cash', 'cheque', 'payment method', 'how to pay', 'gst', 'charge gst', 'tax'],
    a: `We share payment details along with your quotation or invoice. For payment methods and GST, ${ASK_TEAM.toLowerCase()}`, links: TEAM_LINKS },
  { id: 'invoice', w: 1.4, k: ['do you provide invoices', 'invoice', 'bill', 'receipt'],
    a: 'Yes. Project pricing and payments are documented in your quotation, proposal and invoice.' },
  { id: 'timeline', w: 1.5, k: ['how long', 'how much time', 'timeline', 'delivery time', 'kitna time', 'kitne din', 'kab tak', 'ketla divas', 'ketlo samay', 'divas ma', 'days', 'weeks', 'development take', 'when will', 'deadline'],
    a: `${STARTER.name} websites are delivered in 7–10 working days and ${BUSINESS.name} websites in 2–3 weeks. For e-commerce or fully custom websites, the timeline is agreed after scoping. You get the timeline in your proposal.`,
    links: [L.pricing], chips: ['Urgent delivery', 'Get a Quote'] },
  { id: 'urgent', w: 1.8, k: ['one day', 'three days', '3 days', '2 days', 'tonight', 'today', 'urgent', 'urgently', 'asap', 'fast delivery', 'quick delivery', 'jaldi', 'aaj', 'kal tak', 'tomorrow'],
    a: `Urgent delivery is available for ${addon('Urgent delivery')} and takes about half the normal time (roughly a week for a Starter site). One day or overnight isn't realistic for a properly tested business website.`,
    links: [L.pricing, L.whatsapp] },
  { id: 'changes-after', w: 1.4, k: ['changes after delivery', 'changes after', 'after delivery', 'after launch changes', 'modification', 'baad mein change'],
    a: `Revisions are included during the project (2 rounds in Starter, 3 in Business; extra rounds are ${addon('Extra revision')}). After launch, small updates and fixes are covered by maintenance at ${addon('Website maintenance')}, or quoted as needed.`,
    chips: ['Maintenance'] },

  // ───────────────────────── Domain, hosting, ownership ─────────────────────────
  { id: 'domain', k: ['what is a domain', 'what is domain', 'domain name', 'domain kya'],
    a: 'A domain is your website\'s address, like yourbusiness.com or yourbusiness.in. You renew it every year; if it expires, your website and emails on it stop working until it\'s renewed.' },
  { id: 'hosting', k: ['what is hosting', 'what is a hosting', 'need hosting', 'why hosting', 'hosting kya', 'server'],
    a: 'Hosting is the online computer (server) where your website\'s files live, so it\'s available to everyone 24/7. Without hosting, there is nothing to show at your domain.' },
  { id: 'ssl', k: ['what is ssl', 'what is https', 'https', 'ssl', 'padlock', 'secure connection'],
    a: 'SSL makes your website open with https:// and a padlock, encrypting what visitors send (like forms). Browsers show "Not secure" without it, so every business website should have it.' },
  { id: 'free-domain', k: ['free domain', 'free hosting', 'free hosting service'],
    a: 'Free domains and hosting usually show someone else\'s branding, are slow or limited, and look less trustworthy. A proper .com or .in domain is affordable; we set up domain + hosting at actual cost + setup.',
    links: [L.pricing] },
  { id: 'buy-domain', k: ['buy a domain', 'buy domain', 'register domain', 'existing domain', 'my domain', 'domain hai', 'domain chhe', 'domain che', 'paase domain', 'paas domain', 'domain already', 'already have a domain', 'have a domain'],
    a: 'Both work. If you already have a domain, we connect it to your new website. If not, we can set up the domain and hosting for you at actual cost + setup.',
    links: [L.pricing] },
  { id: 'ownership', k: ['who owns', 'owns the', 'ownership', 'source code', 'access to the hosting', 'hosting access', 'password', 'my login', 'credentials', 'get the code', 'malik kaun'],
    a: 'Your handover confirms the accounts and access you receive (domain, hosting, website admin) and who handles future updates. Ownership and licensing of custom work are set out in your project agreement, so ask the team for those details in your quote.',
    links: [L.whatsapp] },
  { id: 'expiry', k: ['domain expires', 'hosting expires', 'expire', 'expired', 'expiry', 'renew'],
    a: 'If your domain or hosting expires, your website stops opening until it\'s renewed, and an expired domain can eventually be bought by someone else. Keep auto-renew on or ask us to remind you.' },
  { id: 'security', k: ['hack', 'hacked', 'secure', 'security', '100 secure', 'virus', 'malware', 'safe'],
    a: 'We take reasonable measures to protect websites, but no website is 100% secure. Security also depends on hosting, third-party plugins and strong passwords. Maintenance (updates, backups, fixes) lowers the risk, and we can review and improve an existing site\'s security.',
    chips: ['Maintenance'] },
  { id: 'backups', k: ['backup', 'backups', 'goes down', 'website down', 'not opening', 'recover', 'deleted website', 'restore'],
    a: `Backups, updates and fixes are part of website maintenance (${addon('Website maintenance')}). If your site goes down or was deleted, contact us; recovery depends on what backups exist with your hosting.`,
    links: TEAM_LINKS },
  { id: 'migrate', k: ['migrate', 'migration', 'move my website', 'move our', 'change hosting', 'hosting providers', 'change developers', 'switch developer', 'change agencies', 'change agency', 'switch agency'],
    a: 'Yes. We can move websites and stores: we record existing pages and links, plan redirects and check important pages after launch. You can also change providers or developers later; your accounts and information remain under your control.' },
  { id: 'maintenance', w: 1.2, k: ['maintenance', 'maintain', 'compulsory', 'mandatory', 'bugs after', 'bug', 'button stops', 'stops working', 'not working', 'support after', 'after launch support'],
    a: `Maintenance is optional, at ${addon('Website maintenance')} for updates, backups and fixes. You can also maintain the website yourself after training. Issues reported after launch are handled under maintenance or quoted as needed.`,
    links: [L.pricing] },

  // ───────────────────────── E-commerce ─────────────────────────
  { id: 'ecommerce', k: ['ecommerce', 'e commerce', 'e-commerce', 'online store', 'online shop', 'sell products', 'sell online', 'sell only one', 'products online', 'one product', '1 000 products', '1000 products', 'many products', 'dukaan online'],
    a: `Yes. An e-commerce website lets customers browse products, add to cart and pay online. You can sell one product or thousands. Our ${PREMIUM.name} package starts at ${formatInr(PREMIUM.price)} with products, cart, orders, Razorpay payments and training. For wholesale or B2B, a catalogue with enquiry forms can suit better than checkout.`,
    links: [L.ecom, L.pricing] },
  { id: 'ecom-ops', w: 1.3, k: ['track orders', 'order tracking', 'inventory', 'stock', 'discount coupon', 'coupons', 'festival sale', 'sales offer', 'cancel orders', 'refunds', 'request refunds', 'return products', 'returns', 'digital products', 'subscriptions', 'variants', 'size and color', 'by weight', 'shipping', 'pin code', 'pincode', 'courier', 'shiprocket', 'order notifications', 'gst invoices', 'orders from my phone', 'physical shop', 'offline shop'],
    a: 'Yes, most store features can be planned: order tracking, inventory, coupons and sales, cancellations/returns, variants, shipping rules by PIN code, courier tools like Shiprocket, order notifications, GST invoices and managing orders from your phone. Exact features are confirmed in your proposal; courier and gateway fees are set by those providers.',
    links: [L.ecom, L.quote] },
  { id: 'shopify', k: ['shopify', 'shopify better', 'woocommerce'],
    a: 'Shopify is quick to start but has monthly fees and app costs, and limits some customisation. A custom store has no platform subscription and fits your exact process. We suggest the right choice based on your products, budget and team.',
    links: [L.ecom] },
  { id: 'ecom-cost', w: 1.9, k: ['online store cost', 'ecommerce cost', 'store cost', 'cost of online store'],
    a: `Online stores start at ${formatInr(PREMIUM.price)} (${PREMIUM.name}). Cost depends on product count, features, integrations and supplied content; a written proposal follows discovery. Gateway charges and shipping costs are separate.`,
    links: [L.pricing, L.quote] },

  // ───────────────────────── SEO ─────────────────────────
  { id: 'seo', k: ['seo', 'search engine optimization', 'what is seo', 'why seo', 'seo do', 'seo kya', 'seo ka', 'seo shu', 'faydo', 'fayda', 'benefit of seo', 'organic', 'customer aayenge', 'bring customers', 'website traffic', 'increase traffic', 'upar lavvo', 'upar lana'],
    a: 'SEO (search engine optimisation) helps your business appear on Google when people search for what you sell, without paying per click. We review your website and Search Console, fix technical issues, research what customers search for, improve page content and local information, and report on enquiries. It can bring more relevant visitors and enquiries, but results take time and no ranking is guaranteed.',
    links: [L.seo], chips: C.seo },
  { id: 'seo-guarantee', w: 1.6, k: ['rank my website', 'number one', 'number 1', 'first page', 'page one', 'rank 1', 'top of google', 'first kaise', 'first position', 'pehle number', 'first forever', 'rank first', 'guarantee ranking', 'guarantee rankings'],
    a: 'We can improve your chances of ranking, but nobody can honestly guarantee a #1 position. Rankings depend on competition, your website and Google\'s changes. We agree useful goals, measure enquiries and explain the results clearly. For instant top placement, Google Ads is the paid option.',
    links: [L.seo, L.gads] },
  { id: 'seo-time', w: 1.5, k: ['how long does seo', 'seo take', 'seven days', '7 days', 'seo time', 'seo results', 'seo kitna time', 'seo kitne din', 'seo me kitna time'],
    a: 'Website fixes can be discovered by Google quickly, but meaningful growth usually takes several months of steady work. We agree review milestones instead of promising a ranking date. SEO in seven days isn\'t realistic.' },
  { id: 'seo-monthly', w: 1.4, k: ['seo one time', 'seo every month', 'seo monthly', 'stop seo', 'stop seo after', 'seo a one time'],
    a: 'You can choose: an audit and fix plan (one-time), ongoing monthly SEO support, or a focused project like a site move or set of articles. Competitors keep working, so stopping completely can let rankings slip over time.',
    links: [L.seo] },
  { id: 'seo-terms', w: 1.3, k: ['on page', 'on-page', 'off page', 'off-page', 'technical seo', 'keyword', 'keywords', 'keyword difficulty', 'search intent', 'backlink', 'backlinks', 'meta title', 'meta description', 'sitemap', 'robots txt', 'robots'],
    a: 'Quick guide:\n• On-page SEO: titles, headings, content and links on your pages.\n• Off-page SEO: mentions and links from other websites (backlinks).\n• Technical SEO: speed, mobile, indexing and site structure.\n• Keyword: the words people type into Google. We pick them from real customer questions and Search Console; difficulty is how hard a term is to rank for, and search intent is what the searcher actually wants.\n• Meta title and description: the headline and snippet shown on Google.\n• Sitemap and robots.txt: files that help Google find and crawl your pages.',
    links: [L.seo] },
  { id: 'gsc-ga', w: 1.4, k: ['what is google search console', 'what is search console', 'what is google analytics'],
    a: 'Google Search Console shows how your site appears on Google: searches, clicks and indexing problems. Google Analytics shows what visitors do on your site. We set up Search Console with every website and Analytics in the Business package.' },
  { id: 'seo-diagnose', w: 1.5, k: ['not appearing', 'not indexed', 'indexing', 'not showing', 'not ranking', 'ranking drop', 'rankings dropped', 'competitor ranking', 'competitor above', 'competitor is', 'search mein nahi', 'search me nahi', 'google ma nathi'],
    a: 'Common reasons: Google can\'t find or index the pages, pages don\'t clearly answer what people search, the site is slow, several pages compete for the same thing, or competitors have stronger content and reviews. We diagnose the cause from Search Console and fix it before changing pages that already work.',
    links: [L.seo, L.quote] },
  { id: 'seo-platforms', w: 1.3, k: ['optimize an old', 'optimize a wordpress', 'optimize a shopify', 'optimise', 'optimize my website', 'wordpress seo', 'shopify seo'],
    a: 'Yes. We optimise existing websites, including WordPress and Shopify, starting with a review of what already works.', links: [L.seo] },
  { id: 'seo-content', w: 1.3, k: ['without a blog', 'publish articles', 'need articles', 'need blogs', 'write blogs', 'content for seo'],
    a: 'Not always. We improve existing pages first and add articles only where a useful customer question isn\'t answered yet. Each article has a clear purpose.' },
  { id: 'seo-reporting', w: 1.3, k: ['how many keywords', 'seo working', 'seo reports', 'send seo', 'seo report', 'know seo', 'seo doesnt', 'no results', 'doesnt give results'],
    a: 'We don\'t sell a fixed number of keywords. We track non-branded Google clicks, the pages people land on, qualified enquiries and local profile actions, and send regular reports. If something isn\'t working, we explain why and adjust the plan.' },
  { id: 'seo-cities', w: 1.3, k: ['rank in ahmedabad', 'across gujarat', 'multiple cities', 'other cities seo', 'many cities', 'city pages'],
    a: 'Yes, where you genuinely serve those areas. We improve your Google Business Profile and create useful location content for real service areas. Pages that only swap the city name rarely help.', links: [L.localSeo] },
  { id: 'seo-vs-ads', w: 1.5, k: ['seo better than', 'better than google ads', 'google ads or seo', 'seo or google ads', 'seo vs', 'ads vs seo', 'same as seo', 'rank without paying', 'without paying google'],
    a: 'SEO earns free visits from Google over time; you don\'t pay Google per click, but it takes months. Google Ads bring visitors immediately, but you pay for every click and they stop when the budget stops. Many businesses use ads for quick enquiries while SEO builds up.',
    links: [L.seo, L.gads] },
  { id: 'speed-seo', w: 1.3, k: ['speed affect', 'speed seo', 'page speed', 'loading speed'],
    a: 'Yes. A slow website frustrates visitors and can hurt rankings. We check loading speed, image sizes and mobile performance as part of every website and SEO review.' },
  { id: 'seo-cost', w: 2, k: ['seo cost', 'cost of seo', 'seo price', 'seo charges', 'local seo cost', 'seo packages'],
    a: 'SEO is quoted after we check your website, the access needed and the work agreed, so there\'s no fixed price list. Choose an audit, ongoing support or a focused project. Book a free call for a quote.',
    links: [L.seo, L.quote] },

  // ───────────────────────── Local SEO ─────────────────────────
  { id: 'local-seo', k: ['local seo', 'google business profile', 'business profile', 'gmb', 'google my business', 'google listing', 'maps listing', 'google maps', 'maps', 'near me', 'not appearing on google maps', 'shop not appearing', 'top three', 'top 3', 'map pack'],
    a: 'Local SEO helps nearby customers find you on Google Search and Maps. We review and optimise your Google Business Profile (categories, services, hours, photos, products), keep your name, address and phone consistent, and connect it to your website. Maps results depend on relevance, distance and reputation, so no position is guaranteed.',
    links: [L.localSeo] },
  { id: 'gbp-setup', w: 1.4, k: ['create my google business', 'create my business profile', 'create google listing', 'verification', 'verify', 'suspend', 'suspended', 'two google listings', 'two listings', 'change my business address', 'change address'],
    a: 'Yes, we can set up and manage a real, eligible Business Profile with owner access, and help with verification, address changes or suspension issues by following Google\'s rules. The Business website package includes Google Business Profile setup. We never create fake or duplicate listings.',
    links: [L.localSeo] },
  { id: 'gbp-address', w: 1.5, k: ['hide my home address', 'hide address', 'home address', 'service area', 'service-area', 'without a physical', 'rank without a website', 'no physical shop', 'without shop', 'home based', 'home-based', 'no office'],
    a: 'Yes. A service-area business that visits customers can usually hide its address and still rank locally, and businesses without a shop can market online. We check Google\'s eligibility rules first and never create fake locations.',
    links: [L.localSeo] },
  { id: 'gbp-reviews', w: 1.5, k: ['google reviews improve', 'reviews improve', 'genuine customer reviews', 'get reviews', 'more reviews', 'remove fake reviews', 'fake reviews', 'reply to customer reviews', 'reply to reviews', 'negative review'],
    a: 'Genuine reviews help trust and local visibility. We help you set up a simple way to ask real customers for honest feedback and reply to reviews. We don\'t buy, write or fake reviews; fake reviews can only be reported to Google for removal under its policies.',
    links: [L.localSeo] },
  { id: 'local-areas', w: 1.4, k: ['bopal', 'satellite', 'sg highway', 'prahlad nagar', 'vastrapur', 'maninagar', 'multiple locations', 'many locations', 'multiple branches'],
    a: 'Yes, where you genuinely serve those areas. We highlight them in your Business Profile and website. Ranking in nearby areas also depends on distance from the searcher; we never create fake addresses.', links: [L.localSeo] },
  { id: 'maps-calls', w: 1.4, k: ['maps bring', 'phone calls from google', 'calls from maps', 'maps calls'],
    a: 'Yes. Your Business Profile has call, directions and website buttons; we track those actions and enquiries in reports.' },

  // ───────────────────────── Social media ─────────────────────────
  { id: 'smm', k: ['social media', 'social media marketing', 'smm', 'instagram', 'facebook', 'linkedin', 'manage my instagram', 'instagram handle', 'handle kari', 'insta', 'multiple platforms'],
    a: 'Social media marketing keeps your business visible and trusted where customers spend time. We manage Instagram, Facebook and LinkedIn: profile optimisation, content planning and scheduling, posts, carousels, reels, captions and hashtags, basic community engagement and monthly reporting. Platform choice depends on your audience.',
    links: [L.smm], chips: ['Social media cost', 'Can you make reels?'] },
  { id: 'youtube', w: 1.4, k: ['youtube', 'youtube ads', 'youtube channel'],
    a: `We focus on Instagram, Facebook and LinkedIn for social media, and on Google Search, Meta and ChatGPT for ads. For YouTube, ${ASK_TEAM.toLowerCase()}`, links: TEAM_LINKS },
  { id: 'smm-content', w: 1.2, k: ['posts', 'carousel', 'carousels', 'reels', 'reel', 'edit my videos', 'video editing', 'scripts', 'captions', 'hashtags', 'instagram bio', 'bio', 'highlights', 'content calendar', 'schedule posts', 'graphic design', 'festival posts', 'festival', 'memes', 'educational', 'creatives', 'promotional'],
    a: 'Yes. We create social media posts, carousels, promotional and festival creatives, educational content, reels and short videos (editing, captions and text overlays), captions and hashtags, bio and profile optimisation, and a monthly content calendar with scheduled posting.',
    links: [L.smm] },
  { id: 'smm-volume', w: 1.5, k: ['how many posts', 'how many reels', 'posts per month', 'reels per month', 'posts monthly', 'kitne post', 'ketli post'],
    a: 'The number of posts and reels per month depends on your plan and budget, and is written in your proposal. Book a free call and we\'ll suggest a realistic posting plan.', links: [L.quote] },
  { id: 'smm-assets', w: 1.4, k: ['shoot videos', 'photoshoot', 'provide photos', 'existing photos', 'my photos', 'video shoot', 'shoot', 'footage'],
    a: 'You can provide your own photos and video footage, and we design and edit with them. Creating new content without a shoot is possible with graphics; a photo or video shoot can be discussed based on your project.' },
  { id: 'smm-engage', w: 1.4, k: ['comments', 'dms', 'dm', 'reply to instagram', 'messages on instagram', 'inbox'],
    a: 'Basic community engagement is part of social media management. How much comment and DM handling is included is agreed in your plan.' },
  { id: 'smm-followers', w: 1.5, k: ['followers', 'viral', 'reels viral', 'make my reels viral', 'famous', 'guarantee 10 000', '10000 followers', 'buy followers', 'fake followers', 'followers nahi', 'badh nahi', 'grow my account', 'organically', 'organic growth'],
    a: 'We grow accounts organically with consistent, useful content, never by buying fake followers. No honest agency can guarantee follower numbers or make reels go viral; we focus on reach, engagement and enquiries from the right people.',
    links: [L.smm] },
  { id: 'smm-reach', w: 1.5, k: ['low views', 'reach decreasing', 'reach is', 'no reach', 'reach nahi', 'reach nahi aa', 'views but no', 'views no customers', 'no engagement', 'reach down'],
    a: 'Low reach usually comes from irregular posting, content that doesn\'t speak to your audience, or no clear reason to contact you. Views without customers often mean the offer, profile or call to action is unclear. We review your account and plan content around what your customers care about.',
    links: [L.smm, L.quote] },
  { id: 'smm-accounts', w: 1.2, k: ['new instagram', 'new account', 'inactive', 'revive', 'personal brand', 'restaurants social', 'restaurant s social', 'manufacturer s social', 'b2b company s social', 'b2b social'],
    a: 'Yes. We work with new and inactive accounts, personal brands, restaurants, product and service businesses, manufacturers and B2B companies. The content plan is built around your audience.' },
  { id: 'smm-language', w: 1.5, k: ['work in gujarati', 'gujarati content', 'hindi content', 'english content', 'content in hindi', 'content in gujarati'],
    a: 'Content language is agreed in your content plan. Tell the team which languages your customers prefer (English, Hindi or Gujarati) when you discuss your project.', links: [L.whatsapp] },
  { id: 'influencer', w: 1.4, k: ['influencer', 'influencers', 'collaboration with influencer'],
    a: `Influencer collaborations aren't listed as a standard service. ${ASK_TEAM}`, links: TEAM_LINKS },
  { id: 'smm-cost', w: 2, k: ['social media cost', 'social media management cost', 'smm cost', 'instagram cost', 'social media charges', 'social media price'],
    a: 'Social media management is quoted after a free call, based on platforms, posts and reels per month and whether we create videos. You get a written proposal with deliverables and cost.', links: [L.quote] },

  // ───────────────────────── Google Ads ─────────────────────────
  { id: 'gads', k: ['google ads', 'adwords', 'advertise on google', 'ads on google', 'google advertising', 'ppc'],
    a: 'Google Ads show your business at the top of Google when people search for what you sell. You pay when someone clicks (PPC: pay-per-click). We research keywords, build campaigns and ad copy, align landing pages, set up conversion tracking and report on spend, enquiries and lead quality. Ads can bring leads and calls quickly, but results aren\'t guaranteed.',
    links: [L.gads], chips: C.ads },
  { id: 'ads-terms', w: 1.3, k: ['what is cpc', 'cpc', 'ctr', 'conversion tracking', 'search campaign', 'display campaign', 'shopping campaign', 'performance max', 'pmax', 'cost per click', 'click through'],
    a: 'Quick guide:\n• CPC (cost per click): what you pay each time someone clicks your ad.\n• CTR (click-through rate): the % of people who see your ad and click it.\n• Conversion tracking: records real actions like an enquiry or purchase after a click.\n• Search campaign: text ads on Google search results.\n• Display campaign: image ads on websites and apps.\n• Shopping campaign: product ads with photo and price.\n• Performance Max: Google\'s automated campaign across all its channels.' },
  { id: 'ads-landing', w: 1.4, k: ['ads without a website', 'without a website', 'landing page for ads', 'need a landing page', 'ads ke liye page'],
    a: 'Ads work best when they lead to a page that answers the customer\'s questions and makes contacting you easy. Meta lead forms or WhatsApp ads can run without a website, while Google Search Ads need a page to send people to. We can build a landing page for your campaign.',
    links: [L.web] },
  { id: 'ads-budget', w: 1.6, k: ['daily budget', 'ad budget', 'budget do i need', 'how much should i spend', 'spend daily', 'minimum monthly ad', 'minimum budget', 'minimum advertising budget', 'advertising budget', 'rs 100', 'rs 200', 'rs 500', '100 per day', '200 per day', '500 per day', '100 mein', 'ads chalane', 'ads kharcha', 'ads ka kharcha', 'kitna kharcha aayega', 'without spending money', 'ads without spending', 'free ads'],
    a: 'There\'s no single right budget: it depends on your area, competition and what an enquiry is worth to you. We review click costs and propose a small test budget before scaling. Very small daily budgets can work for testing in a narrow area but give limited data. Ads always need some spend; free alternatives are SEO and organic social media. Ad spend is paid to Google or Meta and is separate from our management fee.',
    links: [L.gads, L.meta], chips: ['Ads management fee', 'Get a Quote'] },
  { id: 'ads-fee', w: 1.8, k: ['ad spend included', 'spend included', 'pay google directly', 'pay meta directly', 'management fee', 'ads management fee', 'charge to manage', 'manage google ads cost', 'setup fee', 'meta ads management cost', 'meta ads cost', 'google ads cost', 'ads cost', 'performance marketing cost', 'ads kitne', 'ads ka charge', 'ads no charge'],
    a: 'Ad spend is paid directly to the platform (Google, Meta or OpenAI) from your own account, and is kept separate from our management fee. Our fee is quoted after a free call based on the campaigns and scope.',
    links: [L.quote] },
  { id: 'ads-control', w: 1.5, k: ['stop ads', 'pause', 'pause my ads', 'stop paying', 'stop anytime', 'own my google ads', 'own my ad account', 'ad account owner', 'own the ad account', 'where my money', 'money is spent', 'see spend'],
    a: 'Campaigns run in your own business ad account with partner access for us, so ownership and billing stay with you. You can pause or stop ads any time; ads stop showing as soon as they are paused. You can see exactly where money is spent in the account and in our reports.' },
  { id: 'ads-speed', w: 1.5, k: ['how quickly', 'how soon', 'start running', 'when will ads', 'get leads', 'leads kab', 'results kab'],
    a: 'Setup and tracking checks come first, then ads can start once the platform approves them. Enquiries can begin soon after launch, but there\'s no fixed date for profitable results; optimisation continues as data comes in.' },
  { id: 'guarantee', w: 1.4, k: ['guarantee', 'guaranteed', 'guarantee leads', 'guarantee sales', 'guarantee results', 'guarantee revenue', 'guarantee traffic', 'guarantee roi', 'return on ad spend guarantee', 'guarantee a return on ad spend', 'guarantee a return', 'can you guarantee', 'guarantee website traffic', 'pakka', 'become rich', '100 customers', 'customers tomorrow', 'earns money automatically'],
    a: 'No. Honest agencies can\'t guarantee leads, sales, revenue, traffic, rankings or followers: results depend on competition, your offer, platforms and follow-up. We define a measurement plan, run controlled tests and report honestly on what works.',
    links: [L.terms] },
  { id: 'ads-trouble', w: 1.6, k: ['not getting clicks', 'no clicks', 'clicks but no', 'clicks aa rahe', 'par sales nahi', 'no leads', 'irrelevant leads', 'leads irrelevant', 'leads are irrelevant', 'bad leads', 'cost per lead high', 'cost per lead is high', 'expensive leads', 'fake leads', 'ads are expensive', 'meta ads expensive', 'spending money without', 'losing money', 'lose money'],
    a: 'Common causes: targeting too broad or narrow, ads that don\'t match the search, a weak landing page or form, poor tracking, or slow follow-up. Cheap or fake leads often come from easy forms with no qualifying questions. We audit the campaign, search terms, landing page and tracking, then fix the biggest problem first.',
    links: [L.gads, L.meta, L.quote] },
  { id: 'ads-audit', w: 1.5, k: ['audit', 'audit my google ads', 'audit my meta', 'existing campaigns', 'fix my existing', 'existing google ads', 'existing meta', 'review my ads', 'review my campaign'],
    a: 'Yes, with access to your account. We review conversion setup, campaign settings, search terms, budgets, audiences and landing pages, and give you a prioritised plan before changing anything.', links: [L.gads, L.meta] },
  { id: 'ads-targeting', w: 1.3, k: ['target only', 'target specific', 'pin codes', 'target international', 'exclude', 'business hours', 'age group', 'business owners', 'target customers in', 'target people', 'targeting', 'retarget', 'remarketing', 'interacted with my'],
    a: 'Yes. Ads can be targeted by city, radius or region, with irrelevant locations excluded, scheduled during business hours, and (on Meta) by age, interests and people who interacted with your page or website (retargeting, where consent and platform rules allow).' },
  { id: 'ads-reports', w: 1.3, k: ['performance reports', 'reports', 'monthly reports', 'measure results', 'how do you measure', 'reporting'],
    a: 'Yes. You get regular reports in plain language: for ads, spend, clicks, enquiries, cost per lead and lead quality; for social media, reach, engagement and enquiries; for SEO, Google clicks, landing pages and local profile actions. We also explain what we\'ll change next.' },

  { id: 'advertise', w: 1.3, k: ['advertise products', 'advertise services', 'advertise a local', 'advertise my', 'advertising strategy', 'advertising plan', 'online advertising', 'run ads', 'paid ads', 'advertising'],
    a: 'Yes. We advertise products, services and local businesses on Google Ads, Meta Ads (Facebook and Instagram) and ChatGPT Ads, and plan the strategy, audience, budget, landing page and tracking together. Ad spend is paid to the platform, separate from our fee.',
    links: [L.gads, L.meta, L.chatgpt], chips: C.ads },

  // ───────────────────────── Meta Ads ─────────────────────────
  { id: 'meta', k: ['meta ads', 'facebook ads', 'instagram ads', 'meta', 'boost', 'boosting', 'boosting a post', 'boost my posts', 'difference between meta', 'meta ads and google ads', 'meta vs google', 'google vs meta', 'promote my reels', 'promote my instagram', 'ads on instagram', 'ads on facebook'],
    a: 'Meta Ads run on Facebook and Instagram. Google Ads reach people who are searching; Meta Ads introduce your offer to the right audience while they scroll. We plan the audience, creative, ad copy and lead destination (form, WhatsApp or website) and track qualified leads. Boosting a post is a simple promotion; a full campaign gives more control over objective, audience and tracking.',
    links: [L.meta], chips: C.ads },
  { id: 'meta-terms', w: 1.4, k: ['business manager', 'ads manager', 'meta pixel', 'pixel', 'conversions api', 'capi', 'install pixel'],
    a: 'Meta Business Manager (Business Suite) holds your pages and ad accounts; Ads Manager is where campaigns are created. Meta Pixel and the Conversions API send website actions (like enquiries) back to Meta so ads can be measured and optimised. We set these up as part of campaign tracking.' },
  { id: 'meta-needs', w: 1.4, k: ['without an instagram', 'without a facebook', 'without instagram', 'without facebook page', 'need a facebook page'],
    a: 'Meta Ads need a Facebook Page (and usually an Instagram account) to run from. We help set them up properly in your business account.' },
  { id: 'meta-creative', w: 1.4, k: ['ad creatives', 'ad copy', 'video ads', 'write ads', 'ad design', 'how many creatives'],
    a: 'Yes. We create ad creatives, write ad copy and plan static and video variations to test. The number of creatives depends on budget; testing a few distinct ideas usually works better than many small changes.' },
  { id: 'meta-leads', w: 1.4, k: ['lead generation ads', 'lead ads', 'forms directly', 'fill out forms', 'send customers to whatsapp', 'ads to whatsapp', 'click to whatsapp', 'send customers to my website', 'increase instagram followers', 'increase product sales'],
    a: 'Yes. Meta campaigns can collect leads with forms inside Facebook/Instagram, send people to WhatsApp, or send them to your website or store. The goal (enquiries, sales or followers) is chosen per campaign and measured by qualified results.' },
  { id: 'meta-issues', w: 1.5, k: ['ads rejected', 'rejected', 'disapproved', 'account restricted', 'restricted', 'ad account banned', 'banned'],
    a: 'Ads get rejected or accounts restricted when they break platform policies (wording, claims, restricted categories) or due to security or payment issues. We review the reason and fix the ad or follow the platform\'s appeal process; the final decision is the platform\'s.' },
  { id: 'industry-ads', w: 1.3, k: ['ads for restaurants', 'ads for real estate', 'ads for manufacturing', 'ads for clinics', 'ads for'],
    a: 'Yes. We run campaigns for local services, restaurants, real estate, manufacturers and B2B suppliers. Some categories (like real estate or finance) have special platform rules, which we check first.' },

  // ───────────────────────── Performance marketing ─────────────────────────
  { id: 'perf', k: ['performance marketing', 'performance', 'funnel', 'sales funnel', 'marketing funnel'],
    a: 'Performance marketing connects ad spend to measurable results like enquiries and sales, not just clicks. We define conversions, coordinate Google and Meta campaigns, improve landing pages and forms, run tests and review cost per lead alongside lead quality. A funnel is the path from first seeing your ad to becoming a customer.',
    links: [L.perf] },
  { id: 'perf-terms', w: 1.3, k: ['what is a conversion', 'conversion rate', 'cro', 'conversion rate optimization', 'customer acquisition cost', 'cac', 'cost per lead', 'cpl', 'cpa', 'return on investment', 'roi', 'roas', 'return on ad spend', 'attribution', 'a b testing', 'ab testing', 'split test'],
    a: 'Quick guide:\n• Conversion: a valuable action like an enquiry, call or purchase.\n• Conversion rate: conversions ÷ visitors or clicks.\n• CRO: improving pages so more visitors take action.\n• CPL (cost per lead): ad spend ÷ leads. CAC/CPA: spend ÷ customers or agreed actions.\n• ROI: profit compared to total cost. ROAS: revenue ÷ ad spend.\n• Attribution: deciding which ad or channel gets credit for a sale.\n• A/B testing: comparing two versions to see which works better.',
    links: [L.perf] },
  { id: 'perf-help', w: 1.2, k: ['manage google and meta', 'both platforms', 'improve my landing page', 'landing page conversions', 'reduce my cost', 'better quality leads', 'better-quality leads', 'more enquiries', 'generate more', 'reduce my cost per lead', 'ecommerce conversion', 'e commerce conversion', 'track conversions', 'track calls', 'track whatsapp', 'track form', 'connect analytics', 'dashboard', 'dashboards', 'analyze my', 'analyse my', 'optimize campaigns', 'every week', 'weekly'],
    a: 'Yes. We can manage Google and Meta together, improve landing pages and forms, track calls, WhatsApp clicks and form submissions, connect analytics with campaigns, build reporting dashboards and review your existing funnel. Optimisation is ongoing; the review schedule depends on traffic and budget.',
    links: [L.perf, L.quote] },
  { id: 'perf-scale', w: 1.4, k: ['increase my ad budget', 'increase budget', 'scale', 'scaling', 'profitable', 'competitors getting more', 'competitors more customers'],
    a: 'Increase budget only when tracking is reliable and enquiries are turning into customers at an acceptable cost. Competitors may be winning through a clearer offer, better landing pages, more reviews or faster follow-up. We compare cost per lead with lead quality and sales before scaling.' },
  { id: 'perf-small', w: 1.4, k: ['suitable for small', 'small businesses performance'],
    a: 'Yes, if you have a clear offer, a page that converts and a way to follow up on enquiries. We start with a small measured test before increasing spend.' },

  // ───────────────────────── ChatGPT Ads ─────────────────────────
  { id: 'chatgpt-ads', w: 1.3, k: ['chatgpt ads', 'chatgpt ad', 'ads on chatgpt', 'advertise on chatgpt', 'ai conversations', 'chatgpt answers', 'sponsored recommendations', 'openai ads'],
    a: 'ChatGPT Ads are sponsored placements shown inside ChatGPT, clearly labelled as sponsored and kept separate from ChatGPT\'s answers. They are matched to the topic of a conversation rather than exact keywords, and advertisers don\'t see users\' conversations. They are a new channel to test alongside Google and Meta, not a replacement, and they don\'t affect organic visibility. We help with setup, eligibility checks, ads, landing pages, tracking and reporting.',
    links: [L.chatgpt], chips: ['Who sees ChatGPT Ads?', 'ChatGPT Ads cost'] },
  { id: 'chatgpt-who', w: 1.6, k: ['who sees chatgpt', 'who can see chatgpt', 'chatgpt ads available', 'available in india', 'eligibility', 'eligible', 'target specific cities', 'customer interests', 'choose keywords'],
    a: 'According to OpenAI, ads are shown to adult users on selected ChatGPT plans, and paid plans like Plus and Pro remain ad-free. Availability, targeting options and restricted categories are changing as the platform grows, so we check current eligibility for your business before planning a campaign.',
    links: [L.chatgpt] },
  { id: 'chatgpt-cost', w: 1.8, k: ['chatgpt ads cost', 'cost of chatgpt ads', 'chatgpt budget', 'clicks or impressions'],
    a: 'ChatGPT Ads pricing is auction-based and depends on your category and competition. We propose a small test budget after reviewing your offer; ad spend is paid to the platform and kept separate from our management fee.', links: [L.chatgpt, L.quote] },
  { id: 'chatgpt-start', w: 1.5, k: ['get started with chatgpt', 'create an advertising campaign', 'separate advertising account', 'track leads from chatgpt', 'promote my website through'],
    a: 'We review your offer, customers, landing page and eligibility, plan the conversations where you\'re genuinely helpful, write the ads, check tracking and launch an agreed test budget. Leads and conversions are tracked like other campaigns.',
    links: [L.chatgpt, L.quote] },

  // ───────────────────────── Billing ─────────────────────────
  { id: 'get-quote', w: 1.2, k: ['get a quote', 'quotation', 'quote', 'proposal', 'estimate', 'project proposal'],
    a: 'Yes. Tell us about your business and needs through the Get a Quote form, WhatsApp or a call. You receive a written quote or proposal with deliverables, timeline and cost before any work begins.',
    links: [L.quote, L.whatsapp] },
  { id: 'fixed-packages', w: 1.3, k: ['fixed price', 'fixed-price', 'customize a package', 'customise', 'custom package', 'upgrade', 'downgrade', 'upgrade my package', 'downgrade my package'],
    a: 'Websites have fixed-price packages (Starter, Business, Premium) and you add only what you need from the fixed add-on list. Marketing and SEO are scoped to your goals. To upgrade or change a package mid-project, talk to the team; extra work outside scope is quoted separately.',
    links: [L.pricing] },
  { id: 'discount', w: 1.4, k: ['discount', 'discounts', 'startup discount', 'offer', 'match another', 'match price', 'cheaper than', 'kam karo', 'ochu karo'],
    a: `Our prices are published so you know them upfront. For any current offers, ${ASK_TEAM.toLowerCase()}`, links: TEAM_LINKS },
  { id: 'vs-freelancer', w: 1.4, k: ['higher than freelancers', 'freelancer instead', 'hire a freelancer', 'cheaper freelancer', 'why pay you', 'why should i pay', 'do it myself seo', 'manage ads myself'],
    a: 'A freelancer can be a good fit for small one-off tasks. With us you get one accountable team for website, SEO and marketing, published prices with a written quote, tracking set up properly and someone answerable after launch. You can also do SEO or ads yourself; we save you the learning time and costly mistakes.' },
  { id: 'free-work', w: 1.4, k: ['for free', 'free work', 'free of cost', 'muft', 'free ma'],
    a: `We don't take projects for free, but the first call to understand your needs is free, and website prices start at ${formatInr(STARTER.price)}.`, links: [L.pricing, L.whatsapp] },
  { id: 'late-payment', w: 1.4, k: ['delay payment', 'late payment', 'payment late', 'overdue'],
    a: 'Under our Terms, work may be paused if invoices become overdue. If you expect a delay, tell the team early and they\'ll discuss it with you.', links: [L.terms] },
  { id: 'refund', w: 1.5, k: ['refund policy', 'refund', 'money back', 'cancel a service', 'cancel service', 'cancel project', 'cancellation', 'terminate'],
    a: 'Refund and cancellation conditions are defined in your project agreement, and either party may end a project according to that agreement. Ask the team to explain them before you start.', links: [L.terms, L.whatsapp] },

  // ───────────────────────── Trust & objections ─────────────────────────
  { id: 'unhappy', w: 1.4, k: ['dont like your work', 'do not like', 'not satisfied', 'unsatisfied', 'project fails', 'dont deliver on time', 'late delivery', 'stops responding', 'stop responding', 'not responding', 'pasand nahi'],
    a: 'You see and approve page structure and designs before development, and revisions are included (2 rounds in Starter, 3 in Business). Timelines are written in your proposal and you can follow progress through the team and Client Portal. If something goes wrong, raise it with the founders directly; your agreement covers what happens next.',
    links: [L.whatsapp] },
  { id: 'agreement', w: 1.4, k: ['sign agreements', 'agreement', 'contract', 'nda', 'non disclosure', 'confidential', 'confidentiality', 'privacy of my'],
    a: 'Yes. Projects are confirmed in writing with a quotation or agreement. We protect confidential business information, and can sign a separate NDA where required.', links: [L.terms] },

  // ───────────────────────── Process ─────────────────────────
  { id: 'process', w: 1.2, k: ['after i contact', 'what happens after', 'process', 'how do you work', 'working process', 'steps'],
    a: '1. Tell us about your business, customers and goals.\n2. We review your website, Google listing and competitors and suggest where to start.\n3. You receive a written scope with deliverables and costs.\n4. We do the agreed work and review enquiries and results with you.',
    links: [L.quote] },
  { id: 'requirements', w: 1.3, k: ['information do you need', 'what information', 'prepare a document', 'requirement document', 'requirements on whatsapp', 'send requirements', 'brief'],
    a: 'No formal document is needed. Share your business name, what you sell, who your customers are, the pages or features you want, any reference websites and your timeline. Send it on WhatsApp, by email or explain it on a call.',
    links: [L.whatsapp, L.quote] },
  { id: 'work-begins', w: 1.4, k: ['when does work begin', 'work begin', 'start work', 'kab start'],
    a: `Work begins after you approve the quote and pay the advance (${PAYMENT_TERMS[0].label}). You get a project timeline in your proposal.` },
  { id: 'previews', w: 1.4, k: ['design previews', 'preview', 'see the design', 'mockup', 'approve design'],
    a: 'Yes. We agree page structure and designs with you before development, and you approve the design before the next payment stage.' },
  { id: 'revisions', w: 1.4, k: ['revisions', 'revision', 'how many revisions', 'request changes', 'change requirements', 'halfway'],
    a: `Starter includes 2 rounds of revisions and Business 3; extra rounds are ${addon('Extra revision')}. Changing requirements midway is possible; new features outside the agreed scope are quoted separately.` },
  { id: 'logo-content', w: 1.3, k: ['logo', 'dont have a logo', 'website content', 'write website content', 'content writing', 'provide content later', 'content later', 'dont have content', 'copywriting'],
    a: `No problem. Logo design is ${addon('Logo design')} and content writing ${addon('Content writing')}; the Business package includes help with content for key pages. You can also supply content later, though timing depends on when content is ready.`,
    links: [L.pricing] },
  { id: 'training', w: 1.3, k: ['explain how to use', 'how to use my website', 'training', 'teach me to use'],
    a: 'Yes. At handover we explain how to use your website, and the Premium package includes training to manage it.' },
  { id: 'progress', w: 1.3, k: ['project progress', 'check progress', 'track progress', 'contact during the project', 'who should i contact', 'point of contact', 'client portal'],
    a: 'You can follow updates through our Client Portal and talk directly with the team on WhatsApp or by phone during the project.',
    links: [{ label: 'Client Portal', href: '/client/login' }, L.whatsapp] },
  { id: 'after-completion', w: 1.3, k: ['after project completion', 'after completion', 'after the website is', 'banne ke baad', 'bani gaya pachi', 'continue working', 'work together again', 'long term'],
    a: 'After launch we hand over access and explain how to use your website. Then you can keep it as is, take maintenance, or grow it with SEO, social media or ads. Many projects continue as ongoing work.',
    chips: ['Maintenance', 'SEO', 'Digital marketing'] },

  // ───────────────────────── Industries ─────────────────────────
  { id: 'industry-web', k: ['restaurant', 'cafe', 'caf', 'sweet shop', 'clinic', 'dentist', 'doctor', 'hospital', 'school', 'coaching', 'institute', 'real estate', 'builder', 'construction', 'clothing', 'fashion', 'jewelry', 'jewellery', 'salon', 'spa', 'gym', 'fitness', 'travel agency', 'consultant', 'grocery', 'kirana', 'shop', 'store for my', 'hotel', 'ca firm', 'lawyer', 'architect', 'interior'],
    a: 'Yes, we build websites for all kinds of businesses: restaurants and cafés, shops, clinics and hospitals, schools and coaching institutes, real estate and construction, salons, gyms, travel agencies, consultants and more. The package depends on the pages and features you need.',
    links: [L.pricing, L.quote], chips: ['Website pricing', 'Help me choose'] },
  { id: 'industry-mfg', w: 1.3, k: ['manufacturer', 'manufacturing', 'factory', 'exporter', 'export', 'packaging', 'b2b', 'industrial', 'supplier', 'gidc', 'wholesale'],
    a: 'Yes. We build product catalogue websites, SEO and lead generation for manufacturers, factories, exporters and B2B suppliers, including the Toyon Industry product website. Catalogues with enquiry forms often suit B2B better than online checkout.',
    links: [L.mfg, L.projects] },
  { id: 'personal-site', w: 1.3, k: ['my dog', 'birthday', 'just for fun', 'personal website', 'wedding', 'for fun'],
    a: `Fun idea! A personal or event website can be built like any other website; tell the team what you have in mind and they'll quote it. Websites start at ${formatInr(STARTER.price)}.`, links: [L.whatsapp] },

  // ───────────────────────── Ethics ─────────────────────────
  { id: 'unethical', w: 3, k: ['hack my competitor', 'hack competitor', 'competitor s website', 'competitor disappear', 'remove competitor', 'fake google reviews', 'create fake', 'buy me fake', 'fake followers', 'buy followers', 'spam'],
    a: 'Sorry, we don\'t do that. Hacking, fake reviews, fake followers or harming competitors is unlawful or against platform rules, and it can get your own business banned. We\'ll gladly help you beat competitors honestly with a better website, SEO and ads.',
    links: [L.terms] },

  // ───────────────────────── Careers & partnerships ─────────────────────────
  { id: 'careers', w: 1.4, k: ['job', 'jobs', 'hiring', 'intern', 'internship', 'career', 'vacancy', 'naukri', 'teach me', 'course', 'learn website', 'collaborate', 'collaboration', 'partner', 'partnership', 'reseller', 'white label', 'white-label'],
    a: `Thanks for your interest! For jobs, internships, learning or partnership and reseller enquiries, email ${EMAIL} with your details and the team will get back to you.`,
    links: [L.email] },

  // ───────────────────────── Contact & small talk ─────────────────────────
  { id: 'contact', k: ['contact', 'phone', 'number', 'email', 'mail', 'whatsapp', 'talk', 'baat', 'vaat', 'reach you', 'hours', 'timing', 'office timing', 'office hours', 'working hours', 'open', 'sunday', 'holiday', 'right now', 'call right now'],
    a: `You can call ${PHONE_1} or ${PHONE_2}, WhatsApp us, or email ${EMAIL}. Working hours: ${HOURS} (Sunday closed).`,
    speak: 'You can call us, message on WhatsApp or send an email. We work Monday to Saturday, 9 AM to 8 PM.',
    links: [L.call, L.whatsapp, L.email] },
  { id: 'greeting', k: ['hi niya', 'hello niya', 'hey niya', 'hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'namaskar', 'kem cho', 'good morning', 'good afternoon', 'good evening', 'jai shree krishna', 'ram ram'],
    a: 'Hello! How can I help you today? Ask about websites, SEO, social media, ads, pricing or how we work.', chips: C.start },
  { id: 'thanks', k: ['thanks', 'thank you', 'thank u', 'thanku', 'ty', 'thx', 'ok', 'okay', 'great', 'nice', 'cool', 'dhanyavad', 'shukriya', 'aabhar', 'theek hai', 'saru'],
    a: "You're welcome! Anything else I can help with?", chips: C.start },
  { id: 'bye', k: ['bye', 'goodbye', 'see you', 'tata', 'avjo'],
    a: 'Thanks for visiting InfronixWeb! Reach us any time on WhatsApp.', links: [L.whatsapp] },
];

// Quick-reply chips that map to a topic directly.
const CHIP_TOPIC = {
  'What services do you offer?': 'services',
  'Website pricing': 'pricing',
  'How long does a website take?': 'timeline',
  'Contact the team': 'contact',
  'Digital marketing': 'dm',
  'I need a website': 'want-website',
  'Get more customers': 'guide',
  'Improve my Google ranking': 'seo',
  'Social media & ads': 'dm',
  'Just checking prices': 'pricing',
  'Talk to the team': 'contact',
  'SEO cost': 'seo-cost',
  'Online store': 'ecommerce',
  'Which package should I pick?': 'guide',
  'Who will handle my project?': 'team',
  'Where is your office?': 'location',
  'Something is not working': 'stuck',
  'See your work': 'portfolio',
  'SEO': 'seo',
  'Local SEO': 'local-seo',
  'How long does SEO take?': 'seo-time',
  'Get a Quote': 'get-quote',
  'Payment terms': 'payment-terms',
  'What is not included?': 'not-included',
  'Urgent delivery': 'urgent',
  'Maintenance': 'maintenance',
  'Ad budget': 'ads-budget',
  'Ads management fee': 'ads-fee',
  'Do you guarantee leads?': 'guarantee',
  'Social media cost': 'smm-cost',
  'Can you make reels?': 'smm-content',
  'Who sees ChatGPT Ads?': 'chatgpt-who',
  'ChatGPT Ads cost': 'chatgpt-cost',
  'Help me choose': 'guide',
};

// Used only when nothing at all matches: offer a menu instead of a dead end.
const MENU = {
  id: 'menu',
  text: "Let me point you the right way. Here's what I can help with. Pick one, or ask in your own words:",
  links: [L.whatsapp],
  chips: ['I need a website', 'Website pricing', 'Improve my Google ranking', 'Social media & ads', 'Help me choose', 'Talk to the team'],
};

// ───────────────────────── Matching ─────────────────────────
export function normalise(text) {
  return ` ${String(text)
    .toLowerCase()
    .replace(/₹/g, ' rs ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Precompile keyword patterns. A keyword matches whole words, with an optional plural "s".
const COMPILED = TOPICS.map((topic) => ({
  topic,
  patterns: [...new Set(topic.k.map((kw) => normalise(kw).trim()))]
    // Skip plurals already covered by their singular keyword (matching allows a trailing "s").
    .filter((norm, _, all) => !(/s$/.test(norm) && (all.includes(norm.slice(0, -1)) || all.includes(norm.slice(0, -2)))))
    .map((norm) => {
      const words = norm.split(' ').length;
      return {
        re: new RegExp(`\\s${escapeRe(norm).replace(/ /g, '\\s')}(?:s|es)?(?=\\s)`),
        score: words > 1 ? words * 2 : norm.length >= 7 ? 1.5 : 1,
      };
    }),
}));

const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
export const TOPIC_IDS = TOPICS.map((t) => t.id);

function toReply(topic, confidence = 'high') {
  return {
    id: topic.id,
    text: topic.a,
    speak: topic.speak,
    links: topic.links,
    chips: topic.chips,
    action: topic.action,
    confidence,
  };
}

/** Reply for a topic id, e.g. from a quick-reply chip. */
export function topicReply(id) {
  const topic = TOPIC_BY_ID.get(id);
  return topic ? toReply(topic) : null;
}

// ── Typo tolerance ──
const STOP_WORDS = new Set(['what', 'your', 'have', 'with', 'this', 'that', 'from', 'will', 'about', 'does', 'want', 'make', 'like', 'please', 'tell', 'know', 'there', 'they', 'them', 'than', 'then', 'when', 'which', 'would', 'could', 'should', 'into', 'just', 'also', 'very', 'much', 'many', 'more', 'some', 'only', 'mera', 'meri', 'mere', 'apna', 'kaise', 'kaisa', 'karna', 'karo', 'hota', 'hoga', 'sakte', 'chhe', 'kari', 'mate', 'thase']);

function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

// Everyday words and the topic they most likely mean. Used when no phrase matched,
// so a message like "webiste" or "payment?" still gets a useful answer.
const VOCAB = {
  website: 'want-website', websites: 'want-website', webpage: 'want-website', site: 'want-website',
  marketing: 'dm', digital: 'dm', advertising: 'advertise', ads: 'advertise', campaign: 'advertise',
  payment: 'payment-terms', payments: 'payment-terms', installment: 'payment-terms',
  domain: 'buy-domain', hosting: 'hosting', server: 'hosting',
  price: 'pricing', pricing: 'pricing', cost: 'pricing', budget: 'low-budget', package: 'pricing',
  seo: 'seo', ranking: 'seo', google: 'found-on-google', maps: 'local-seo',
  instagram: 'smm', facebook: 'smm', social: 'smm', reels: 'smm-content', content: 'logo-content',
  logo: 'logo-content', design: 'design-custom', store: 'ecommerce', shop: 'ecommerce', ecommerce: 'ecommerce',
  team: 'team', founder: 'founder', contact: 'contact', phone: 'contact', email: 'contact', whatsapp: 'contact',
  address: 'location', office: 'location', quote: 'get-quote', quotation: 'get-quote', proposal: 'get-quote',
  review: 'reviews-agency', reviews: 'reviews-agency', portfolio: 'portfolio', projects: 'portfolio',
  maintenance: 'maintenance', security: 'security', delivery: 'timeline', timeline: 'timeline',
  refund: 'refund', discount: 'discount', guarantee: 'guarantee', leads: 'guide', customers: 'guide',
  services: 'services', service: 'services', help: 'guide', sales: 'guide', enquiries: 'guide', app: 'mobile-app', chatgpt: 'chatgpt-ads',
};

// Single-word keywords plus the vocabulary, used for "close enough" matches such as typos or word stems.
const SINGLE_WORDS = TOPICS.map((topic) => ({
  topic,
  words: [...new Set([
    ...topic.k.map((kw) => normalise(kw).trim()).filter((w) => !w.includes(' ') && w.length >= 4),
    ...Object.keys(VOCAB).filter((w) => VOCAB[w] === topic.id),
  ])],
}));

function fuzzyScore(token, word) {
  if (token === word) return 1;
  if (token.length >= 5 && word.length >= 4 && (token.startsWith(word) || word.startsWith(token))) return 0.8;
  // Swapped letters ("domian") count as a typo too.
  if (token.length === word.length && token.length >= 5 && [...token].sort().join('') === [...word].sort().join('')) return 0.6;
  const limit = word.length >= 7 ? 2 : word.length >= 5 ? 1 : 0;
  return limit && editDistance(token, word) <= limit ? 0.6 : 0;
}

// ── Learned phrases (shared from other visitors' choices) ──
let learnedCache = { source: null, list: [] };
function compileLearned(learned) {
  if (learnedCache.source === learned) return learnedCache.list;
  const list = (Array.isArray(learned) ? learned : [])
    .filter((l) => l && TOPIC_BY_ID.has(l.topic) && typeof l.phrase === 'string')
    .map((l) => {
      const norm = normalise(l.phrase).trim();
      return norm ? { topic: l.topic, norm, re: new RegExp(`\\s${escapeRe(norm).replace(/ /g, '\\s')}(?=\\s)`), score: norm.split(' ').length * 3 } : null;
    })
    .filter(Boolean);
  learnedCache = { source: learned, list };
  return list;
}

// ── Page context: what visitors on each page usually need ──
const OPENING_CHIPS = ['I need a website', 'Get more customers', 'Improve my Google ranking', 'Social media & ads', 'Just checking prices', 'Talk to the team'];

const PAGE_CONTEXT = [
  { test: (p) => p.startsWith('/start-project'), greet: 'Filling in the quote form? I can explain any question or help you pick a package.', chips: ['Which package should I pick?', 'What is not included?', 'Payment terms', 'Talk to the team'] },
  { test: (p) => p.startsWith('/pricing'), greet: 'Looking at our packages? I can help you pick the right one or explain what is included.', chips: ['Which package should I pick?', 'What is not included?', 'Payment terms', 'How long does a website take?'] },
  { test: (p) => p.startsWith('/seo/local'), greet: 'Want more customers from Google Maps? Ask me about your Business Profile, reviews or local ranking.', chips: ['Local SEO', 'SEO cost', 'How long does SEO take?'], redirect: { pricing: 'seo-cost', timeline: 'seo-time', seo: 'local-seo' } },
  { test: (p) => p.startsWith('/seo'), greet: 'Want to show up higher on Google? Ask me how SEO works, how long it takes or what it costs.', chips: ['How long does SEO take?', 'SEO cost', 'Local SEO', 'Help me choose'], redirect: { pricing: 'seo-cost', timeline: 'seo-time' } },
  { test: (p) => p.includes('ecommerce'), greet: 'Planning an online store? Ask me about payments, products, shipping or cost.', chips: ['Online store', 'Website pricing', 'Help me choose'], redirect: { pricing: 'ecom-cost' } },
  { test: (p) => p.startsWith('/web-development'), greet: 'Planning a website? I can tell you the packages, timelines and what is included.', chips: ['Website pricing', 'How long does a website take?', 'Online store', 'See your work'] },
  { test: (p) => p.startsWith('/digital-marketing/social'), greet: 'Want your social media to bring real enquiries? Ask me about posts, reels or pricing.', chips: ['Can you make reels?', 'Social media cost', 'Help me choose'], redirect: { pricing: 'smm-cost' } },
  { test: (p) => p.startsWith('/chatgpt-ads'), greet: 'Curious about ChatGPT Ads? Ask me who sees them, how they work or what they cost.', chips: ['Who sees ChatGPT Ads?', 'ChatGPT Ads cost', 'Help me choose'], redirect: { pricing: 'chatgpt-cost', 'ads-fee': 'chatgpt-cost', 'ads-budget': 'chatgpt-cost' } },
  { test: (p) => ['/google-ads', '/meta-ads', '/performance-marketing', '/digital-marketing/paid'].some((x) => p.startsWith(x)), greet: 'Thinking about ads? Ask me about budgets, leads or what our management includes.', chips: ['Ad budget', 'Ads management fee', 'Do you guarantee leads?', 'Help me choose'], redirect: { pricing: 'ads-fee' } },
  { test: (p) => p.startsWith('/digital-marketing-agency') || p.startsWith('/digital-marketing-for'), greet: 'Looking for a team near you? Ask me where we are, what we do or how we work.', chips: ['Where is your office?', 'What services do you offer?', 'Help me choose'] },
  { test: (p) => p.startsWith('/digital-marketing'), greet: 'Want more customers online? Ask me about social media, Google Ads or Meta Ads.', chips: ['Social media & ads', 'Ad budget', 'Social media cost', 'Help me choose'], redirect: { pricing: 'smm-cost' } },
  { test: (p) => p.startsWith('/projects'), greet: 'Like what you see? I can tell you what a similar project would cost.', chips: ['Website pricing', 'Help me choose', 'Get a Quote'] },
  { test: (p) => p.startsWith('/about'), greet: 'Want to know who you would work with? Ask me about our team or how we work.', chips: ['Who will handle my project?', 'Where is your office?', 'Talk to the team'] },
  { test: (p) => p.startsWith('/contact'), greet: 'Prefer a quick answer? Ask me here, or reach the team directly.', chips: ['Talk to the team', 'Where is your office?', 'Get a Quote'] },
  { test: (p) => p.startsWith('/blog'), greet: 'Reading up? Ask me anything about websites, SEO or marketing for your business.', chips: ['What services do you offer?', 'Help me choose', 'Talk to the team'] },
  { test: (p) => p.startsWith('/services'), greet: 'Not sure which service you need? I can help you choose in a minute.', chips: ['Help me choose', 'Website pricing', 'Social media & ads'] },
];

export function getPageContext(path = '/') {
  return PAGE_CONTEXT.find((c) => c.test(String(path))) || null;
}

// Chip to show for a topic the visitor was interested in on an earlier visit.
const INTEREST_CHIP = {
  pricing: 'Website pricing', 'want-website': 'I need a website', seo: 'Improve my Google ranking', 'local-seo': 'Local SEO',
  smm: 'Social media & ads', dm: 'Social media & ads', gads: 'Ad budget', meta: 'Ad budget', ecommerce: 'Online store',
  'seo-cost': 'SEO cost', 'smm-cost': 'Social media cost', timeline: 'How long does a website take?',
};

/** Opening message for the current page, personalised from this browser's memory. */
export function buildGreeting(path, memory = {}) {
  const ctx = getPageContext(path);
  const returning = (memory.visits || 0) > 1;
  const hello = returning ? `Welcome back${memory.name ? `, ${memory.name}` : ''}! ` : "Hi, I'm Niya from InfronixWeb! ";
  const text = ctx ? `${hello}${ctx.greet}` : `${hello}What brings you here today?`;
  const topInterest = Object.entries(memory.interests || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  const interestChip = returning && INTEREST_CHIP[topInterest];
  const chips = [...new Set([interestChip, ...(ctx ? ctx.chips : OPENING_CHIPS)].filter(Boolean))].slice(0, 6);
  return { id: 'greeting-open', text, chips };
}

// Gentle offers when a visitor seems stuck.
export const NUDGES = {
  idle: { text: 'Still looking for something? I can point you to the right page or answer a quick question.', chips: ['Help me choose', 'Just checking prices'] },
  rage: { text: "Looks like something isn't responding. Tell me what you were trying to do, or reach the team directly.", chips: ['Something is not working', 'Talk to the team'] },
  exit: { text: 'Before you go: want a quick price idea or a free call with our team?', chips: ['Just checking prices', 'Talk to the team'] },
  form: { text: 'Need help with the form? I can explain any question or suggest a package.', chips: ['Which package should I pick?', 'Talk to the team'] },
};

/**
 * Returns the scripted reply for a visitor message.
 * options.path: current page (answers that depend on the page, e.g. "cost" on the SEO page).
 * options.learned: [{ phrase, topic }] phrases learned from other visitors' choices.
 * reply.confidence: 'high' (keyword match), 'fuzzy' (close match) or 'none' (menu shown).
 */
export function getReply(message, { path = '', learned = null } = {}) {
  const chipTopic = CHIP_TOPIC[message];
  if (chipTopic) return toReply(TOPIC_BY_ID.get(chipTopic));

  const text = normalise(message);
  const ctx = getPageContext(path);
  const scores = new Map();
  const add = (id, value) => scores.set(id, (scores.get(id) || 0) + value);

  for (const { topic, patterns } of COMPILED) {
    let score = 0;
    for (const p of patterns) if (p.re.test(text)) score += p.score;
    if (score) add(topic.id, score * (topic.w || 1));
  }
  for (const l of compileLearned(learned)) {
    if (text.trim() === l.norm) return toReply(TOPIC_BY_ID.get(l.topic));
    if (l.re.test(text)) add(l.topic, l.score);
  }

  let confidence = 'high';
  if (!scores.size) {
    // Nothing matched exactly: allow typos and word stems ("servises", "pricing" vs "price").
    const tokens = text.trim().split(' ').filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
    for (const { topic, words } of SINGLE_WORDS) {
      let score = 0;
      for (const token of tokens) {
        let best = 0;
        for (const w of words) best = Math.max(best, fuzzyScore(token, w));
        score += best;
      }
      if (score) add(topic.id, score * (topic.w || 1));
    }
    confidence = 'fuzzy';
  }
  if (!scores.size) return { ...MENU, confidence: 'none' };

  let bestId = null;
  let bestScore = 0;
  for (const [id, score] of scores) if (score > bestScore) { bestId = id; bestScore = score; }
  // On a service page, generic questions ("how much?") get that service's answer.
  const finalId = ctx?.redirect?.[bestId] || bestId;
  return toReply(TOPIC_BY_ID.get(finalId), confidence);
}

// ───────────────────────── Guided lead flow ─────────────────────────
// The visitor answers a few questions; nothing is sent anywhere until they tap
// "Send on WhatsApp", which opens WhatsApp with their answers pre-filled.
export const LEAD_STEPS = [
  { key: 'name', q: "What's your name?" },
  { key: 'business', q: 'What is your business name, and what do you do?' },
  { key: 'city', q: 'Which city is your business in?' },
  { key: 'service', q: 'Which service are you interested in?', chips: ['New website', 'Website redesign', 'SEO / Google Maps', 'Social media', 'Google / Meta Ads', 'Not sure yet'] },
  { key: 'website', q: 'Do you already have a website? If yes, type its address.', chips: ['No website yet'] },
  { key: 'goal', q: 'What is your main goal?', chips: ['More enquiries', 'More online sales', 'Brand awareness', 'Look more professional'] },
  { key: 'budget', q: 'What budget do you have in mind?', chips: ['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹50,000', '₹50,000+', 'Not sure'] },
  { key: 'timeline', q: 'When would you like to start?', chips: ['As soon as possible', 'Within a month', 'In 1–3 months', 'Just exploring'] },
  { key: 'contact', q: 'How should our team contact you?', chips: ['WhatsApp', 'Phone call', 'Email', 'Meeting'] },
];

const LEAD_LABELS = {
  name: 'Name', business: 'Business', city: 'City', service: 'Service', website: 'Website',
  goal: 'Goal', budget: 'Budget', timeline: 'Start', contact: 'Preferred contact',
};

export function isCancel(text) {
  return /^\s*(cancel|stop|exit|quit|band karo|rehne do|nahi|no thanks)\s*$/i.test(text);
}

/** Final message for the lead flow: a suggestion plus a pre-filled WhatsApp link. */
export function buildLeadSummary(answers) {
  const lines = Object.entries(LEAD_LABELS)
    .filter(([key]) => answers[key])
    .map(([key, label]) => `${label}: ${answers[key]}`);
  const service = String(answers.service || '').toLowerCase();
  let suggestion = 'Our team will review your answers and suggest a practical plan.';
  if (service.includes('new website')) {
    suggestion = `Based on your answers, a ${STARTER.name} (${formatInr(STARTER.price)}) or ${BUSINESS.name} (${formatInr(BUSINESS.price)}) website is usually the right start, together with a Google Business Profile.`;
  } else if (service.includes('redesign')) {
    suggestion = 'We would start by reviewing your current website, then propose targeted fixes or a redesign.';
  } else if (service.includes('seo')) {
    suggestion = 'We would start with a review of your website, Search Console and Google Business Profile, then quote an SEO plan.';
  } else if (service.includes('social')) {
    suggestion = 'We would plan a monthly content calendar for the right platforms and quote it after a free call.';
  } else if (service.includes('ads')) {
    suggestion = 'We would check your landing page and tracking, then propose a small test budget for Google or Meta Ads.';
  }
  const message = `Hi InfronixWeb! I'd like to discuss a project.\n${lines.join('\n')}`;
  return {
    id: 'lead-summary',
    text: `Thanks${answers.name ? `, ${answers.name}` : ''}! Here's a summary:\n${lines.join('\n')}\n\n${suggestion} Tap below to send this to our team on WhatsApp. Nothing is shared until you send it.`,
    speak: `Thanks${answers.name ? `, ${answers.name}` : ''}! ${suggestion} Tap Send on WhatsApp to share your details with our team.`,
    links: [
      { label: 'Send on WhatsApp', href: `${WHATSAPP}?text=${encodeURIComponent(message)}` },
      L.quote,
      L.call,
    ],
    chips: ['What services do you offer?', 'Website pricing'],
  };
}
