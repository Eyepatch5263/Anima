import { SortType } from "@/src/hooks/useInfiniteAnime"

export interface AnimeGridPageProps {
  title: string
  sort: SortType
  showRank?: boolean
  initialSeason?: string
  initialSeasonYear?: number
}