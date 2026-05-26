'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarIcon } from '../constants/icons'
import type { WatchingGridProps } from '@/app/types/watching.grid.type'
import type { MagazineCardProps } from '@/app/types/watching.grid.type'
import GridSkeleton from '@/skeletons/GridSkeleton'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { prefetchAnimeDetails } from '@/src/anime/GenereQuery'


function MagazineCard({ anime, index, featured = false }: MagazineCardProps) {
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || ''
  const title = anime.title?.userPreferred || 'Unknown'
  const genres = (anime.genres || []).filter(Boolean).slice(0, 3) as string[]
  const studio = anime.studios?.edges?.find(e => e?.isMain)?.node?.name
  const score = anime.averageScore
  const queryClient = useQueryClient()

  return (
    <Link
      href={`/anime/${anime.id}`}
      onMouseEnter={() => prefetchAnimeDetails(queryClient, anime.id)}
      className={`block cursor-pointer relative overflow-hidden rounded-2xl group border border-white/5 bg-[#141414] ${
        featured ? 'md:col-span-2 md:row-span-2 h-[450px] md:h-full' : 'h-[220px]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        className="w-full h-full relative"
      >
      <Image
        src={coverUrl}
        alt={title}
        fill
        sizes={featured ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 100vw, 400px'}
        priority={index === 0}
        className="object-cover object-center scale-102 transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#000000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      {featured && <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />}

      {/* Info Elements */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Rating Badge */}
        {score && (
          <div className="flex justify-between items-start">
            <div className="px-2.5 py-1 rounded bg-[#ffffff10] backdrop-blur-md border border-white/10 text-white text-[11px] font-bold tracking-wider flex items-center gap-1 shadow-lg shadow-black/10">
              <StarIcon size={12} className="text-yellow-500 fill-yellow-500" />
              {score}
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <h3 className={`font-bold text-white leading-snug mb-2 ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
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
    </Link>
  )
}

export default function WatchingGrid({ popular = [], seasonal = [], isLoading: propsIsLoading }: Partial<WatchingGridProps>) {
  const [watchingAnimes, setWatchingAnimes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWatchingData() {
      try {
        const res = await fetch('/api/watching-anime')
        const data = await res.json()
        setWatchingAnimes(data)
        setLoading(false)
      } catch (e) {
        console.error('Error loading watching anime:', e)
        setLoading(false)
      }
    }

    if (popular.length > 0 || seasonal.length > 0) {
      const combined = [...popular, ...seasonal]
      const seen = new Set<number>()
      const deduped = combined.filter(a => {
        if (!a || seen.has(a.id)) return false
        seen.add(a.id)
        return true
      }).slice(0, 6)
      setWatchingAnimes(deduped)
      setLoading(!!propsIsLoading)
    } else {
      loadWatchingData()
    }
  }, [popular, seasonal, propsIsLoading])

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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <GridSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-fr">
          {watchingAnimes.map((anime, i) => (
            <MagazineCard key={anime.id} anime={anime} index={i} featured={i === 0} />
          ))}
        </div>
      )}
    </section>
  )
}
