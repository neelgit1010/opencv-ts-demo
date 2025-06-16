import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    esmExternals: true,
  },
  webpack: (config) => {
    config.experiments = config.experiments || {};
    config.experiments.asyncWebAssembly = true;
    config.experiments.topLevelAwait = true;
    return config;
  },
};

export default nextConfig;
