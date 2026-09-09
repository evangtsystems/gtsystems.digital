import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gtsystems.gr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "gtsystems.gr",
        pathname: "/gts*.gif",
      },
      {
        protocol: "https",
        hostname: "rbs.gr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "megasoft.gr",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "techzone.bitdefender.com",
        pathname: "/en/image/**",
      },
    ],
  },
};

export default nextConfig;
