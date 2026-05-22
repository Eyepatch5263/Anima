'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MangaPosterCardProps {
  manga: {
    id: number
    title?: {
      userPreferred?: string | null
    } | null
    coverImage?: {
      extraLarge?: string | null
      large?: string | null
      color?: string | null
    } | null
  }
  index: number
  showRank?: boolean
}

export default function MangaPosterCard({ manga, index, showRank }: MangaPosterCardProps) {
  const coverUrl = manga.coverImage?.extraLarge || manga.coverImage?.large || ''
  const title = manga.title?.userPreferred || 'Unknown'

  return (
    <Link href={`/manga/${manga.id}`} className="group block cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.3, delay: (index % 6) * 0.04 }}
        className="w-full h-full"
      >
        <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-surface-raised mb-2">
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
            <div className="absolute top-2 left-2 min-w-[28px] h-7 px-1.5 rounded bg-accent-primary flex items-center justify-center">
              <span className="text-xs font-bold text-white">#{index + 1}</span>
            </div>
          )}
        </div>
        <p className="text-[12px] text-text-secondary group-hover:text-white leading-snug line-clamp-2 transition-colors duration-200">
          {title}
        </p>
      </motion.div>
    </Link>
  )
}
