/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add other configuration options here
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/proxy',
      },
    ];
  },
}

module.exports = nextConfig