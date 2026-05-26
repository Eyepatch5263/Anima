'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { graphql } from '@/src/graphql'
import { execute } from '@/src/graphql/execute'
import { MediaFormat, MediaStatus, MediaSort } from '@/src/graphql/graphql'

const PaginatedMangaQuery = graphql(`
  query PaginatedManga(
    $page: Int
    $search: String
    $genres: [String]
    $format: [MediaFormat]
    $status: MediaStatus
    $seasonYear: Int
    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
  ) {
    Page(page: $page, perPage: 18) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        search: $search
        genre_in: $genres
        format_in: $format
        status: $status
        seasonYear: $seasonYear
        sort: $sort
        type: MANGA
        isAdult: false
      ) {
        id
        title {
          userPreferred
        }
        coverImage {
          extraLarge
          large
          color
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        bannerImage
        season
        seasonYear
        description
        type
        format
        status(version: 2)
        episodes
        duration
        chapters
        volumes
        genres
        isAdult
        averageScore
        popularity
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        mediaListEntry {
          id
          status
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`)

interface UseInfiniteMangaOptions {
  sort: MediaSort[]
  genres?: string[]
  format?: MediaFormat[]
  status?: MediaStatus
  seasonYear?: number
  search?: string
}

export function useInfiniteManga({
  sort,
  genres,
  format,
  status,
  seasonYear,
  search,
}: UseInfiniteMangaOptions) {
  const result = useInfiniteQuery({
    queryKey: ['manga-paginated', sort, genres, format, status, seasonYear, search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await execute(PaginatedMangaQuery, {
        page: pageParam,
        genres: genres && genres.length > 0 ? genres : undefined,
        format: format && format.length > 0 ? format : undefined,
        status: status || undefined,
        seasonYear: seasonYear || undefined,
        search: search || undefined,
        sort,
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

  // Flatten all pages
  const allMedia = (result.data?.pages || []).flatMap(page => {
    return (page?.Page?.media || []).filter(Boolean)
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

export const prefetchMangaLanding = (queryClient: any) => {
  const sort = ['POPULARITY_DESC', 'SCORE_DESC'] as MediaSort[]
  return queryClient.prefetchInfiniteQuery({
    queryKey: ['manga-paginated', sort, undefined, undefined, undefined, undefined, undefined],
    queryFn: () => execute(PaginatedMangaQuery, {
      page: 1,
      sort,
    }),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })
}
