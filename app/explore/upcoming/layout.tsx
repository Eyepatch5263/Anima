import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upcoming Anime Releases — Anima',
  description: 'Keep track of highly anticipated upcoming anime series and movie releases for the next seasons.',
}

export default function UpcomingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
