export const metadata = {
  title: 'Start a Project | Infronix Web Agency Ahmedabad',
  description: 'Submit your project requirements to Infronix Web Agency. Get a tailored proposal for custom web development, Next.js applications, technical SEO, and AI automation within 24 hours.',
  alternates: {
    canonical: 'https://www.infronixweb.in/start-project',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.infronixweb.in/start-project',
    siteName: 'Infronix Web Agency',
    title: 'Start a Project | Infronix Web Agency Ahmedabad',
    description: 'Submit your project requirements to Infronix Web Agency. Get a tailored proposal for custom web development, technical SEO, and AI automation within 24 hours.',
    images: [
      {
        url: 'https://www.infronixweb.in/hero_bg.webp',
        width: 1200,
        height: 630,
        alt: 'Start a Project with Infronix Web Agency',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a Project | Infronix Web Agency Ahmedabad',
    description: 'Submit your project requirements to Infronix Web Agency. Get a tailored proposal within 24 hours.',
    images: ['https://www.infronixweb.in/hero_bg.webp'],
  }
};

export default function StartProjectLayout({ children }) {
  return children;
}
