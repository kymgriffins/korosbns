import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
};

export default nextConfig;
