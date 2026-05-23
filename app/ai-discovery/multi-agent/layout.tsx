import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi-Agent Consensus Recommendations — Anima',
  description: 'Get recommendations vetted by a consensus of specialized AI agents representing different viewpoints.',
}

export default function MultiAgentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
