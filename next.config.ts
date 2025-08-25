import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      root: __dirname,
    }
  },
  // Three.js 최적화
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'three': 'three'
    });
    return config;
  },
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
