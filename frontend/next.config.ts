import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for Vercel deployment
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],

  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://manga-gen-api.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
