import { UnwrappedMedia } from "@/src/hooks/useAnimeData"
import { ChevronRightIcon, CrownIcon } from "../constants/icons"
import Link from "next/link"
import { MosaicSkeleton } from "@/skeletons/MosaicSkeleton"
import { MosaicCard } from "./TrendingGrid"

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
          <CrownIcon size={14} className="text-accent-primary" />
          Top 100 Anime
        </h3>
        <Link
          href="/explore/top-100"
          className="text-xs text-text-muted hover:text-white flex items-center gap-0.5 transition-colors"
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