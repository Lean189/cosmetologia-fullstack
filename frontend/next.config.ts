import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // any experimental options
  },
  // Ensure we can use local API routes correctly
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
      ? '/api/'
      : 'http://localhost:3000/api/',
  },
};

export default nextConfig;
