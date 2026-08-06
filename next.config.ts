import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local phone IP to connect to the dev server
  allowedDevOrigins: ['192.168.43.104'],
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy to mitigate XSS and data exfiltration
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';" },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // XSS protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy (restrict powerful features)
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          // HSTS (strict transport security)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  
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
      
      // NOTE: wildcard host removed for security. Add specific hosts above if needed.
    ],
  },
};

export default nextConfig;
