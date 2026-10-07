/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', 'pg'],
  compress: true,
  async redirects() {
    return ['ai-automation', 'ai-chatbot', 'whatsapp-automation', 'crm-automation'].map(slug => ({
      source: '/' + slug, destination: '/services', permanent: true,
    }));
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
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
