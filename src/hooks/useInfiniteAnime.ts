'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { graphql } from '@/src/graphql'
import { execute } from '@/src/graphql/execute'
import { useFragment } from '@/src/graphql/fragment-masking'
import { MediaFragmentDoc, MediaSeason } from '@/src/graphql/graphql'
import type { UnwrappedMedia } from './useAnimeData'

/* ── Paginated query ───────────────────────── */

const PaginatedAnimeQuery = graphql(`
  query PaginatedAnime(
    $page: Int,
    $perPage: Int,
    $sort: [MediaSort],
    $season: MediaSeason,
    $seasonYear: Int,
    $genre: String,
    $format: MediaFormat,
    $status: MediaStatus,
    $search: String
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        sort: $sort,
        type: ANIME,
        isAdult: false,
        season: $season,
        seasonYear: $seasonYear,
        genre: $genre,
        format: $format,
        status: $status,
        search: $search
      ) {
        ...media
      }
    }
  }
`)

/* ── Sort type mapping ──────────────────────── */

export type SortType = 'TRENDING_DESC' | 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC' | 'FAVOURITES_DESC'

/* ── Category config ────────────────────────── */

export interface CategoryConfig {
  title: string
  sort: SortType
  season?: string
  seasonYear?: number
  showRank?: boolean
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  trending: {
    title: 'Trending Now',
    sort: 'TRENDING_DESC',
  },
  'popular-this-season': {
    title: 'Popular This Season',
    sort: 'POPULARITY_DESC',
  },
  upcoming: {
    title: 'Upcoming Next Season',
    sort: 'POPULARITY_DESC',
  },
  'all-time-popular': {
    title: 'All-Time Popular Anime',
    sort: 'POPULARITY_DESC',
  },
  'top-100': {
    title: 'Top 100 Anime',
    sort: 'SCORE_DESC',
    showRank: true,
  },
}

/* ── Hook: Infinite anime list ──────────────── */

interface UseInfiniteAnimeOptions {
  sort: SortType
  perPage?: number
  season?: MediaSeason
  seasonYear?: number
  // Filters
  genre?: string
  format?: string
  status?: string
  search?: string
}

export function useInfiniteAnime({
  sort,
  perPage = 18,
  season,
  seasonYear,
  genre,
  format,
  status,
  search,
}: UseInfiniteAnimeOptions) {
  const result = useInfiniteQuery({
    queryKey: ['anime-paginated', sort, perPage, season, seasonYear, genre, format, status, search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await execute(PaginatedAnimeQuery, {
        page: pageParam,
        perPage,
        sort: [sort] as any,
        season: season || undefined,
        seasonYear: seasonYear || undefined,
        genre: genre || undefined,
        format: (format || undefined) as any,
        status: (status || undefined) as any,
        search: search || undefined,
      })
      return res
    },
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage?.Page?.pageInfo
      if (pageInfo?.hasNextPage) {
        return (pageInfo.currentPage || 1) + 1
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  // Flatten all pages into a single array of unwrapped media
  const allMedia: UnwrappedMedia[] = (result.data?.pages || []).flatMap(page => {
    const list = page?.Page?.media || []
    return list
      .filter(Boolean)
      .map((item: any) => useFragment(MediaFragmentDoc, item))
      .filter(Boolean) as UnwrappedMedia[]
  })

  return {
    data: allMedia,
    isLoading: result.isLoading,
    isFetchingNextPage: result.isFetchingNextPage,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    total: result.data?.pages?.[0]?.Page?.pageInfo?.total || 0,
  }
}
