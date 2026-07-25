import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/api/rag/:path*",
        destination: "https://rag-ai-agentic.mvickymosafan.workers.dev/api/rag/:path*",
      },
      {
        source: "/api/admin/:path*",
        destination: "https://rag-ai-agentic.mvickymosafan.workers.dev/api/admin/:path*",
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
