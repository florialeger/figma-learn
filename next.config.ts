import type { NextConfig } from "next";
import path from "path";

export default function config(): NextConfig {
  return {
    reactStrictMode: true,
    // Use a dedicated dist dir to avoid conflicts with stale/externally cleaned .next artifacts.
    distDir: ".next-runtime",
    outputFileTracingRoot: path.join(__dirname),
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      ],
    },
  };
}
