/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle Prisma client on server side
      config.externals.push('@prisma/client')
    }
    
    // Handle missing modules gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }
    
    // Ignore Prisma binary issues
    config.ignoreWarnings = [
      { module: /node_modules\/@prisma\/client/ },
      { file: /node_modules\/@prisma\/client/ }
    ]
    
    return config
  }
};

module.exports = nextConfig;