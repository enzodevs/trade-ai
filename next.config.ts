import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'akamai',
    path: '',
  },
};

export default nextConfig;
