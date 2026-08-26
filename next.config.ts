import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages serves directory routes (for example, /platform/) reliably,
  // while extensionless flat files such as /platform.html are not crawlable at
  // their canonical URL without a server-side rewrite.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
