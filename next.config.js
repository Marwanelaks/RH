/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for development
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,  // Enable polling for file changes
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;