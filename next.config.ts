import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local phone IP to connect to the dev server
  allowedDevOrigins: ['192.168.43.104'],
  
  images: {
    remotePatterns: [
      // GNews API image sources
      { protocol: 'https', hostname: '**.gstatic.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      
      // Common news CDN domains
      { protocol: 'https', hostname: '**.cdn.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.fastly.net' },
      { protocol: 'https', hostname: '**.akamaized.net' },
      
      // Major news outlets
      { protocol: 'https', hostname: '**.bbc.co.uk' },
      { protocol: 'https', hostname: '**.bbc.com' },
      { protocol: 'https', hostname: '**.cnn.com' },
      { protocol: 'https', hostname: '**.reuters.com' },
      { protocol: 'https', hostname: '**.apnews.com' },
      { protocol: 'https', hostname: '**.theguardian.com' },
      { protocol: 'https', hostname: '**.nytimes.com' },
      { protocol: 'https', hostname: '**.wsj.com' },
      
      // Generic wildcard for development flexibility
      { protocol: 'https', hostname: '*' },
    ],
  },
};

export default nextConfig;
