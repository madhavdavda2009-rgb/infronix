import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import CookieBanner from '@/components/CookieBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';

import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://www.infronixweb.in/'),
  title: {
    default: 'Infronix Web Agency | Best Web Development, SEO & AI Automation in Ahmedabad',
    template: '%s | Infronix Web Agency'
  },
  description: 'Infronix is a premier web agency in Ahmedabad, Gujarat. We engineer high-converting websites, Next.js web applications, technical SEO, and custom AI automations for modern brands across India.',
  keywords: [
    'Best Web Agency in Ahmedabad',
    'Web Development Company in Ahmedabad',
    'Best Web Design Agency in Ahmedabad',
    'Website Development Services in Gujarat',
    'Top Digital Agency Ahmedabad',
    'Local SEO Agency in Ahmedabad',
    'Technical SEO Services India',
    'Custom Web Application Development India',
    'AI Automation Agency India',
    'Next.js Web Development Agency',
    'E-commerce Website Development Ahmedabad',
    'Full-Stack Web Engineering Agency',
    'Infronix Web Agency'
  ],
  alternates: {
    canonical: 'https://www.infronixweb.in/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.infronixweb.in/',
    siteName: 'Infronix Web Agency',
    title: 'Infronix Web Agency | Best Web Development, SEO & AI Automation in Ahmedabad',
    description: 'Infronix is a premier web agency in Ahmedabad, Gujarat. We engineer high-converting websites, Next.js web applications, technical SEO, and custom AI automations for modern brands across India.',
    images: [
      {
        url: 'https://www.infronixweb.in/hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Infronix Web Agency - Best Web Development & SEO in Ahmedabad',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infronix Web Agency | Best Web Development, SEO & AI Automation in Ahmedabad',
    description: 'Infronix is a premier web agency in Ahmedabad, Gujarat. We engineer high-converting websites, Next.js web applications, technical SEO, and custom AI automations for modern brands across India.',
    images: ['https://www.infronixweb.in/hero_bg.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/title-logo1.webp', type: 'image/webp' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/title-logo1.webp',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 Script */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Unified LocalBusiness, ProfessionalService & WebSite JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["LocalBusiness", "ProfessionalService", "Organization"],
                  "@id": "https://www.infronixweb.in/#organization",
                  "name": "Infronix Web Agency",
                  "alternateName": "Infronix Digital & Web Development Agency",
                  "url": "https://www.infronixweb.in/",
                  "logo": "https://www.infronixweb.in/title-logo1.webp",
                  "image": "https://www.infronixweb.in/hero_bg.webp",
                  "description": "Infronix is a premier web agency based in Ahmedabad, Gujarat, offering custom web development, technical SEO, and AI workflow automation across India.",
                  "telephone": "+91-6355792936",
                  "email": "support@infronixweb.in",
                  "priceRange": "$$",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Sanand",
                    "addressLocality": "Ahmedabad",
                    "addressRegion": "Gujarat",
                    "postalCode": "382110",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 23.0225,
                    "longitude": 72.5714
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                      "opens": "09:00",
                      "closes": "20:00"
                    }
                  ],
                  "areaServed": [
                    { "@type": "City", "name": "Ahmedabad" },
                    { "@type": "State", "name": "Gujarat" },
                    { "@type": "Country", "name": "India" }
                  ],
                  "sameAs": [
                    "https://www.instagram.com/infronix_web_agency",
                    "https://github.com/madhavdavda2009-rgb"
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Web & Digital Solutions",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Custom Web Development",
                          "description": "Bespoke Next.js and React business websites, corporate portals, and e-commerce platforms."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Technical & Local SEO Optimization",
                          "description": "Data-driven SEO strategies, keyword ranking, and Google Search Console optimization for Ahmedabad and India businesses."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Automation & Chatbots",
                          "description": "Intelligent workflow automation, AI assistants, WhatsApp integrations, and automated lead capture."
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.infronixweb.in/#website",
                  "url": "https://www.infronixweb.in/",
                  "name": "Infronix Web Agency",
                  "publisher": {
                    "@id": "https://www.infronixweb.in/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="bg-[#F8FAFA] text-[#101416] antialiased">
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
      </body>
    </html>
  );
}
