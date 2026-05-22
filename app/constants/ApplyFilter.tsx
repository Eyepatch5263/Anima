import { UnwrappedMedia } from "@/src/hooks/useAnimeData"
import { FilterState } from "../types/filterbar.type"

export function applyFilters(data: UnwrappedMedia[], filters: FilterState): UnwrappedMedia[] {
  return data.filter(anime => {
    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const title = (anime.title?.userPreferred || '').toLowerCase()
      if (!title.includes(query)) return false
    }

    // Genre
    if (filters.genre) {
      const genres = (anime.genres || []).filter(Boolean) as string[]
      if (!genres.includes(filters.genre)) return false
    }

    // Year
    if (filters.year) {
      if (anime.seasonYear !== Number(filters.year)) return false
    }

    // Season
    if (filters.season) {
      if (anime.season !== filters.season) return false
    }

    // Format
    if (filters.format) {
      if (anime.format !== filters.format) return false
    }

    // Status
    if (filters.status) {
      if (anime.status !== filters.status) return false
    }

    return true
  })
}
