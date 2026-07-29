import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'trianglecart.test',
      },
      {
        protocol: 'https',
        hostname: 'tc.janamithrasociety.com'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  async redirects() {
    return [
      {
        // 1. Match any request on the naked domain (http or https) and send to https://www
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'trianglecart.com.au',
          },
        ],
        destination: 'https://trianglecart.com.au*',
        permanent: true, // 301 Permanent Redirect
      },
      {
        // 2. Match http://yourdomain.com specifically to upgrade it to https://www
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http', // Matches insecure http traffic
          },
          {
            type: 'host',
            value: '://trianglecart.com.au',
          },
        ],
        destination: 'https://trianglecart.com.au*',
        permanent: true, // 301 Permanent Redirect
      },
    ];
  }


};

export default nextConfig;
