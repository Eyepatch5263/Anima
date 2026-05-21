'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import FilterBar, { defaultFilters, type FilterState } from './FilterBar'
import Footer from './Footer'
import { useInfiniteAnime, type SortType } from '@/src/hooks/useInfiniteAnime'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'

/* ── Poster card with optional rank badge ───── */

function PosterCard({ anime, index, showRank }: { anime: UnwrappedMedia; index: number; showRank?: boolean }) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const title = anime.title?.userPreferred || 'Unknown'

  return (
    <Link href={`/anime/${anime.id}`} className="group block cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.3, delay: (index % 6) * 0.04 }}
        className="w-full h-full"
      >
        <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-[#1a1a1a] mb-2">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform duration-400 group-hover:scale-105"
              priority={index < 6}
            />
          ) : (
            <div className="w-full h-full bg-[#222]" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Rank badge */}
          {showRank && (
            <div className="absolute top-2 left-2 min-w-[28px] h-7 px-1.5 rounded bg-[#e50914] flex items-center justify-center">
              <span className="text-xs font-bold text-white">#{index + 1}</span>
            </div>
          )}
        </div>
        <p className="text-[12px] text-[#b3b3b3] group-hover:text-white leading-snug line-clamp-2 transition-colors duration-200">
          {title}
        </p>
      </motion.div>
    </Link>
  )
}

function PosterSkeleton() {
  return (
    <div>
      <div className="aspect-3/4 rounded-lg bg-[#1a1a1a] animate-pulse mb-2" />
      <div className="h-3 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
    </div>
  )
}

/* ── Loading spinner row ────────────────────── */

function LoadingMore() {
  return (
    <div className="flex items-center justify-center py-10 gap-3">
      <div className="w-5 h-5 border-2 border-white/10 border-t-[#e50914] rounded-full animate-spin" />
      <span className="text-sm text-[#808080]">Loading more...</span>
    </div>
  )
}

/* ── Main grid page ────────────────────────── */

/* ── Helper function to clean HTML descriptions ───── */

function cleanDescription(html: string | null | undefined): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/* ── Carousel Skeleton loader ───── */

function CarouselSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414]/50 mb-8 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20 gap-4">
        <div className="flex gap-2">
          <div className="w-16 h-4 bg-white/10 rounded" />
          <div className="w-12 h-4 bg-white/10 rounded" />
        </div>
        <div className="w-3/4 h-8 bg-white/10 rounded animate-pulse" />
        <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
        <div className="w-5/6 h-4 bg-white/10 rounded animate-pulse" />
        <div className="flex items-center gap-4 mt-2">
          <div className="w-28 h-8 bg-white/10 rounded-xl" />
          <div className="w-12 h-4 bg-white/10 rounded" />
          <div className="w-12 h-4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  )
}

/* ── Main grid page ────────────────────────── */

interface AnimeGridPageProps {
  title: string
  sort: SortType
  showRank?: boolean
  initialSeason?: string
  initialSeasonYear?: number
}

export default function AnimeGridPage({
  title,
  sort,
  showRank = false,
  initialSeason,
  initialSeasonYear,
}: AnimeGridPageProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [activeSlide, setActiveSlide] = useState(0)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAnime({
    sort,
    perPage: 18,
    season: (initialSeason || filters.season || undefined) as any,
    seasonYear: initialSeasonYear || (filters.year ? Number(filters.year) : undefined),
    genre: filters.genre || undefined,
    format: filters.format || undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
  })

  const hasActiveFilters = Object.values(filters).some(v => v !== '')
  const carouselItems = data.slice(0, 5)

  useEffect(() => {
    if (carouselItems.length <= 1) return
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselItems.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [carouselItems.length])

  useEffect(() => {
    if (activeSlide >= carouselItems.length && carouselItems.length > 0) {
      setActiveSlide(0)
    }
  }, [carouselItems.length, activeSlide])

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '200px',
    })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <>
      <Navbar />

      <div className="pt-24 mt-10 pb-2 max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          {title}
        </h1>

        {/* Dynamic Carousel Section */}
        {!hasActiveFilters && (
          isLoading ? (
            <CarouselSkeleton />
          ) : (
            carouselItems.length > 0 && (
              <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414] mb-8 group">
                {carouselItems.map((anime, idx) => {
                  const bgImage = anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large || ''
                  const animeTitle = anime.title?.userPreferred || 'Unknown'
                  const cleanedDesc = cleanDescription(anime.description)
                  const rating = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null
                  const genres = (anime.genres || []).filter(Boolean) as string[]

                  return (
                    <div
                      key={anime.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      {/* Full-bleed Background Image */}
                      {bgImage && (
                        <Image
                          src={bgImage}
                          alt={animeTitle}
                          fill
                          priority={idx === 0}
                          className="object-cover object-center scale-102 transition-transform duration-[10000ms] ease-out group-hover:scale-105"
                          unoptimized={bgImage.startsWith('data:') || bgImage.startsWith('blob:')}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#e50914] text-white">
                            Featured
                          </span>
                          {rating && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white flex items-center gap-1">
                              ★ {rating}
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 line-clamp-2">
                          {animeTitle}
                        </h2>

                        <p className="text-xs sm:text-sm text-[#cccccc] mb-6 line-clamp-3 leading-relaxed">
                          {cleanedDesc}
                        </p>

                        <div className="flex items-center gap-4">
                          <Link
                            href={`/anime/${anime.id}`}
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#e50914] text-white hover:bg-[#f6121d] transition-all transform hover:scale-103 shadow-lg shadow-[#e50914]/20 cursor-pointer"
                          >
                            View Details
                          </Link>
                          <div className="flex gap-1">
                            {genres.slice(0, 2).map((g, i) => (
                              <span key={i} className="text-[10px] text-[#999999] border border-white/10 px-2 py-0.5 rounded-md">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Slider Navigation Dots */}
                {carouselItems.length > 1 && (
                  <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                    {carouselItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeSlide ? 'bg-[#e50914] w-6' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          )
        )}
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 18 }).map((_, i) => <PosterSkeleton key={i} />)
            : data.map((anime, i) => (
                <PosterCard key={`${anime.id}-${i}`} anime={anime} index={i} showRank={showRank} />
              ))
          }
        </div>

        {/* No results */}
        {!isLoading && data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#808080] text-lg mb-2">No anime found</p>
            <p className="text-[#555] text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Loading more indicator */}
        {isFetchingNextPage && <LoadingMore />}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* End of results */}
        {!hasNextPage && data.length > 0 && !isLoading && (
          <p className="text-center text-[#555] text-xs py-8">
            Showing all {data.length} results
          </p>
        )}
      </div>

      <Footer />
    </>
  )
}
