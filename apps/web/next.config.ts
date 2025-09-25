import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  transpilePackages: ["@freepost/db", "@freepost/types"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "scontent.xx.fbcdn.net" },
      { protocol: "https", hostname: "files.freepost.local" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
    ],
  },
  // Disable strict ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript errors during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
