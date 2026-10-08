/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'assets.shopsphere.com', 'placehold.co'],
  },
};

module.exports = nextConfig;
