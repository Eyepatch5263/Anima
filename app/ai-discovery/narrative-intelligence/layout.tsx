import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Narrative Intelligence & Deep Analysis — Anima',
  description: 'Analyze story structures, pacing, and complex character traits to find your next favorite anime.',
}

export default function NarrativeIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
