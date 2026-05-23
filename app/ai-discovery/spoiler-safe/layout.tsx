import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spoiler-Safe Narrative Summaries — Anima',
  description: 'Read detailed summaries and character analysis tailored to your current episode, keeping spoilers hidden.',
}

export default function SpoilerSafeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
