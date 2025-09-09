import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from project root
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
