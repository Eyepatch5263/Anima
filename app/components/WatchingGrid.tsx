'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarIcon } from './icons'
import type { WatchingGridProps } from '@/app/types/watching.grid.type'
import type { MagazineCardProps } from '@/app/types/watching.grid.type'
import GridSkeleton from '@/skeletons/GridSkeleton'


function MagazineCard({ anime, index, featured = false }: MagazineCardProps) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).filter(Boolean).slice(0, 3) as string[]
  const studio = anime.studios?.edges?.find(e => e?.isMain)?.node?.name
  const score = anime.averageScore

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`group cursor-pointer relative overflow-hidden rounded-lg ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-full min-h-[400px]' : 'h-64'}`}>
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-[#222]" />
        )}

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />

        {/* Score */}
        {score && (
          <div className="absolute top-3 right-3">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              score >= 80 ? 'score-high' : score >= 70 ? 'score-mid' : 'score-low'
            }`}>
              <StarIcon size={8} />
              {score}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className={`font-bold text-white leading-snug mb-2 ${featured ? 'text-xl md:text-2xl' : 'text-sm'}`}>
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            {genres.map((g, i) => (
              <React.Fragment key={g}>
                {i > 0 && <span className="text-[#555]">·</span>}
                <span>{g}</span>
              </React.Fragment>
            ))}
            {studio && (
              <>
                <span className="text-[#555]">·</span>
                <span className="text-text-muted">{studio}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

<GridSkeleton/>

export default function WatchingGrid({ popular, seasonal, isLoading }: WatchingGridProps) {
  const combined = [...popular, ...seasonal]
  const seen = new Set<number>()
  const deduped = combined.filter(a => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  }).slice(0, 6)

  return (
    <section id="trending" className="relative py-10 max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-4xl font-bold text-white uppercase tracking-wider">
          What Everyone&apos;s Watching
        </h3>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <GridSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-fr">
          {deduped.map((anime, i) => (
            <MagazineCard key={anime.id} anime={anime} index={i} featured={i === 0} />
          ))}
        </div>
      )}
    </section>
  )
}
