'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAnimeData } from '@/src/hooks/useAnimeData'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import FeaturedShowcase from '../components/FeaturedShowcase'
import TopRatedList from '../components/TopratedList'
import Footer from '../components/Footer'
import BackgroundParticles from '../components/BackgroundParticles'
import { publicAnimes, exploreCategories } from '../constants/explore-anime'
import { applyFilters } from '../constants/ApplyFilter'
import { defaultFilters, FilterState } from '../types/filterbar.type'

export default function ExplorePage() {
  const { trending, seasonal, nextSeason, popular, topRated, isLoading, currentSeason } = useAnimeData()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [activeSlide, setActiveSlide] = useState(0)
  const [carouselAnimes, setCarouselAnimes] = useState(publicAnimes)

  useEffect(() => {
    async function loadPublicAnimes() {
      try {
        if ('caches' in window) {
          const cache = await caches.open('public-anime-cache')
          const cachedResponse = await cache.match('/api/public-anime')
          if (cachedResponse) {
            const data = await cachedResponse.json()
            setCarouselAnimes(data)
            return
          }
        }

        const res = await fetch('/api/public-anime')
        const data = await res.json()
        setCarouselAnimes(data)

        // store the cache
        if ('caches' in window) {
          const cache = await caches.open('public-anime-cache')
          const resClone = new Response(JSON.stringify(data))
          await cache.put('/api/public-anime', resClone)
        }
      } catch (e) {
        console.error('Error loading public anime from Cache Storage:', e)
      }
    }
    loadPublicAnimes()
  }, [])

  useEffect(() => {
    if (carouselAnimes.length === 0) return
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselAnimes.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [carouselAnimes.length])

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="relative min-h-screen bg-[#28282811]">
      {/* Dynamic Background Particles */}
      <BackgroundParticles />

      <div className="relative z-10">
        <Navbar />

        {/* Page header & Hero Carousel */}
        <div className="pt-28 pb-6 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414] mb-8 group">
            {carouselAnimes.map((anime, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                {/* Full-bleed Background Image */}
                <Image
                  src={anime.image}
                  alt={anime.title}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  fill
                  priority={idx === 0}
                  className="object-cover object-center scale-102 transition-transform duration-10000 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>


                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-accent-primary text-white">
                      Featured
                    </span>
                    {anime.rating && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white flex items-center gap-1">
                        ★ {anime.rating}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    {anime.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#cccccc] mb-6 line-clamp-3 leading-relaxed">
                    {anime.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={anime.link}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-accent-primary text-white hover:bg-accent-primary/80 transition-all transform hover:scale-103 shadow-lg shadow-accent-primary/20 cursor-pointer"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-1">
                      {anime.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] text-[#999999] border border-white/10 px-2 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-20">
              {carouselAnimes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === activeSlide ? 'bg-accent-primary w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Quick Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {exploreCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white/1 border border-white/5 transition-all hover:scale-[1.02] hover:bg-white/2 bg-linear-to-br ${cat.gradient} group`}
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-accent-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-1 leading-normal">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        <FeaturedShowcase
          trending={trending}
          seasonal={seasonal}
          nextSeason={nextSeason}
          popular={popular}
          topRated={topRated}
          isLoading={isLoading}
          currentSeason={currentSeason}
          filters={filters}
        />

        <TopRatedList
          topRated={hasActiveFilters ? applyFilters(topRated, filters) : topRated}
          isLoading={isLoading}
        />

        <Footer />
      </div>
    </div>
  )
}