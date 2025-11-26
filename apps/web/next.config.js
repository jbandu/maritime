/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@maritime-crew-system/ui", "@maritime-crew-system/database"],
  // Railway deployment configuration
  output: 'standalone',
  images: {
    domains: ['ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

module.exports = nextConfig;
