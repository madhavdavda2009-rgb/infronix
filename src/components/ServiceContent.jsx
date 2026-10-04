import Link from 'next/link';
import { serviceContent } from '@/lib/service-content';

export default function ServiceContent({ slug }) {
  const content = serviceContent[slug];
  if (!content) return null;
  return <>{content.sections.map(section => <section key={section.heading} className="py-12 sm:py-16 bg-surface border-b border-outline-variant/40">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
      <h2 className="text-2xl sm:text-3xl mb-5">{section.heading}</h2>
      <div className="max-w-3xl space-y-4 leading-relaxed">{section.paragraphs?.map(p => <p key={p}>{p}</p>)}</div>
      {section.items && <ul className="max-w-3xl mt-5 list-disc pl-5 space-y-3 leading-relaxed">{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.links && <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">{section.links.map(([href, label]) => <li key={href}><Link href={href} className="text-primary underline underline-offset-4 leading-relaxed">{label}</Link></li>)}</ul>}
    </div>
  </section>)}{content.guides && <aside className="bg-surface px-4 sm:px-6 md:px-12 py-8 max-w-[1280px] mx-auto"><h2 className="text-xl mb-3">Before you start</h2>{content.guides.map(([href, label]) => <Link key={href} href={href} className="text-primary underline underline-offset-4">{label}</Link>)}</aside>}</>;
}
