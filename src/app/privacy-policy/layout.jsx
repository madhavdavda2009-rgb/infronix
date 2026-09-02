export const metadata = {
  title: 'Privacy Policy | Infronix Web Agency',
  description: 'Comprehensive Privacy Policy for Infronix Web Agency. Understand how we collect, use, process, and protect your information.',
  alternates: {
    canonical: 'https://www.infronixweb.in/privacy-policy',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.infronixweb.in/privacy-policy',
    siteName: 'Infronix Web Agency',
    title: 'Privacy Policy | Infronix Web Agency',
    description: 'Understand how Infronix Web Agency collects, uses, and safeguards client and visitor data.',
    images: [
      {
        url: 'https://www.infronixweb.in/hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Infronix Web Agency Privacy Policy',
      }
    ],
  },
};

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
