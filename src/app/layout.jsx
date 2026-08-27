import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import CookieBanner from '@/components/CookieBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import Preloader from '@/components/Preloader';

export const metadata = {
  title: 'Infronix Web Agency',
  description: 'Designing digital brilliance, high-converting web applications, and technical innovation for modern brands.',
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
              "url": "https://infronix.agency/",
              "logo": "https://infronix.agency/hero_bg.webp",
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
              "url": "https://infronix.agency/"
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
