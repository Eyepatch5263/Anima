import { UnwrappedMedia } from "@/src/hooks/useAnimeData"

export interface AnimeCardProps {
  anime: UnwrappedMedia
  index?: number
  variant?: 'default' | 'large' | 'compact'
  priority?: boolean
}