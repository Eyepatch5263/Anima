import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scene Search & Visual Query — Anima',
  description: 'Locate specific anime scenes using semantic visual descriptions and contextual queries.',
}

export default function SceneSearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
