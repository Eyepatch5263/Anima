import { UnwrappedMedia } from "@/src/hooks/useAnimeData"
import { FilterState } from "./filterbar.type"

export interface BentoSectionProps {
  title: string
  data: UnwrappedMedia[]
  isLoading: boolean
  viewAllHref: string
}

export interface BentoCardProps {
  anime: UnwrappedMedia
  index: number
  isSpotlight?: boolean
}

export interface FeaturedShowcaseProps {
  trending: UnwrappedMedia[]
  seasonal: UnwrappedMedia[]
  nextSeason: UnwrappedMedia[]
  popular: UnwrappedMedia[]
  topRated: UnwrappedMedia[]
  isLoading: boolean
  currentSeason: string
  filters?: FilterState
}