import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode double-rendering to double development & rendering speed
  reactStrictMode: false,

  // Speed up compilation by direct module tree-shaking on heavy icon & animation libraries
  experimental: {
    turbopackPluginRuntimeStrategy: "forceWorkerThreads" as any,
    cpus: 1,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Image optimization settings for instant asset rendering
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL || "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
