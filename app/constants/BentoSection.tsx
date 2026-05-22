import Link from "next/link"
import { ChevronRightIcon } from "./icons"
import { BentoSkeleton } from "@/skeletons/BentoSkeleton"
import { BentoSectionProps } from "../types/featured.showcase"
import { BentoCard } from "./BentoCard"


export function BentoSection({ title, data, isLoading, viewAllHref }: BentoSectionProps) {
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
          className="text-md text-text-muted hover:text-white flex items-center gap-0.5 transition-colors"
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