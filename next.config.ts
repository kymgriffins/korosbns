import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  trailingSlash: true,

  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.budgetndiostory.org',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Bundle analyzer (enable with ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      // Add bundle analyzer only when needed
      return config;
    },
  }),

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.budgetndiostory.org",
          },
        ],
        destination: "https://budgetndiostory.org/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "budgetndiostory.org",
          },
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://budgetndiostory.org/:path*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://bnske.budgetndiostory.org/api/v1/:path*",
      },
      {
        source: "/api/trivia/:path*",
        destination: "https://bnske.budgetndiostory.org/api/trivia/:path*",
      },
      {
        source: "/api/gamification/:path*",
        destination: "https://bnske.budgetndiostory.org/api/gamification/:path*",
      },
      {
        source: "/api/newsletter/:path*",
        destination: "https://bnske.budgetndiostory.org/api/newsletter/:path*",
      },
      {
        source: "/api/forex/:path*",
        destination: "https://bnske.budgetndiostory.org/api/forex/:path*",
      },
      {
        source: "/api/hub/:path*",
        destination: "https://bnske.budgetndiostory.org/api/hub/:path*",
      },
    ];
  },
};

export default nextConfig;
