import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All-Time Popular Anime — Anima',
  description: 'Explore the most popular anime series of all time, ranked by global user popularity.',
}

export default function AllTimePopularLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
