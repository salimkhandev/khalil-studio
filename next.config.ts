import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  redirects: async () => {
    return [
      {
        source: "/admin",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
