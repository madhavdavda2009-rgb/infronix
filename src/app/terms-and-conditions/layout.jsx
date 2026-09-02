export const metadata = {
  title: 'Terms and Conditions | Infronix Web Agency',
  description: 'Terms and Conditions governing the use of Infronix Web Agency services, custom web development, technical SEO, and AI automation.',
  alternates: {
    canonical: 'https://www.infronixweb.in/terms-and-conditions',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.infronixweb.in/terms-and-conditions',
    siteName: 'Infronix Web Agency',
    title: 'Terms and Conditions | Infronix Web Agency',
    description: 'Terms and Conditions governing the use of Infronix Web Agency services, web development, SEO, and AI automations.',
    images: [
      {
        url: 'https://www.infronixweb.in/hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Infronix Web Agency Terms and Conditions',
      }
    ],
  },
};

export default function TermsAndConditionsLayout({ children }) {
  return children;
}
