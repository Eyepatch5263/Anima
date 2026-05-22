import { genreColors } from "@/app/constants/trending"
import { UnwrappedMedia } from "@/src/hooks/useAnimeData"

export function formatEpisodes(anime: UnwrappedMedia): string {
  if (anime.format === 'MOVIE') {
    const mins = anime.duration
    if (mins) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    }
    return 'Movie'
  }
  return anime.episodes ? `${anime.episodes} eps` : '—'
}

export function formatType(format: string | null): string {
  if (!format) return '—'
  switch (format) {
    case 'TV': return 'TV Show'
    case 'TV_SHORT': return 'TV Short'
    case 'MOVIE': return 'Movie'
    case 'SPECIAL': return 'Special'
    case 'OVA': return 'OVA'
    case 'ONA': return 'ONA'
    case 'MUSIC': return 'Music'
    default: return format
  }
}

export function getGenreColor(genre: string) {
  return genreColors[genre] || 'bg-white/10 text-white/80'
}