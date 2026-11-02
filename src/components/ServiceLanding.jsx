import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceDetails from '@/components/ServiceDetails';
import { enquiryHref, getService } from '@/lib/services';

export default function ServiceLanding({ slug }) {
  const service = getService(slug);
  return <main id="main-content" className="w-full pt-20 sm:pt-28 md:pt-32">
    <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] flex items-center bg-surface-container-lowest overflow-hidden border-b border-outline-variant/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-soft-violet rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#00F5D4]/20 rounded-full blur-[60px]" />
      </div>
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-5 sm:gap-6">
        <Breadcrumb />
        <div className="flex flex-col gap-3 sm:gap-4 max-w-4xl">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary">
            <span className="w-8 sm:w-12 h-[2px] bg-primary" /> {service.eyebrow || `${service.pillar} · ${service.name} · Ahmedabad`}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-on-surface leading-tight tracking-tight">{service.heading}</h1>
          <p className="text-base sm:text-lg md:text-xl text-main-text font-medium max-w-2xl leading-relaxed">{service.intro}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
          <Link href={enquiryHref(service)} className="inline-flex items-center justify-center bg-primary text-white font-semibold text-sm sm:text-base md:text-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:bg-primary-dark transition-colors">Discuss your project</Link>
        </div>
      </div>
    </section>
    <section className="py-12 sm:py-16 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-on-surface mb-6 leading-tight">{slug === 'google-ads' ? 'Search Ads, campaign setup and optimization' : 'What we can help with'}</h2>
        <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4">{service.includes.map(item => <li key={item} className="py-4 border-b border-outline-variant leading-relaxed text-main-text">{item}</li>)}</ul>
        <p className="mt-6 text-sm text-text-light">Your proposal defines the deliverables, access requirements, costs and support included in the agreed scope.</p>
      </div>
    </section>
    <ServiceDetails slug={slug} />
  </main>;
}
