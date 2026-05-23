import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Popular Anime This Season — Anima',
  description: 'Discover the most popular anime series currently airing this season.',
}

export default function PopularThisSeasonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
