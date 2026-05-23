import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Anime — Anima',
  description: 'Browse curated collections of trending, popular, seasonal, and top-rated anime series.',
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
