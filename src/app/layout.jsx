import MotionPreferences from '@/components/MotionPreferences';
import { pageMetadata, SITE_URL, serializeJsonLd } from '@/lib/site-seo';
import './globals.css';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { IntroProvider } from '@/context/IntroContext';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';
import { Inter, Outfit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

const WhatsAppWidget = dynamic(() => import('@/components/WhatsAppWidget'));
const CookieBanner = dynamic(() => import('@/components/CookieBanner'));

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500'],
  display: 'swap'
});

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  weight: ['100', '200', '300', '400', '500'],
  display: 'swap'
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  ...pageMetadata('Digital Marketing, Websites & AI Automation Agency in Ahmedabad', 'InfronixWeb is a digital agency in Ahmedabad helping businesses with website development, SEO, digital marketing, advertising and AI automation solutions.'),
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-T99V9E650K';

  return (
    <html lang="en">
      <head>
        {/* Unified LocalBusiness, ProfessionalService & WebSite JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'InfronixWeb', url: SITE_URL,
                  logo: SITE_URL + '/web-logo.webp', description: 'An Ahmedabad-based digital agency helping businesses build, grow and automate their digital presence.',
                  telephone: '+91-6355792936', email: 'support@infronixweb.in',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Shree Eklingji Residency 2',
                    addressLocality: 'Sanand, Ahmedabad',
                    addressRegion: 'Gujarat',
                    postalCode: '382110',
                    addressCountry: 'IN'
                  },
                  areaServed: { '@type': 'City', name: 'Ahmedabad' },
                  sameAs: ['https://www.instagram.com/infronixwebagency2026', 'https://github.com/madhavdavda2009-rgb'] },
                { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL, name: 'InfronixWeb', publisher: { '@id': SITE_URL + '/#organization' } }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[var(--color-light-bg)] text-[var(--color-deep-space)] antialiased`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <MotionPreferences><IntroProvider>
          <Preloader />
          <ErrorBoundary>
            <ToastProvider>
              <SmoothScroll>
                <div className="flex flex-col min-h-screen relative">
                  <Header />
                  <div className="flex-grow">
                    {children}
                  </div>
                  <Footer />
                  <WhatsAppWidget />
                  <CookieBanner />
                </div>
              </SmoothScroll>
            </ToastProvider>
          </ErrorBoundary>
        </IntroProvider></MotionPreferences>
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
