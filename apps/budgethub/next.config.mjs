/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/budgethub",
  trailingSlash: true,
  reactCompiler: true,

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
