import { NextResponse } from 'next/server'

// GraphQL query to get the five key categories shown on the explore page
const GetAnimeByGenresQuery = `
  query GetAnimeByGenresServer($season: MediaSeason, $seasonYear: Int, $nextSeason: MediaSeason, $nextYear: Int) {
    trending: Page(page: 1, perPage: 6) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
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
    nextSeason: Page(page: 1, perPage: 6) {
      media(season: $nextSeason, seasonYear: $nextYear, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
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
    top: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
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

// Next.js "use cache" function to cache the GraphQL response on Vercel
async function getCachedExploreData(season: string, seasonYear: number, nextSeason: string, nextYear: number) {
  "use cache"
  
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: GetAnimeByGenresQuery,
      variables: {
        season,
        seasonYear,
        nextSeason,
        nextYear,
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

  return json.data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get('season') || 'WINTER'
  const seasonYear = Number(searchParams.get('seasonYear') || new Date().getFullYear())
  const nextSeason = searchParams.get('nextSeason') || 'SPRING'
  const nextYear = Number(searchParams.get('nextYear') || new Date().getFullYear())

  try {
    const data = await getCachedExploreData(season, seasonYear, nextSeason, nextYear)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
