import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles the app plus only the dependencies it actually uses into
  // .next/standalone, so the Docker image doesn't need node_modules.
  // Vercel ignores this — it only matters for the container build.
  output: "standalone",
};

export default nextConfig;
