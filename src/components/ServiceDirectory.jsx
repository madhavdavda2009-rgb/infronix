import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { services } from '@/lib/services';

const pillars = [
  {
    pillar: 'Build',
    heading: 'Establish authority with bespoke digital architecture.',
    description: 'Websites, web applications, and custom platforms engineered to help customers understand your offer and take high-value action.',
  },
  {
    pillar: 'Grow',
    heading: 'Reach targeted buyers with measurable intent.',
    description: 'Organic search optimization, technical SEO, and conversion-focused paid advertising aligned with your market opportunities.',
  },
  {
    pillar: 'Automate',
    heading: 'Eliminate repetitive workflows & scale capacity.',
    description: 'Practical automation pipelines for lead intake, WhatsApp responses, and CRM synchronization scoped around your tech stack.',
  },
];

export default function ServiceDirectory({ compact = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {pillars.map(({ pillar, heading, description }) => (
        <div 
          key={pillar} 
          className="border-t-2 border-primary/20 pt-6 flex flex-col justify-between group hover:border-primary transition-colors"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
              Core Pillar
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-2">
              {pillar}
            </h2>
            <p className="text-base sm:text-lg text-on-surface font-medium mb-3 leading-snug">
              {heading}
            </p>
            {!compact && (
              <p className="text-xs sm:text-sm text-text-light leading-relaxed mb-5">
                {description}
              </p>
            )}
          </div>

          <ul className="space-y-1.5 pt-2 border-t border-outline/60">
            {services
              .filter((service) => service.pillar === pillar && service.name !== 'Paid Advertising')
              .map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/${service.slug}`}
                    className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-main-text hover:text-primary transition-colors group/link"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/link:bg-primary transition-colors" />
                    <span>{service.name}</span>
                    <ArrowRight size={12} weight="bold" className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
