import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve URLs published by the old Webflow site.
  async redirects() {
    return [
      { source: "/Play", destination: "/play", permanent: true },
      { source: "/work/quorum_bio", destination: "/work/quorum-bio", permanent: true },
    ];
  },
};

export default nextConfig;
