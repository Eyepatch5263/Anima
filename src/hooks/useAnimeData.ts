'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { graphql } from '@/src/graphql'
import { MediaSeason } from '@/src/graphql/graphql'
import { useFragment } from '@/src/graphql/fragment-masking'
import { MediaFragmentDoc } from '@/src/graphql/graphql'

const GetAnimeByGenres = graphql(`
    query GetAnimeByGenres($season:MediaSeason,$seasonYear:Int $nextSeason:MediaSeason,$nextYear:Int){
        trending:Page(page:1,perPage:6){
            media(sort:TRENDING_DESC,type:ANIME,isAdult:false){
            ...media
            }
        }
        season:Page(page:1,perPage:6){
            media(season:$season,seasonYear:$seasonYear,sort:POPULARITY_DESC,type:ANIME,isAdult:false){
            ...media
            }
        }
        nextSeason:Page(page:1,perPage:6){
            media(season:$nextSeason,seasonYear:$nextYear,sort:POPULARITY_DESC,type:ANIME,isAdult:false){
            ...media
            }
        }
        popular:Page(page:1,perPage:6){
            media(sort:POPULARITY_DESC,type:ANIME,isAdult:false){
            ...media
            }
        }
        top:Page(page:1,perPage:10){
            media(sort:SCORE_DESC,type:ANIME,isAdult:false){
            ...media
            }
        }
    }
    fragment media on Media{
        id 
        title{
            userPreferred
        }
        coverImage{
            extraLarge 
            large 
            color
        }
        startDate{
            year 
            month 
            day
        }
        endDate{
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
        status(version:2)
        episodes 
        duration 
        chapters 
        volumes 
        genres 
        isAdult 
        averageScore 
        popularity 
        mediaListEntry{
            id 
            status
        }
        nextAiringEpisode{
            airingAt 
            timeUntilAiring 
            episode
        }
        studios(isMain:true){
            edges{
                isMain 
                node{
                    id 
                    name
                }
            }
        }
    }
`)

function getCurrentSeason(): { season: MediaSeason; year: number } {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  let season: MediaSeason
  if (month >= 1 && month <= 3) season = 'WINTER'
  else if (month >= 4 && month <= 6) season = 'SPRING'
  else if (month >= 7 && month <= 9) season = 'SUMMER'
  else season = 'FALL'

  return { season, year }
}

function getNextSeason(current: MediaSeason, year: number): { season: MediaSeason; year: number } {
  const order: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  const idx = order.indexOf(current)
  const nextIdx = (idx + 1) % 4
  return {
    season: order[nextIdx],
    year: nextIdx === 0 ? year + 1 : year,
  }
}

export type UnwrappedMedia = {
  id: number
  title: { userPreferred: string | null } | null
  coverImage: { extraLarge: string | null; large: string | null; color: string | null } | null
  bannerImage: string | null
  season: MediaSeason | null
  seasonYear: number | null
  description: string | null
  type: string | null
  format: string | null
  status: string | null
  episodes: number | null
  duration: number | null
  genres: Array<string | null> | null
  averageScore: number | null
  popularity: number | null
  studios: {
    edges: Array<{
      isMain: boolean
      node: { id: number; name: string } | null
    } | null> | null
  } | null
  nextAiringEpisode: {
    airingAt: number
    timeUntilAiring: number
    episode: number
  } | null
}

export function useAnimeData() {
  const [seasonInfo, setSeasonInfo] = useState<{
    season: MediaSeason
    year: number
    nextSeason: MediaSeason
    nextYear: number
  } | null>(null)

  useEffect(() => {
    const current = getCurrentSeason()
    const next = getNextSeason(current.season, current.year)
    setSeasonInfo({
      season: current.season,
      year: current.year,
      nextSeason: next.season,
      nextYear: next.year,
    })
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['anime-landing', seasonInfo],
    queryFn: async () => {
      if (!seasonInfo) return null
      const { season, year, nextSeason, nextYear } = seasonInfo
      const url = `/api/explore-data?season=${season}&seasonYear=${year}&nextSeason=${nextSeason}&nextYear=${nextYear}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch cached explore data')
      }
      return response.json()
    },
    enabled: !!seasonInfo,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  // Unwrap fragments
  const unwrapList = (list: any[] | null | undefined) => {
    if (!list) return []
    return list
      .filter(Boolean)
      .map((item: any) => useFragment(MediaFragmentDoc, item))
      .filter(Boolean) as UnwrappedMedia[]
  }

  return {
    trending: unwrapList(data?.trending?.media),
    seasonal: unwrapList(data?.season?.media),
    nextSeason: unwrapList(data?.nextSeason?.media),
    popular: unwrapList(data?.popular?.media),
    topRated: unwrapList(data?.top?.media),
    isLoading: isLoading || !seasonInfo,
    error,
    currentSeason: seasonInfo?.season || 'WINTER',
    currentYear: seasonInfo?.year || 2026,
  }
}

export const prefetchAnimeLanding = (queryClient: any) => {
  const current = getCurrentSeason()
  const next = getNextSeason(current.season, current.year)
  const seasonInfo = {
    season: current.season,
    year: current.year,
    nextSeason: next.season,
    nextYear: next.year,
  }
  return queryClient.prefetchQuery({
    queryKey: ['anime-landing', seasonInfo],
    queryFn: async () => {
      const url = `/api/explore-data?season=${seasonInfo.season}&seasonYear=${seasonInfo.year}&nextSeason=${seasonInfo.nextSeason}&nextYear=${seasonInfo.nextYear}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch cached explore data')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}
