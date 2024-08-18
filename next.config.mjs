/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/originalDocs/images/**',
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
