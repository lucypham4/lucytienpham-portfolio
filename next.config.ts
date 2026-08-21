import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve URLs published by the old Webflow site.
  //
  // Only paths that differ by more than case belong here — `source` is matched
  // case-insensitively, so case-only renames would redirect to themselves in a
  // loop. Those live in src/middleware.ts instead.
  async redirects() {
    return [
      {
        source: "/work/quorum_bio",
        destination: "/work/quorum-bio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
