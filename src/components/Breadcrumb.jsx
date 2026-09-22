"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretRight, House } from '@phosphor-icons/react';

const ROUTE_LABELS = {
  '': 'Home',
  'web-development': 'Web Development',
  'services': 'Services',
  'ai-chatbot': 'AI Chatbots',
  'crm-automation': 'CRM Automation',
  'whatsapp-automation': 'WhatsApp Automation',
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'performance-marketing': 'Performance Marketing',
  'seo': 'SEO Optimization',
  'ai-automation': 'AI Automation',
  'digital-marketing': 'Digital Marketing',
  'social-media-marketing': 'Social Media Marketing',
  'paid-advertising': 'Paid Advertising',
  'projects': 'Our Work',
  'about': 'About Us',
  'blog': 'Blog',
  'contact': 'Contact',
  'start-project': 'Start a Project',
  'privacy-policy': 'Privacy Policy',
  'terms-and-conditions': 'Terms & Conditions'
};

function formatSlug(slug) {
  if (ROUTE_LABELS[slug]) return ROUTE_LABELS[slug];
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumb({ className = "" }) {
  const pathname = usePathname() || '/';

  // Split path segments ignoring empty strings
  const segments = pathname.split('/').filter(Boolean);

  // If on home page
  if (segments.length === 0) {
    return null;
  }

  // Build breadcrumb trail based strictly on URL structure
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ];

  let accumulatedPath = '';
  segments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    breadcrumbs.push({
      label: formatSlug(segment),
      href: accumulatedPath
    });
  });

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-2 text-xs font-light text-text-light mb-4 ${className}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast) {
          return (
            <span
              key={crumb.href}
              className="text-primary font-normal"
              aria-current="page"
            >
              {crumb.label}
            </span>
          );
        }

        return (
          <div key={crumb.href} className="inline-flex items-center gap-2">
            <Link
              href={crumb.href}
              className="hover:text-primary transition-colors flex items-center gap-1 text-slate-500 hover:text-primary"
            >
              {index === 0 && <House size={12} className="text-slate-400" />}
              <span>{crumb.label}</span>
            </Link>
            <CaretRight size={10} className="text-slate-400/60" />
          </div>
        );
      })}
    </nav>
  );
}
