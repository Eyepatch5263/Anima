import { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const query = `
      query GetAnimeMeta($id: Int) {
        Media(id: $id, type: ANIME) {
          title {
            userPreferred
            english
          }
          description
          coverImage {
            extraLarge
            large
          }
        }
      }
    `
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { id: parseInt(id, 10) },
      }),
      next: { revalidate: 86400 } // cache for 24 hours
    })

    if (response.ok) {
      const data = await response.json()
      const media = data?.data?.Media
      if (media) {
        const title = media.title?.userPreferred || media.title?.english || 'Anime Detail'
        const description = media.description
          ? media.description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 160) + '...'
          : 'Read reviews, recommendations, genres, themes, and staff info.'
        const image = media.coverImage?.extraLarge || media.coverImage?.large

        return {
          title: `${title} — Anima`,
          description,
          openGraph: {
            title: `${title} — Anima`,
            description,
            images: image ? [{ url: image }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: `${title} — Anima`,
            description,
            images: image ? [image] : [],
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Anime Layout Meta] Failed to generate dynamic metadata:', e)
  }

  return {
    title: 'Anime Details — Anima',
    description: 'View full details, reviews, staff, and rankings for this anime.'
  }
}

export default function AnimeDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
