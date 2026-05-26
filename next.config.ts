import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

export const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/file/anilistcdn/**",
      },
      {
        protocol: "https",
        hostname: "img1.ak.crunchyroll.com",
      },
      {
        protocol: "https",
        hostname: "myanimelist.net",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "pratyush-pragyey",
  project: "javascript-nextjs",
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  tunnelRoute: "/sentry-tunnel",
});

