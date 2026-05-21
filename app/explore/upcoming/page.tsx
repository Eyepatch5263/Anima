'use client'

import AnimeGridPage from '../../components/AnimeGridPage'

function getNextSeason(): { season: string; year: number } {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  let currentSeason: string
  if (month >= 1 && month <= 3) currentSeason = 'WINTER'
  else if (month >= 4 && month <= 6) currentSeason = 'SPRING'
  else if (month >= 7 && month <= 9) currentSeason = 'SUMMER'
  else currentSeason = 'FALL'

  const order = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  const idx = order.indexOf(currentSeason)
  const nextIdx = (idx + 1) % 4
  const nextSeason = order[nextIdx]
  const nextYear = nextIdx === 0 ? year + 1 : year

  return { season: nextSeason, year: nextYear }
}

export default function UpcomingPage() {
  const { season, year } = getNextSeason()
  const label = season.charAt(0) + season.slice(1).toLowerCase()

  return (
    <AnimeGridPage
      title={``}
      sort="POPULARITY_DESC"
      initialSeason={season}
      initialSeasonYear={year}
    />
  )
}
