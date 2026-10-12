import Link from 'next/link';

const briefs = {
  'web-development': {
    title: 'Planning your business website',
    answers: [
      ['What can the website include?', 'Business and service pages, online stores, landing pages, customer portals and enquiry forms. The proposal confirms the pages and features your business needs.'],
      ['How is the quote prepared?', 'Page count, content, design requirements and features determine the scope. Hosting, maintenance and future updates are agreed separately.'],
      ['What happens before launch?', 'We review mobile layouts, navigation, enquiry forms, loading speed and important links. The handover confirms account access and who handles future updates.'],
    ],
    href: 'https://toyonindustry.com/', label: 'Explore the live Toyon Industry website',
  },
  seo: {
    title: 'What your SEO plan should answer',
    answers: [
      ['What work does SEO include?', 'A review of your website and Search Console, customer keyword research, useful page content, working links and accurate local business information. The first changes are chosen from the evidence.'],
      ['What do SEO packages cost?', 'A website review, ongoing support and a focused content project cover different work. We prepare a quote after checking the site, access needed and agreed responsibilities; there is no fixed price list on this page.'],
      ['How do AEO and GEO relate to SEO?', 'AEO makes information easier to use in search answers; GEO focuses on discovery in AI-generated answers. Clear explanations, accurate business details and accessible pages help people and search systems understand your business. A mention or citation is never guaranteed.'],
    ],
    href: '/blog/ai-seo-generative-search', label: 'Read the guide to AI search and useful website content',
  },
  'digital-marketing': {
    title: 'Choosing a practical marketing plan',
    answers: [
      ['Which channels can the plan cover?', 'Social media content, Google Ads, Meta Ads and search-focused content. We choose the channels around your customers, offer, budget and the enquiries your team can handle.'],
      ['Is advertising spend included?', 'Advertising spend and agency work are listed separately. Landing-page changes, content responsibilities and any paid tools are confirmed in the proposal.'],
      ['How should progress be measured?', 'Review enquiries, lead quality and the actions visitors take alongside reach and clicks. Agree what counts as a useful enquiry before a campaign begins.'],
    ],
    href: '/google-ads', label: 'Explore Google Ads planning and management',
  },
};

export default function ServiceBrief({ slug }) {
  const brief = briefs[slug];
  if (!brief) return null;
  const external = brief.href.startsWith('https://');
  return <section className="bg-surface border-y border-outline/50 py-8 sm:py-12" aria-label={`${slug} planning answers`}>
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
      <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">{brief.title}</h2>
      <dl className="max-w-4xl space-y-5">
        {brief.answers.map(([question, answer]) => <div key={question} className="grid sm:grid-cols-[minmax(180px,1fr)_2fr] gap-2 sm:gap-7">
          <dt className="font-semibold text-on-surface">{question}</dt>
          <dd className="leading-relaxed text-main-text">{answer}</dd>
        </div>)}
      </dl>
      <Link href={brief.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="inline-flex min-h-11 mt-6 items-center font-semibold text-primary underline underline-offset-4">{brief.label}</Link>
    </div>
  </section>;
}
