import { type NextConfig } from "next";
import "./src/env";

const config: NextConfig = {
  reactStrictMode: true,
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
