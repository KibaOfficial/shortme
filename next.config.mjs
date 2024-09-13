/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3001', 'https://dx6v73nf-3001.euw.devtunnels.ms/']
    }
  }
};

export default nextConfig;
