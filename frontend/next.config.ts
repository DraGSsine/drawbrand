import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // This prevents the error with Konva by telling webpack
    // to use the browser version of Konva instead of the Node.js version
    config.resolve.alias = {
      ...config.resolve.alias,
      'konva': 'konva/konva',
    };
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      }
    ],
  },
};

export default nextConfig;
