/** @type {import('next').NextConfig} */
const path = require('path');

const splitCsv = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Set on the build machine (e.g. in .env.production) so production host/IP is allowed for Server Actions without editing this file.
const serverActionOriginsFromEnv = splitCsv(
  process.env.SERVER_ACTION_ALLOWED_ORIGINS
);

const imageHostsFromEnv = splitCsv(process.env.NEXT_IMAGE_REMOTE_HOSTS);

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ['10.69.139.47', 'signoxcms.com', 'www.signoxcms.com'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '192.168.0.104:3000',
        '192.168.1.231:3000',
        '192.168.0.139:3000',
        '192.168.1.232:3000',
        '10.69.139.47',
        '10.69.139.157:3000',
        'signox-frontend.onrender.com',
        'signoxcms.com',
        'www.signoxcms.com',
        ...serverActionOriginsFromEnv,
      ],
    },
  },
  images: {
    domains: [
      'localhost',
      '192.168.0.104',
      '192.168.1.231',
      '192.168.0.139',
      '192.168.1.232',
      '10.69.139.157',
      'signox-backend.onrender.com',
      'signoxcms.com',
      'www.signoxcms.com',
      ...imageHostsFromEnv,
    ],
  },
  // Output standalone for better performance on Render
  output: 'standalone',
  // Repo may have a lockfile above this folder; pin tracing so `next start` uses this app’s `.next` build.
  outputFileTracingRoot: path.join(__dirname),
  // Disable telemetry in production
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
  }),
};

module.exports = nextConfig;
