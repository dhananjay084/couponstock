/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
  
