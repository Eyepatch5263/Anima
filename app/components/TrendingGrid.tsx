'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarIcon, CrownIcon, ChevronRightIcon } from './icons'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'

/* ── Genre pill colors (consistent per genre) ─── */

const genreColors: Record<string, string> = {
  'Action': 'bg-[#e50914]/80 text-white',
  'Adventure': 'bg-[#2ecc71]/80 text-black',
  'Comedy': 'bg-[#e87c03]/80 text-black',
  'Drama': 'bg-[#3498db]/80 text-white',
  'Fantasy': 'bg-[#9b59b6]/80 text-white',
  'Horror': 'bg-[#c0392b]/80 text-white',
  'Mystery': 'bg-[#8e44ad]/80 text-white',
  'Psychological': 'bg-[#2980b9]/80 text-white',
  'Romance': 'bg-[#e84393]/80 text-white',
  'Sci-Fi': 'bg-[#00b894]/80 text-black',
  'Slice of Life': 'bg-[#fdcb6e]/80 text-black',
  'Supernatural': 'bg-[#6c5ce7]/80 text-white',
  'Thriller': 'bg-[#636e72]/80 text-white',
  'Sports': 'bg-[#00cec9]/80 text-black',
  'Mecha': 'bg-[#0984e3]/80 text-white',
  'Music': 'bg-[#fd79a8]/80 text-black',
  'Ecchi': 'bg-[#fab1a0]/80 text-black',
}

function getGenreColor(genre: string) {
  return genreColors[genre] || 'bg-white/10 text-white/80'
}

function formatEpisodes(anime: UnwrappedMedia): string {
  if (anime.format === 'MOVIE') {
    const mins = anime.duration
    if (mins) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    }
    return 'Movie'
  }
  return anime.episodes ? `${anime.episodes} eps` : '—'
}

function formatType(format: string | null): string {
  if (!format) return '—'
  switch (format) {
    case 'TV': return 'TV Show'
    case 'TV_SHORT': return 'TV Short'
    case 'MOVIE': return 'Movie'
    case 'SPECIAL': return 'Special'
    case 'OVA': return 'OVA'
    case 'ONA': return 'ONA'
    case 'MUSIC': return 'Music'
    default: return format
  }
}

/* ── Mosaic Card Component ──────────────────── */

function MosaicCard({ anime, rank }: { anime: UnwrappedMedia; rank: number }) {
  const styleIdx = (rank - 1) % 4
  const aspectClass =
    styleIdx === 0 ? 'aspect-[2/3]' :
    styleIdx === 1 ? 'aspect-[2/3]' :
    styleIdx === 2 ? 'aspect-square' : 'aspect-[4/3]'

  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const bannerUrl = anime.bannerImage || coverUrl
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).slice(0, 3) as string[]
  const score = anime.averageScore
  const status = anime.status?.toLowerCase().replace(/_/g, ' ') || ''

  return (
    <Link href={`/anime/${anime.id}`} className="break-inside-avoid mb-6 block">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.35 }}
        className={`w-full relative overflow-hidden rounded-2xl bg-[#1a1a1a]/40 border border-white/5 cursor-pointer flex flex-col justify-end p-4 md:p-5 group ${aspectClass}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={styleIdx === 0 ? bannerUrl : coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-104"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent group-hover:via-black/75 transition-all duration-300" />
        </div>

        {/* Rank number */}
        <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg bg-black/75 border border-white/10 flex items-center justify-center">
          <span className="text-xs font-black text-white">#{rank}</span>
        </div>

        {/* Basic Title view (always visible) */}
        <div className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
          <h4 className="text-xs md:text-sm font-bold text-white line-clamp-1">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#b3b3b3]">
            {score && (
              <span className="text-[#46d369] font-bold">{score}% Match</span>
            )}
            <span>{formatType(anime.format)}</span>
          </div>
        </div>

        {/* Detailed Hover Overlay */}
        <div className="absolute inset-0 z-20 bg-black/95 p-4 md:p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out select-none">
          {/* Genre pills */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {genres.map(genre => (
              <span
                key={genre}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getGenreColor(genre)}`}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h4 className="text-xs md:text-sm font-extrabold text-white leading-tight mb-2 line-clamp-2">
            {title}
          </h4>

          {/* Metadata Details */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2.5 border-t border-white/10 text-[9px] md:text-[10px] text-[#808080]">
            <div>
              <span className="text-[#555] uppercase block text-[8px] tracking-wider mb-0.5">Rating</span>
              <span className="text-[#46d369] font-bold flex items-center gap-0.5">
                <StarIcon size={9} /> {score ? `${score}%` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[#555] uppercase block text-[8px] tracking-wider mb-0.5">Format</span>
              <span className="text-white font-medium">{formatType(anime.format)}</span>
            </div>
            <div>
              <span className="text-[#555] uppercase block text-[8px] tracking-wider mb-0.5">Episodes</span>
              <span className="text-white font-medium">{formatEpisodes(anime)}</span>
            </div>
            <div>
              <span className="text-[#555] uppercase block text-[8px] tracking-wider mb-0.5">Status</span>
              <span className="text-white font-medium capitalize">{status}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function MosaicSkeleton() {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-6">
      {Array.from({ length: 10 }).map((_, i) => {
        const styleIdx = i % 4
        const aspectClass =
          styleIdx === 0 ? 'aspect-[16/10]' :
          styleIdx === 1 ? 'aspect-[2/3]' :
          styleIdx === 2 ? 'aspect-square' : 'aspect-[3/4]'
        return (
          <div
            key={i}
            className={`break-inside-avoid mb-6 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse ${aspectClass}`}
          />
        )
      })}
    </div>
  )
}

/* ── Main Component ────────────────────────── */

interface TopRatedListProps {
  topRated: UnwrappedMedia[]
  isLoading: boolean
}

export default function TopRatedList({ topRated, isLoading }: TopRatedListProps) {
  // Only display top 10 in the mosaic landing page view
  const items = topRated.slice(0, 10)

  return (
    <section id="top100" className="relative py-12 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <CrownIcon size={14} className="text-[#e50914]" />
          Top 100 Anime
        </h3>
        <Link
          href="/explore/top-100"
          className="text-xs text-[#808080] hover:text-white flex items-center gap-0.5 transition-colors"
        >
          View All <ChevronRightIcon size={12} />
        </Link>
      </div>

      {/* Grid container */}
      {isLoading ? (
        <MosaicSkeleton />
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-6">
          {items.map((anime, i) => (
            <MosaicCard key={anime.id} anime={anime} rank={i + 1} />
          ))}
        </div>
      )}
    </section>
  )
}
