import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
