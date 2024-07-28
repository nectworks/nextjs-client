/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nectworks-docs.s3.amazonaws.com',
        port: '',
        pathname: '/originalDocs/images/**',
      },
    ],
  },
};

export default nextConfig;
