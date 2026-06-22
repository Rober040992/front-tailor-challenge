import type { NextConfig } from "next";

const backendApiUrl = process.env.BACKEND_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendApiUrl) {
      throw new Error("Missing BACKEND_API_URL environment variable.");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
