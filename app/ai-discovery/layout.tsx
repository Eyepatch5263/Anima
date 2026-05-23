import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Powered Anime Discovery Suite — Anima',
  description: 'Discover anime using narrative intelligence, semantic search, emotional mapping, and spoiler-safe recommendations.',
}

export default function AIDiscoveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
