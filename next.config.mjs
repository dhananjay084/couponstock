/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
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
  
