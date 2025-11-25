/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@maritime-crew-system/ui", "@maritime-crew-system/database"],
};

module.exports = nextConfig;
