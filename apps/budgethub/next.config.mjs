/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/budgethub",
  trailingSlash: true,
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
