/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // allow images from any domain
        },
      ],
    },
  };
  
  export default nextConfig;
  