/* eslint-disable import/no-anonymous-default-export */
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3001', 'https://dx6v73nf-3001.euw.devtunnels.ms/']
    }
  }
};

export default {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
