import { NextResponse } from 'next/server'

const WatchingQuery = `
  query GetWatchingAnime($season: MediaSeason, $seasonYear: Int) {
    season: Page(page: 1, perPage: 6) {
      media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
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
    popular: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
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
`

function getCurrentSeason(): { season: string; year: number } {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  if (month >= 1 && month <= 3) return { season: 'WINTER', year }
  if (month >= 4 && month <= 6) return { season: 'SPRING', year }
  if (month >= 7 && month <= 9) return { season: 'SUMMER', year }
  return { season: 'FALL', year }
}

async function getCachedWatchingAnime(season: string, year: number) {
  "use cache"

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: WatchingQuery,
      variables: {
        season,
        seasonYear: year,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from AniList API: ${response.statusText}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors[0].message || 'GraphQL Error')
  }

  const popularList = json.data?.popular?.media || []
  const seasonalList = json.data?.season?.media || []

  // Combine and deduplicate
  const combined = [...popularList, ...seasonalList]
  const seen = new Set<number>()
  const deduped = combined.filter((a: any) => {
    if (!a || seen.has(a.id)) return false
    seen.add(a.id)
    return true
  }).slice(0, 6)

  return deduped
}

export async function GET() {
  try {
    const { season, year } = getCurrentSeason()
    const data = await getCachedWatchingAnime(season, year)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
