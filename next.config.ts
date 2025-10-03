import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  // Disable body parser for API routes to handle file uploads
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
