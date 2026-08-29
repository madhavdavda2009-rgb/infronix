import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import CookieBanner from '@/components/CookieBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import Preloader from '@/components/Preloader';

export const metadata = {
  metadataBase: new URL('https://www.infronixweb.in/'),
  title: {
    default: 'Infronix Web Agency | Web Development, SEO & AI Automation',
    template: '%s | Infronix Web Agency'
  },
  description: 'Designing digital brilliance, high-converting web applications, and technical innovation for modern brands in Ahmedabad, Gujarat, and across India.',
  icons: {
    icon: '/title-logo1.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Infronix",
              "url": "https://www.infronixweb.in/",
              "logo": "https://www.infronixweb.in/hero_bg.webp",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-6355792936",
                "contactType": "customer service"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Infronix Web Agency",
              "url": "https://www.infronixweb.in/"
            })
          }}
        />
      </head>
      <body>
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
      </body>
    </html>
  );
}
