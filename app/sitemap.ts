import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anima.pratyush.works'

  // 1. Core static routes
  const staticRoutes = [
    '',
    '/explore',
    '/explore/trending',
    '/explore/popular-this-season',
    '/explore/upcoming',
    '/explore/all-time-popular',
    '/explore/top-100',
    '/manga',
    '/ai-discovery',
    '/ai-discovery/semantic-search',
    '/ai-discovery/narrative-intelligence',
    '/ai-discovery/emotional-mapping',
    '/ai-discovery/scene-search',
    '/ai-discovery/multi-agent',
    '/ai-discovery/spoiler-safe',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Dynamic Anime detail pages from Qdrant scroll API
  let animeRoutes: MetadataRoute.Sitemap = []
  try {
    const qdrantUrl = process.env.QDRANT_API_URL || 'http://localhost:6333'
    const qdrantResponse = await fetch(`${qdrantUrl}/collections/anime/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 100,
        with_payload: ['id'],
        with_vector: false,
      }),
      next: { revalidate: 3600 }
    })

    if (qdrantResponse.ok) {
      const data = await qdrantResponse.json()
      const points = data?.result?.points || []
      animeRoutes = points
        .map((p: any) => p?.id)
        .filter(Boolean)
        .map((id: number) => ({
          url: `${baseUrl}/anime/${id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to fetch dynamic anime IDs from Qdrant:', e)
  }

  // 3. Dynamic Manga detail pages from AniList GraphQL Page query
  let mangaRoutes: MetadataRoute.Sitemap = []
  try {
    const query = `
      query {
        Page(page: 1, perPage: 100) {
          media(type: MANGA, sort: POPULARITY_DESC) {
            id
          }
        }
      }
    `
    const aniResponse = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }
    })

    if (aniResponse.ok) {
      const data = await aniResponse.json()
      const media = data?.data?.Page?.media || []
      mangaRoutes = media
        .map((m: any) => m?.id)
        .filter(Boolean)
        .map((id: number) => ({
          url: `${baseUrl}/manga/${id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to fetch dynamic manga IDs from AniList:', e)
  }

  return [...staticRoutes, ...animeRoutes, ...mangaRoutes]
}
