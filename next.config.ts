import { type NextConfig } from "next";
import "./src/env.js";

const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    reactCompiler: true,
    inlineCss: true,
  },
};

export default config;
