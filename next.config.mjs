/** @type {import('next').NextConfig} */
const backendOrigin = (
  process.env.INTERNAL_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://127.0.0.1:5000"
).replace(/\/$/, "");

const nextConfig = {
  // Keep development and production build artifacts separate so a stale dev cache
  // can't break `next start`, and an interrupted production build can't poison `next dev`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Do NOT use `output: "export"` for this app.
  // Static export requires pre-rendering dynamic routes (deals/stores/etc.) at build time,
  // which doesn't scale and breaks runtime data fetching.
  reactStrictMode: false,
  images: {
    // Disables Next's image optimizer (reduces server CPU/RAM/disk usage on self-hosted deployments).
    // Remote images will be served as-is by the client.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow images from any domain
      },
    ],
  },
  async redirects() {
    return [
      { source: "/allstores", destination: "/store", permanent: true },
      { source: "/allcategories", destination: "/category", permanent: true },
      { source: "/allcoupons", destination: "/deal", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
  
