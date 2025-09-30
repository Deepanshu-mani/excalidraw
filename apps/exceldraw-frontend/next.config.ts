import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from project root
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/ui"],
  
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Optimize build
  output: "standalone",
};

export default nextConfig;
