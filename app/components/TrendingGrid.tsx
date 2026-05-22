'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarIcon } from '../constants/icons'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'
import { formatEpisodes, formatType, getGenreColor } from '@/utilities/trending-grid-utility'

/* ── Mosaic Card Component ──────────────────── */

export function MosaicCard({ anime, rank }: { anime: UnwrappedMedia; rank: number }) {
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
        className={`w-full relative overflow-hidden rounded-2xl bg-surface-raised/40 border border-white/5 cursor-pointer flex flex-col justify-end p-4 md:p-5 group ${aspectClass}`}
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
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent group-hover:via-black/75 transition-all duration-300" />
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
          <div className="flex items-center gap-2 mt-1 text-[10px] text-text-secondary">
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
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2.5 border-t border-white/10 text-[9px] md:text-[10px] text-tetx-muted">
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

