import type { NextConfig } from "next";
import path from "path";

export default function config(): NextConfig {
  return {
    reactStrictMode: true,
    distDir: ".next-runtime",
    outputFileTracingRoot: path.join(__dirname),
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      ],
    },
  };
}
