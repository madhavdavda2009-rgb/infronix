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
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google';

const WhatsAppWidget = dynamic(() => import('@/components/WhatsAppWidget'));
const CookieBanner = dynamic(() => import('@/components/CookieBanner'));

const general = localFont({
  src: [
    { path: '../assets/fonts/GeneralSans-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/GeneralSans-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/GeneralSans-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/GeneralSans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-general', display: 'swap', adjustFontFallback: 'Arial',
});

const cabinet = localFont({
  src: '../assets/fonts/CabinetGrotesk-Variable.woff2', weight: '100 900',
  variable: '--font-cabinet', display: 'swap', adjustFontFallback: 'Arial',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  ...pageMetadata('Website Development, Digital Marketing & SEO Agency in Ahmedabad', 'InfronixWeb is a digital agency in Ahmedabad providing website development, digital marketing and SEO services.'),
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-T99V9E650K';

  return (
    <html lang="en" className={`${general.variable} ${cabinet.variable}`}>
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
                  logo: SITE_URL + '/brand-light.png',
                  image: SITE_URL + '/opengraph-image.webp',
                  description: 'An Ahmedabad-based digital agency helping businesses build websites, reach customers through Google and online advertising, and improve their search visibility.',
                  telephone: '+91-6355792936',
                  email: 'support@infronixweb.in',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Shree Eklingji Residency 2',
                    addressLocality: 'Sanand, Ahmedabad',
                    addressRegion: 'Gujarat',
                    postalCode: '382110',
                    addressCountry: 'IN'
                  },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                      opens: '09:00',
                      closes: '20:00'
                    }
                  ],
                  areaServed: [
                    { '@type': 'City', name: 'Ahmedabad' },
                    { '@type': 'State', name: 'Gujarat' },
                    { '@type': 'Country', name: 'India' }
                  ],
                  sameAs: [
                    'https://www.instagram.com/infronixwebagency2026',
                    'https://www.linkedin.com/company/infronixweb/'
                  ]
                },
                {
                  '@type': 'WebSite',
                  '@id': SITE_URL + '/#website',
                  url: SITE_URL,
                  name: 'InfronixWeb',
                  publisher: { '@id': SITE_URL + '/#organization' }
                }
              ]
            })
          }}
        />
      </head>
      <body className="bg-[var(--color-light-bg)] text-[var(--color-deep-space)] antialiased">
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
