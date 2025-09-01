/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for static export if needed
  output: 'standalone',
  
  // Configure images for production
  images: {
    domains: [],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here if needed
    return config;
  },
}

module.exports = nextConfig