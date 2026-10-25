import Link from 'next/link';
import { pageMetadata } from '@/lib/site-seo';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import { WEBSITE_PACKAGES, PRICING_ADDONS, PRICING_NOT_INCLUDED, PAYMENT_TERMS, formatInr } from '@/lib/pricing';
import { CheckCircle, ArrowRight, Plus, XCircle, Megaphone, GoogleLogo, MetaLogo, ChartLineUp, OpenAiLogo } from '@phosphor-icons/react/dist/ssr';

export const metadata = pageMetadata(
  'Website Pricing – Starting at ₹10,000',
  'Transparent website pricing from InfronixWeb, Ahmedabad. Business websites start at ₹10,000 with clear add-on prices. Digital marketing is quoted after a free call.',
  '/pricing'
);

export default function PricingPage() {
  return (
    <main className="w-full pt-20 sm:pt-28 md:pt-32" id="main-content">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-4 sm:pt-6">
        <Breadcrumb />
      </div>

      {/* Intro */}
      <section className="pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 text-center">
          <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Pricing</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-on-surface leading-tight tracking-tight">
            Websites starting at <span className="text-primary">₹10,000.</span>
          </h1>
          <p className="text-base sm:text-lg text-main-text max-w-2xl mx-auto mt-5 leading-relaxed">
            Simple, transparent pricing. Pick a package, add only what your business needs, and know the full cost before we start.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section aria-label="Website packages" className="pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {WEBSITE_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-3xl p-7 sm:p-8 bg-surface-container-lowest border transition-shadow ${
                  pkg.popular ? 'border-primary shadow-xl shadow-primary/10 lg:-mt-4 lg:mb-4' : 'border-outline shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold tracking-wide whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-on-surface">{pkg.name}</h2>
                <p className="text-sm text-main-text mt-2 leading-relaxed min-h-[2.75rem]">{pkg.tagline}</p>

                <div className="mt-6 mb-6 pb-6 border-b border-outline">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-text-light mb-1">{pkg.priceNote === 'starting' ? 'Starting at' : 'One-time'}</span>
                  <span className="text-4xl sm:text-5xl font-heading font-bold text-on-surface">{formatInr(pkg.price)}</span>
                </div>

                <ul className="space-y-3 flex-1">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-main-text leading-relaxed">
                      <CheckCircle size={18} weight="fill" className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/start-project?package=${pkg.id}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all ${
                    pkg.popular
                      ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25'
                      : 'bg-surface text-on-surface border border-outline hover:border-primary/50'
                  }`}
                >
                  Get a Quote <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm text-text-light mt-8">All prices are in Indian Rupees. Your final quote is shared in writing before any work begins.</p>
        </div>
      </section>

      {/* Add-ons */}
      <section aria-labelledby="addons-heading" className="py-16 sm:py-24 bg-surface border-y border-outline/50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-light mb-3 sm:mb-4">Add-ons</span>
              <h2 id="addons-heading" className="text-2xl sm:text-4xl font-heading font-bold text-on-surface leading-tight">
                Need more? <span className="text-primary">Add only what you need.</span>
              </h2>
              <p className="text-sm sm:text-base text-main-text mt-3 mb-8 max-w-xl leading-relaxed">
                Every extra has a fixed price, so your quote grows only with your requirements.
              </p>

              <div className="rounded-2xl border border-outline bg-surface-container-lowest overflow-hidden">
                <table className="w-full text-sm">
                  <caption className="sr-only">Website add-on prices</caption>
                  <thead>
                    <tr className="bg-primary/5 text-left">
                      <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary">Add-on</th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING_ADDONS.map(addon => (
                      <tr key={addon.name} className="border-t border-outline">
                        <td className="px-5 py-3.5 text-main-text">
                          <span className="inline-flex items-start gap-2"><Plus size={14} weight="bold" className="text-primary mt-1 shrink-0" aria-hidden="true" />{addon.name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-on-surface whitespace-nowrap">{addon.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 lg:pt-14">
              <div className="rounded-2xl border border-outline bg-surface-container-lowest p-6 sm:p-7">
                <h3 className="text-lg font-heading font-bold text-on-surface mb-4">Payment terms</h3>
                <ol className="space-y-4">
                  {PAYMENT_TERMS.map(term => (
                    <li key={term.label} className="flex items-center gap-4">
                      <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-heading font-bold text-lg flex items-center justify-center shrink-0">{term.label}</span>
                      <span className="text-sm text-main-text leading-relaxed">{term.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-outline bg-surface-container-lowest p-6 sm:p-7">
                <h3 className="text-lg font-heading font-bold text-on-surface mb-4">Not included in packages</h3>
                <ul className="space-y-2.5">
                  {PRICING_NOT_INCLUDED.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-main-text leading-relaxed">
                      <XCircle size={18} className="text-text-light shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-text-light mt-4">These can be added from the list on the left.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital marketing: quoted after a call */}
      <section aria-labelledby="marketing-pricing-heading" className="py-16 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="rounded-3xl bg-on-surface text-white p-8 sm:p-12 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/60 mb-3 sm:mb-4">Digital Marketing</span>
              <h2 id="marketing-pricing-heading" className="text-2xl sm:text-4xl font-heading font-bold leading-tight text-white">
                Google, Meta &amp; ChatGPT Ads: <span className="text-violet-300">custom pricing.</span>
              </h2>
              <p className="text-sm sm:text-base text-white/75 mt-4 leading-relaxed max-w-xl">
                Every business, budget and goal is different. We understand your business on a free call first, then share a clear plan and quote.
              </p>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-2 bg-white text-on-surface font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl hover:bg-violet-50 transition-colors">
                Book a free call <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/google-ads', label: 'Google Ads', icon: GoogleLogo },
                { href: '/meta-ads', label: 'Meta Ads', icon: MetaLogo },
                { href: '/chatgpt-ads', label: 'ChatGPT Ads', icon: OpenAiLogo },
                { href: '/digital-marketing', label: 'Digital Marketing', icon: Megaphone },
                { href: '/seo', label: 'SEO', icon: ChartLineUp },
              ].map(item => (
                <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] px-5 py-4 transition-colors">
                  <item.icon size={22} weight="duotone" className="text-violet-300 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm sm:text-base text-white">{item.label}</span>
                    <span className="text-xs text-white/50 group-hover:text-white/80">Quote on call</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
