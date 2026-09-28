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
import { Inter, Outfit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

const WhatsAppWidget = dynamic(() => import('@/components/WhatsAppWidget'));
const CookieBanner = dynamic(() => import('@/components/CookieBanner'));

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
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
                { 
                  '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'], 
                  '@id': SITE_URL + '/#organization', 
                  name: 'InfronixWeb', 
                  url: SITE_URL,
                  logo: SITE_URL + '/web-logo.webp', 
                  image: SITE_URL + '/opengraph-image.webp',
                  description: 'An Ahmedabad-based digital agency helping businesses build high-performance web applications, scale search visibility with SEO, manage digital ads, and automate operations.',
                  telephone: '+91-6355792936', 
                  email: 'support@infronixweb.in',
                  priceRange: '₹₹',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Shree Eklingji Residency 2',
                    addressLocality: 'Sanand, Ahmedabad',
                    addressRegion: 'Gujarat',
                    postalCode: '382110',
                    addressCountry: 'IN'
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 22.9868,
                    longitude: 72.3814
                  },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                      opens: '09:00',
                      closes: '19:00'
                    }
                  ],
                  areaServed: [
                    { '@type': 'City', name: 'Ahmedabad' },
                    { '@type': 'State', name: 'Gujarat' },
                    { '@type': 'Country', name: 'India' }
                  ],
                  sameAs: [
                    'https://www.instagram.com/infronixwebagency2026', 
                    'https://github.com/madhavdavda2009-rgb'
                  ] 
                },
                { 
                  '@type': 'WebSite', 
                  '@id': SITE_URL + '/#website', 
                  url: SITE_URL, 
                  name: 'InfronixWeb', 
                  publisher: { '@id': SITE_URL + '/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/blog?search={search_term_string}`
                    },
                    'query-input': 'required name=search_term_string'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[var(--color-light-bg)] text-[var(--color-deep-space)] antialiased`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <MotionPreferences>
          <IntroProvider>
            <Preloader />
            <ErrorBoundary>
              <ToastProvider>
                <div className="flex flex-col min-h-screen relative">
                  <Header />
                  <div className="flex-grow">
                    {children}
                  </div>
                  <Footer />
                  <WhatsAppWidget />
                  <CookieBanner />
                </div>
              </ToastProvider>
            </ErrorBoundary>
          </IntroProvider>
        </MotionPreferences>
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
