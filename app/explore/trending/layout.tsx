import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trending Anime Now — Anima',
  description: 'See which anime series are currently trending, highly discussed, and capturing viewer attention.',
}

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
