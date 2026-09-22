export default function manifest() {
  return {
    name: 'InfronixWeb Digital Marketing',
    short_name: 'InfronixWeb',
    description: 'Build, grow and automate with InfronixWeb in Ahmedabad: websites, SEO, digital marketing, advertising and business automation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080c14',
    theme_color: '#00d2ff',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
