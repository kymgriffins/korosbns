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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com https://www.clarity.ms https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    `connect-src 'self' https://bnske.budgetndiostory.org https://*.budgetndiostory.org https://app.posthog.com https://us.i.posthog.com https://vitals.vercel-insights.com https://*.vercel-analytics.com${localApiConnect}`,
    "media-src 'self' https://res.cloudinary.com blob: data:",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com https://youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.100.78', 'localhost', '127.0.0.1'],
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
        hostname: 'newtisa.tisa.co.ke',
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
      {
        source: "/contacts",
        destination: "/contact/",
        permanent: true,
      },
      {
        source: "/contacts/",
        destination: "/contact/",
        permanent: true,
      },
      // Consolidated legacy routes redirecting to unified /learn
      {
        source: "/articles/:slug*",
        destination: "/learn/:slug*",
        permanent: false,
      },
      {
        source: "/trivia/:slug*",
        destination: "/learn/:slug*",
        permanent: false,
      },
      {
        source: "/knowledge/:slug*",
        destination: "/learn/:slug*",
        permanent: false,
      },
      {
        source: "/learn/bps/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/learn/deep-dives/:slug*",
        destination: "/learn/:slug*",
        permanent: false,
      },
      {
        source: "/learn/units/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/learn/repository/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/cafe/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/challenges/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/invite/:path*",
        destination: "/auth/register/",
        permanent: false,
      },
      {
        source: "/test/:path*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/users/:id*",
        destination: "/learn/",
        permanent: false,
      },
      {
        source: "/budgethub/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/bns-project",
        permanent: false,
      },
      {
        source: "/projects/",
        destination: "/bns-project/",
        permanent: false,
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
      // Proxy Django media files (attachments, uploads) through Next.js so
      // they are served same-origin and avoid CORS / production media-serving issues.
      {
        source: "/media/:path*",
        destination: `${target}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
