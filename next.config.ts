import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // to display RSS feeds' images. someday another domain might be required
      {
        protocol: "https",
        hostname: "umamusume-umapyoi.com",
      },
      {
        protocol: "https",
        hostname: "uma-log.net",
      },
      {
        protocol: "https",
        hostname: "livedoor.blogimg.jp",
      },
      {
        protocol: "https",
        hostname: "agemasen.com",
      },
      {
        protocol: "https",
        hostname: "www.keiba.jp"
      }
    ]
  }
};

export default nextConfig;
