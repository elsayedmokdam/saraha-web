import type { NextConfig } from "next";

// Where the Saraha API lives. Used to proxy uploaded files (avatars / attachments).
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    serverActions: {
      // The API accepts up to 20MB per file (conversation attachments) and 5 files per message.
      bodySizeLimit: "110mb",
    },
  },

  // The API serves uploads from `/assets/**` but helmet sends `Cross-Origin-Resource-Policy: same-origin`,
  // so the browser refuses to render them cross-origin. Proxying them through this app makes them same-origin.
  async rewrites() {
    return [{ source: "/media/:path*", destination: `${API_URL}/assets/:path*` }];
  },
};

export default nextConfig;
