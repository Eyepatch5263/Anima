'use client'

import { useAnimeData } from '@/src/hooks/useAnimeData'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import WatchingGrid from './components/WatchingGrid'
import AIDiscovery from './components/AIDiscovery'
import NarrativeIntel from './components/NarrativeIntel'
import Footer from './components/Footer'
import BackgroundParticles from './components/BackgroundParticles'

export default function LandingPage() {
  const {
    trending,
    seasonal,
    popular,
    isLoading,
  } = useAnimeData()

  return (
    <main className="relative">
      <BackgroundParticles />
      <Navbar />
      <HeroSection trending={trending}/>
      <WatchingGrid popular={popular} seasonal={seasonal} isLoading={isLoading} />
      <AIDiscovery />
      <NarrativeIntel />
      <Footer />
    </main>
  )
}