/** @type {import('next').NextConfig} */

const nextConfig = {
  // React strict mode for development
  reactStrictMode: true,

  // Swc compiler settings for faster builds
  swcMinify: true,

  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Image optimization
  images: {
    domains: ['nextjs-starter.vercel.app', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    loader: 'default',
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
  },

  // Typography optimization
  optimizeFonts: true,

  // Source maps (disabled in production for smaller builds)
  productionBrowserSourceMaps: false,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // ESLint configuration
  eslint: {
    dirs: ['app', 'lib', 'components'],
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Redirects configuration
  async redirects() {
    return [
      // Example: redirect old paths
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Rewrites configuration
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // On-demand ISR settings
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Experimental features for optimization
  experimental: {
    esmExternals: true,
    optimizePackageImports: ['lodash', 'lodash-es'],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      }
    }
    return config
  },

  // Build ID for deployment versioning
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID
    }
    return `${Date.now()}`
  },

  // Trailing slashes configuration
  trailingSlash: false,

  // Static page generation timeout
  staticPageGenerationTimeout: 60,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Next.js Starter',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

module.exports = nextConfig
