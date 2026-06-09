import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // faturas em PDF podem passar de 1MB (default das server actions)
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
