import type { NextConfig } from 'next';

// Internal backend URL (reachable via the docker service name). Through this
// rewrite we serve uploaded media (/uploads/*) from the backend under the frontend
// origin, so relative URLs `/uploads/...` work even when the backend runs on another port.
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL ?? 'http://backend:3001';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_INTERNAL_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
