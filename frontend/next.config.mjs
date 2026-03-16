/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone은 Docker용
  // output: "standalone",
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source:      "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.snowflakecomputing.com" },
    ],
  },
};

export default nextConfig;
