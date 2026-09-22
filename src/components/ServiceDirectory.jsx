import Link from 'next/link';
import { services } from '@/lib/services';

const pillars = [
  ['Build', 'Make your business clear online.', 'Websites, stores and applications that help customers understand your offer and take the next step.'],
  ['Grow', 'Reach people with a reason to choose you.', 'Search, content, social media and advertising connected to your audience and business goals.'],
  ['Automate', 'Give your team more time for customers.', 'Practical workflows for enquiries, support and follow-ups, scoped around the tools you use.'],
];
export default function ServiceDirectory({ compact = false }) {
  return <div className="grid md:grid-cols-3 gap-8 md:gap-12">
    {pillars.map(([pillar, heading, description]) => <div key={pillar} className="border-t border-outline-variant pt-6">
      <h2 className="text-primary text-2xl sm:text-3xl mb-3">{pillar}</h2>
      <p className="text-lg mb-3">{heading}</p>
      {!compact && <p className="text-sm leading-relaxed mb-5">{description}</p>}
      <ul className="space-y-1">{services.filter(service => service.pillar === pillar && service.name !== 'Paid Advertising').map(service => <li key={service.slug}><Link href={`/${service.slug}`} className="inline-flex items-center min-h-11 text-on-surface hover:text-primary underline underline-offset-4 decoration-outline-variant">{service.name}</Link></li>)}</ul>
    </div>)}
  </div>;
}
