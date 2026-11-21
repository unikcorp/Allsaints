
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  allowedDevOrigins: ["192.168.1.14"],

  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "allsaints.unikcorp.org",
      },
      {
        protocol: "http",
        hostname: "allsaints.unikcorp.org",
      },
    ],
  },

  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://localhost:5000";
    // Next.js's own route handlers (e.g. /api/pta-image) are matched first;
    // anything else under /api and /uploads is proxied to the Express backend.
    return [
      { source: "/uploads/:path*", destination: `${backend}/uploads/:path*` },
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
    ];
  },

  async redirects() {
    return [
      {
        source: "/frontend",
        destination: "/",
        permanent: false,
      },
      {
        source: "/online_admission",
        destination: "/admissions/apply",
        permanent: false,
      },
      {
        source: "/welcome/checkadmissionstatus",
        destination: "/admissions/apply",
        permanent: false,
      },
      {
        source: "/page/annual-report",
        destination: "/academics/annual-report",
        permanent: false,
      },
      {
        source: "/site/login",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/admin/login",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
