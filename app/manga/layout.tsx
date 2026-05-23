import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Manga & Light Novels — Anima',
  description: 'Browse the most popular, top-rated, and trending manga, manhwa, and light novels.',
}

export default function MangaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
