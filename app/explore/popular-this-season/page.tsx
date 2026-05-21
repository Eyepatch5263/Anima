'use client'

import AnimeGridPage from '../../components/AnimeGridPage'

function getCurrentSeason(): { season: string; year: number } {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  if (month >= 1 && month <= 3) return { season: 'WINTER', year }
  if (month >= 4 && month <= 6) return { season: 'SPRING', year }
  if (month >= 7 && month <= 9) return { season: 'SUMMER', year }
  return { season: 'FALL', year }
}

export default function PopularThisSeasonPage() {
  const { season, year } = getCurrentSeason()
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
