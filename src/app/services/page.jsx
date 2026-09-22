import Breadcrumb from '@/components/Breadcrumb';
import ServiceDirectory from '@/components/ServiceDirectory';
import Link from 'next/link';
import { pageMetadata } from '@/lib/site-seo';
export const metadata = pageMetadata('Website, Marketing & Automation Services in Ahmedabad', 'Explore InfronixWeb services across Build, Grow and Automate: websites, SEO, digital marketing, advertising, AI chatbots and business workflows.', '/services');
export default function ServicesPage() {
  return <main id="main-content" className="pt-28 sm:pt-36 pb-16 bg-surface-container-lowest">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
      <Breadcrumb />
      <h1 className="text-3xl sm:text-5xl md:text-6xl max-w-3xl leading-tight mt-6 mb-6">Build, grow and automate with one digital agency.</h1>
      <p className="text-lg max-w-2xl leading-relaxed mb-12">Based in Ahmedabad, InfronixWeb helps businesses create their online presence, reach customers and simplify repetitive work. Start with the service that solves your next business problem.</p>
      <ServiceDirectory />
      <div className="border-t border-outline-variant mt-12 pt-8"><h2 className="text-2xl mb-4">Not sure where to start?</h2><p className="mb-6">Tell us what you want to improve and what you already use. We will help define a practical scope.</p><Link href="/start-project" className="inline-flex px-6 py-3.5 bg-primary text-white rounded-md">Discuss your project</Link></div>
    </div>
  </main>;
}
