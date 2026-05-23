import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semantic Anime Search — Anima',
  description: 'Search for anime using natural, conversational language. Describe settings, themes, and moods.',
}

export default function SemanticSearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
