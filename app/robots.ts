import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anima.pratyush.works'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', 
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
        disallow: '',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
