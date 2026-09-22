import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceDetails from '@/components/ServiceDetails';
import { getService } from '@/lib/services';

export default function ServiceLanding({ slug }) {
  const service = getService(slug);
  return <main id="main-content" className="w-full pt-20 sm:pt-28 md:pt-32">
    <section className="bg-surface-container-lowest py-12 sm:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <Breadcrumb />
        <p className="text-primary text-sm uppercase tracking-widest mt-6 mb-4">{service.pillar} · {service.name} · Ahmedabad</p>
        <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-6xl leading-tight mb-6">{service.heading}</h1>
        <p className="max-w-2xl text-lg leading-relaxed">{service.intro}</p>
        <Link href={`/start-project?service=${encodeURIComponent(service.name)}`} className="inline-flex mt-8 px-6 py-3.5 bg-primary text-white rounded-md hover:bg-primary-dark">Discuss your project</Link>
      </div>
    </section>
    <section className="py-12 sm:py-16 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-2xl sm:text-3xl mb-6">What we can help with</h2>
        <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4">{service.includes.map(item => <li key={item} className="py-4 border-b border-outline-variant leading-relaxed">{item}</li>)}</ul>
        <p className="mt-6 text-sm text-text-light">Your proposal defines the deliverables, access requirements, costs and support included in the agreed scope.</p>
      </div>
    </section>
    <ServiceDetails slug={slug} />
  </main>;
}
