import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 100 Rated Anime — Anima',
  description: 'View the highest-rated anime series of all time, ranked by global score averages.',
}

export default function Top100Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
