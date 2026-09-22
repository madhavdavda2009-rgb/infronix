/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', 'pg'],
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'lenis', 'framer-motion', '@next/third-parties'],
  },
  images: {
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
