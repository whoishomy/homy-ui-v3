/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'app.homy.health'],
    // Enable static image optimization
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Environment variables that should be available to the client
  env: {
    SCREENSHOTS_DIR: process.env.SCREENSHOTS_DIR || 'docs/screenshots',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  // Enable static exports for Vercel
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
