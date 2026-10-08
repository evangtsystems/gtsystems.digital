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
      { protocol: "https", hostname: "aeolinavillas.com", pathname: "/images/**" },
      { protocol: "https", hostname: "anthisconstructions.com", pathname: "/images/**" },
      { protocol: "https", hostname: "groupenergy.gr", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "tzevenos.gr", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "corfu-malibu.gr", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "corfu-hotel-margarita.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.expressservicecorfu.gr", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "ionianems.com", pathname: "/images/**" },
      { protocol: "https", hostname: "holidaysweetmemories.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "theocomplex.com", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
