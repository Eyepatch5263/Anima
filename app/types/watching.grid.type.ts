import type { UnwrappedMedia } from "@/src/hooks/useAnimeData";

export interface WatchingGridProps {
  popular: UnwrappedMedia[]
  seasonal: UnwrappedMedia[]
  isLoading: boolean
}

export interface MagazineCardProps {
  anime: UnwrappedMedia
  index: number
  featured?: boolean
}