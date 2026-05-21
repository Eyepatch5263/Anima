'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarIcon, FireIcon, ChevronRightIcon } from './icons'
import { applyFilters, type FilterState } from './FilterBar'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'

/* ── Bento Card Item ───────────────────────── */

interface BentoCardProps {
  anime: UnwrappedMedia
  index: number
  isSpotlight?: boolean
}

function BentoCard({ anime, index, isSpotlight = false }: BentoCardProps) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const bannerUrl = anime.bannerImage || coverUrl
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).slice(0, 3)
  const score = anime.averageScore

  if (isSpotlight) {
    return (
      <Link href={`/anime/${anime.id}`} className="col-span-2 md:col-span-2 md:row-span-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="w-full h-full relative overflow-hidden rounded-2xl bg-[#1a1a1a]/40 border border-white/5 group flex flex-col justify-end p-5 md:p-6 cursor-pointer min-h-[220px] md:min-h-0 aspect-[16/9] md:aspect-auto"
        >
          {/* Background Image */}
          {bannerUrl && (
            <div className="absolute inset-0 z-0">
              <Image
                src={bannerUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/10" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start max-w-lg">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#e50914] text-white mb-2">
              <FireIcon size={10} strokeWidth={2.5} />
              Spotlight
            </span>

            <h4 className="text-sm md:text-xl font-bold text-white leading-tight mb-1.5 group-hover:text-[#e50914] transition-colors line-clamp-1">
              {title}
            </h4>

            <p className="text-[10px] md:text-xs text-[#b3b3b3] line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">
              {anime?.description?.replace(/<[^>]*>/g, '') || ''}
            </p>

            <div className="flex flex-wrap gap-1">
              {genres.map(genre => (
                <span key={genre} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/10 text-white">
                  {genre}
                </span>
              ))}
              {score && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#46d369]/10 text-[#46d369]">
                  <StarIcon size={8} />
                  {score}%
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Normal Card
  return (
    <Link href={`/anime/${anime.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className="w-full h-full relative overflow-hidden rounded-xl bg-[#1a1a1a]/40 border border-white/5 group aspect-[2/3] flex flex-col justify-end p-3 cursor-pointer"
      >
        {/* Cover Image */}
        {coverUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform duration-550 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:via-black/60 transition-all duration-300" />
          </div>
        )}

        {/* Info on bottom */}
        <div className="relative z-10">
          <h5 className="text-[11px] md:text-xs font-bold text-white line-clamp-1 mb-1 group-hover:text-[#e50914] transition-colors">
            {title}
          </h5>
          <div className="flex items-center gap-1.5 text-[9px] text-[#808080]">
            {score && (
              <span className="flex items-center gap-0.5 text-[#46d369] font-bold">
                <StarIcon size={8} /> {score}%
              </span>
            )}
            <span>{anime.format || '—'}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <div className="col-span-2 md:col-span-2 md:row-span-2 rounded-2xl bg-white/[0.02] border border-white/5 aspect-[16/9] md:aspect-auto animate-pulse" />
      <div className="rounded-xl bg-white/[0.02] border border-white/5 aspect-[2/3] animate-pulse" />
      <div className="rounded-xl bg-white/[0.02] border border-white/5 aspect-[2/3] animate-pulse" />
      <div className="rounded-xl bg-white/[0.02] border border-white/5 aspect-[2/3] animate-pulse" />
      <div className="rounded-xl bg-white/[0.02] border border-white/5 aspect-[2/3] animate-pulse" />
      <div className="rounded-xl bg-white/[0.02] border border-white/5 aspect-[2/3] animate-pulse" />
    </div>
  )
}

/* ── Single Bento Section ─────────────────── */

interface BentoSectionProps {
  title: string
  data: UnwrappedMedia[]
  isLoading: boolean
  viewAllHref: string
}

function BentoSection({ title, data, isLoading, viewAllHref }: BentoSectionProps) {
  if (!isLoading && data.length === 0) return null

  // Slice to max 6 items for bento layout
  const items = data.slice(0, 6)

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="text-xs sm:text-sm md:text-xl lg:text-3xl font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="text-xs text-[#808080] hover:text-white flex items-center gap-0.5 transition-colors"
        >
          View All <ChevronRightIcon size={12} />
        </Link>
      </div>  

      {/* Grid container */}
      {isLoading ? (
        <BentoSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((anime, i) => (
            <BentoCard
              key={anime.id}
              anime={anime}
              index={i}
              isSpotlight={i === 0 && items.length >= 3}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Showcase Component ──────────────── */

interface FeaturedShowcaseProps {
  trending: UnwrappedMedia[]
  seasonal: UnwrappedMedia[]
  nextSeason: UnwrappedMedia[]
  popular: UnwrappedMedia[]
  topRated: UnwrappedMedia[]
  isLoading: boolean
  currentSeason: string
  filters?: FilterState
}

export default function FeaturedShowcase({
  trending,
  seasonal,
  nextSeason,
  popular,
  isLoading,
  currentSeason,
  filters,
}: FeaturedShowcaseProps) {
  // Apply filters if any are active
  const hasFilters = filters && Object.values(filters).some(v => v !== '')
  const filteredTrending = hasFilters ? applyFilters(trending, filters) : trending
  const filteredSeasonal = hasFilters ? applyFilters(seasonal, filters) : seasonal
  const filteredNext = hasFilters ? applyFilters(nextSeason, filters) : nextSeason
  const filteredPopular = hasFilters ? applyFilters(popular, filters) : popular

  const seasonLabel = currentSeason.charAt(0) + currentSeason.slice(1).toLowerCase()

  return (
    <section id="showcase" className="relative py-8 max-w-7xl mx-auto px-6 lg:px-8">
      <BentoSection
        title="Trending Now"
        data={filteredTrending}
        isLoading={isLoading}
        viewAllHref="/explore/trending"
      />
      <BentoSection
        title={`Popular This Season — ${seasonLabel}`}
        data={filteredSeasonal}
        isLoading={isLoading}
        viewAllHref="/explore/popular-this-season"
      />
      <BentoSection
        title="Upcoming Next Season"
        data={filteredNext}
        isLoading={isLoading}
        viewAllHref="/explore/upcoming"
      />
      <BentoSection
        title="All-Time Popular"
        data={filteredPopular}
        isLoading={isLoading}
        viewAllHref="/explore/all-time-popular"
      />
    </section>
  )
}
