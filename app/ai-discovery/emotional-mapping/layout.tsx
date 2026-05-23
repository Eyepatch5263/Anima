import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emotional Mapping & Mood Search — Anima',
  description: 'Find anime matching specific emotional arcs, psychological depth, and atmospheric moods.',
}

export default function EmotionalMappingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
