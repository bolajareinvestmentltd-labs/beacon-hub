import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local phone IP to connect to the dev server
  allowedDevOrigins: ['192.168.43.104'],
};

export default nextConfig;
