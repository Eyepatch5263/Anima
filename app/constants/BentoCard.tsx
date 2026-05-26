import Image from "next/image"
import { BentoCardProps } from "../types/featured.showcase"
import Link from "next/link"
import { StarIcon, FireIcon } from "./icons"
import { motion } from "framer-motion"
import { useQueryClient } from '@tanstack/react-query'
import { prefetchAnimeDetails } from '@/src/anime/GenereQuery'

export function BentoCard({ anime, index, isSpotlight = false }: BentoCardProps) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const bannerUrl = anime.bannerImage || coverUrl
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).slice(0, 3)
  const score = anime.averageScore
  const queryClient = useQueryClient()

  if (isSpotlight) {
    return (
      <Link
        href={`/anime/${anime.id}`}
        className="col-span-2 md:col-span-2 md:row-span-2"
        onMouseEnter={() => prefetchAnimeDetails(queryClient, anime.id)}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="w-full h-full relative overflow-hidden rounded-2xl bg-surface-raised/40 border border-white/5 group flex flex-col justify-end p-5 md:p-6 cursor-pointer min-h-[220px] md:min-h-0 aspect-video md:aspect-auto"
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
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-black/10" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start max-w-lg">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-accent-primary text-white mb-2">
              <FireIcon size={10} strokeWidth={2.5} />
              Spotlight
            </span>

            <h4 className="text-sm md:text-xl font-bold text-white leading-tight mb-1.5 group-hover:text-accent-primary transition-colors line-clamp-1">
              {title}
            </h4>

            <p className="text-[10px] md:text-xs text-text-muted line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">
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
    <Link
      href={`/anime/${anime.id}`}
      onMouseEnter={() => prefetchAnimeDetails(queryClient, anime.id)}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className="w-full h-full relative overflow-hidden rounded-xl bg-surface-raised/40 border border-white/5 group aspect-2/3 flex flex-col justify-end p-3 cursor-pointer"
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
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent group-hover:via-black/60 transition-all duration-300" />
          </div>
        )}

        {/* Info on bottom */}
        <div className="relative z-10">
          <h5 className="text-[11px] md:text-xs font-bold text-white line-clamp-1 mb-1 group-hover:text-accent-primary transition-colors">
            {title}
          </h5>
          <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
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