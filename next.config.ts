import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: usually a fifth to a third smaller than WebP for the same
    // look. Browsers that can't show it are sent WebP instead.
    formats: ["image/avif", "image/webp"],
    // Next's default widths jump from 2048 straight to 3840, so a hero shown
    // 1060-1440px wide on a 2x screen was sent 3840px wide. 2560 and 2880
    // fill that gap.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 2880, 3840],
  },
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
