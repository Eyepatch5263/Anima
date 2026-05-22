'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScoreBadge } from '../constants/ScoreBadge'
import type { AnimeCardProps } from '../types/anime.card.type'

export default function AnimeCard({ anime, index = 0, variant = 'default', priority = false }: AnimeCardProps) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).filter(Boolean).slice(0, 2) as string[]
  const studio = anime.studios?.edges?.find(e => e?.isMain)?.node?.name
  const format = anime.format?.replace(/_/g, ' ')

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="rounded-lg overflow-hidden flex gap-0 bg-surface-raised hover:bg-[#222] transition-colors duration-300 group cursor-pointer"
      >
        <div className="relative w-24 shrink-0 overflow-hidden">
          {coverUrl && (
            <Image src={coverUrl} alt={title} fill sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority} />
          )}
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
            {studio && <p className="text-[11px] text-text-muted mt-0.5 truncate">{studio}</p>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <ScoreBadge score={anime.averageScore} />
            {anime.episodes && <span className="text-[11px] text-[#555]">{anime.episodes} ep</span>}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`group cursor-pointer rounded-lg overflow-hidden bg-surface-raised hover:bg-[#222] transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/50 ${variant === 'large' ? 'col-span-2 row-span-2' : ''
        }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${variant === 'large' ? 'h-80' : 'h-72'}`}>
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill
            sizes={variant === 'large' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            priority={priority} />
        ) : (
          <div className="w-full h-full bg-[#222]" />
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-surface-raised via-transparent to-transparent" />

        {/* Score badge */}
        <div className="absolute top-3 right-3">
          <ScoreBadge score={anime.averageScore} />
        </div>

        {/* Format badge */}
        {format && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-[9px] font-semibold text-text-secondary uppercase tracking-wider">
            {format}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <h3 className={`font-semibold text-white leading-snug mb-1 truncate ${variant === 'large' ? 'text-base' : 'text-sm'
          }`}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          {genres.map((g) => (
            <span key={g}>{g}</span>
          ))}
          {genres.length > 0 && anime.seasonYear && <span>·</span>}
          {anime.seasonYear && <span>{anime.seasonYear}</span>}
          {anime.episodes && (
            <>
              <span>·</span>
              <span>{anime.episodes} ep</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
