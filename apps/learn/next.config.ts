import type { NextConfig } from "next";

const PRODUCTION_API = "https://bnske.budgetndiostory.org";

function apiProxyTarget(): string {
  const raw =
    process.env.API_PROXY_TARGET ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    PRODUCTION_API;
  return raw.replace(/\/+$/, "");
}

function contentSecurityPolicy(): string {
  const localApiConnect =
    process.env.NODE_ENV === "development"
      ? " http://localhost:8000 http://127.0.0.1:8000"
      : "";
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    `connect-src 'self' https://bnske.budgetndiostory.org https://*.budgetndiostory.org${localApiConnect}`,
    "media-src 'self' https://res.cloudinary.com blob: data:",
    "frame-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.78', 'localhost', '127.0.0.1'],
  reactCompiler: true,
  trailingSlash: true,

  compress: true,
  poweredByHeader: false,

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
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

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
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy(),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  async rewrites() {
    const target = apiProxyTarget();
    return [
      {
        source: "/api/v1/:path*/",
        destination: `${target}/api/v1/:path*/`,
      },
      {
        source: "/api/gamification/:path*/",
        destination: `${target}/api/gamification/:path*/`,
      },
      {
        source: "/api/newsletter/:path*/",
        destination: `${target}/api/v1/newsletter/:path*/`,
      },
      {
        source: "/api/forex/:path*/",
        destination: `${target}/api/forex/:path*/`,
      },
      {
        source: "/api/hub/:path*/",
        destination: `${target}/api/hub/:path*/`,
      },
      {
        source: "/api/public/:path*/",
        destination: `${target}/api/public/:path*/`,
      },
    ];
  },
};

export default nextConfig;
