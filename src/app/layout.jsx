import './globals.css';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';

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
  metadataBase: new URL('https://www.infronixweb.in/'),
  title: {
    default: 'InfronixWeb Digital Marketing | Web Development, SEO, Digital Marketing & AI Automation',
    template: '%s | InfronixWeb Digital Marketing'
  },
  description: 'InfronixWeb Digital Marketing is Ahmedabad\'s premier agency. We engineer high-converting websites, Next.js web applications, Google #1 SEO, Social Media Marketing, Paid Ads (Meta & Google), and custom AI Automations across India.',
  keywords: [
    'InfronixWeb Digital Marketing',
    'Best Web Agency in Ahmedabad',
    'Web Development Company in Ahmedabad',
    'Digital Marketing Agency Ahmedabad',
    'Social Media Marketing Ahmedabad',
    'Paid Advertising Agency Google Meta Ads',
    'Best Web Design Agency in Ahmedabad',
    'Website Development Services in Gujarat',
    'Top Digital Agency Ahmedabad',
    'Local SEO Agency in Ahmedabad',
    'Technical SEO Services India',
    'Custom Web Application Development India',
    'AI Automation Agency India',
    'Next.js Web Development Agency',
    'E-commerce Website Development Ahmedabad',
    'Performance Marketing Agency India'
  ],
  alternates: {
    canonical: 'https://www.infronixweb.in/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.infronixweb.in/',
    siteName: 'InfronixWeb Digital Marketing',
    title: 'InfronixWeb Digital Marketing | Web Development, SEO, Digital Marketing & AI Automation',
    description: 'Premier Digital Agency in Ahmedabad. We specialize in custom Website Development, Technical SEO, Social Media Marketing, Meta & Google Paid Ads, and AI Automation.',
    images: [
      {
        url: 'https://www.infronixweb.in/opengraph-image.webp',
        width: 1200,
        height: 630,
        alt: 'InfronixWeb Digital Marketing - Websites, SEO, Digital Marketing & AI Automation',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfronixWeb Digital Marketing | Web Development, SEO, Digital Marketing & AI Automation',
    description: 'Premier Digital Agency in Ahmedabad. Custom Website Development, Technical SEO, Social Media & Paid Ads, and AI Automation.',
    images: ['https://www.infronixweb.in/opengraph-image.webp'],
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-T99V9E650K';

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
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
                  "name": "InfronixWeb Digital Marketing",
                  "alternateName": "InfronixWeb Digital & Web Development Agency",
                  "url": "https://www.infronixweb.in/",
                  "logo": "https://www.infronixweb.in/favicon.ico",
                  "image": "https://www.infronixweb.in/web-logo.png",
                  "description": "InfronixWeb Digital Marketing is a premier agency based in Ahmedabad, Gujarat, offering custom web development, technical SEO, social media marketing, paid advertising, and AI workflow automation across India.",
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
                    "https://www.instagram.com/infronixwebagency2026",
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
                          "name": "Digital Marketing & Paid Ads",
                          "description": "Targeted Social Media Marketing, Meta Ads (Facebook & Instagram), Google Search & Display Ads, and ROI performance campaigns."
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
                  "name": "InfronixWeb Digital Marketing",
                  "publisher": {
                    "@id": "https://www.infronixweb.in/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[var(--color-light-bg)] text-[var(--color-deep-space)] antialiased`}>
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
