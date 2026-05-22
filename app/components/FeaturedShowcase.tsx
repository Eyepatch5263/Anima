'use client'

import { FeaturedShowcaseProps } from '../types/featured.showcase'
import { BentoSection } from '../constants/BentoSection'
import { applyFilters } from '../constants/ApplyFilter'

/* ── Main Showcase Component ──────────────── */

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
