/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', 'pg'],
  compress: true,
  async redirects() {
    return [
      ...['ai-automation', 'ai-chatbot', 'whatsapp-automation', 'crm-automation'].map(slug => ({
        source: '/' + slug, destination: '/services', permanent: true,
      })),
      // Old client uploads were public files. Send those links through the login check.
      { source: '/uploads/portal/:name', destination: '/api/portal-files/:name', permanent: false },
    ];
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        // Stops other sites from framing our pages (clickjacking on login/admin screens).
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
      ],
    }];
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'framer-motion', '@next/third-parties'],
  },
  images: {
    localPatterns: [
      { pathname: '/**', search: '' },
      // Published team and article uploads use validated, versioned media URLs.
      { pathname: '/api/public/media' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    // Only our own image host goes through the server's optimizer. Allowing every host
    // let anyone make our server download any URL on the internet.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
