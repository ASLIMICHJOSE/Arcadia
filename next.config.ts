import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Force worker threads for PostCSS in Turbopack
    turbopackPluginRuntimeStrategy: "forceWorkerThreads" as any,
  },
};

export default nextConfig;
