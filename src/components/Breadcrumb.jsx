"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretRight, House } from '@phosphor-icons/react';

const ROUTE_LABELS = {
  '': 'Home',
  'web-development': 'Web Development',
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
    return (
      <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs font-semibold text-text-light mb-4 ${className}`}>
        <span className="inline-flex items-center gap-1.5 text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
          <House size={13} weight="bold" />
          Home
        </span>
      </nav>
    );
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
    <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-2 text-xs font-semibold text-text-light mb-4 ${className}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast) {
          return (
            <span
              key={crumb.href}
              className="inline-flex items-center gap-1 text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20"
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
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              {index === 0 && <House size={13} weight="bold" className="text-text-light hover:text-primary" />}
              {crumb.label}
            </Link>
            <CaretRight size={12} weight="bold" className="text-text-light/60" />
          </div>
        );
      })}
    </nav>
  );
}
