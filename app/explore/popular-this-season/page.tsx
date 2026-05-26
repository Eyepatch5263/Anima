'use client'

import { useState, useEffect } from 'react'
import AnimeGridPage from '../../components/AnimeGridPage'

function getCurrentSeason(): { season: string; year: number } {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  if (month >= 1 && month <= 3) return { season: 'WINTER', year }
  if (month >= 4 && month <= 6) return { season: 'SPRING', year }
  if (month >= 7 && month <= 9) return { season: 'SUMMER', year }
  return { season: 'FALL', year }
}

export default function PopularThisSeasonPage() {
  const [seasonInfo, setSeasonInfo] = useState<{ season: string; year: number } | null>(null)

  useEffect(() => {
    setSeasonInfo(getCurrentSeason())
  }, [])

  if (!seasonInfo) {
    return <AnimeGridPage title="" sort="POPULARITY_DESC" />
  }

  return (
    <AnimeGridPage
      title={``}
      sort="POPULARITY_DESC"
      initialSeason={seasonInfo.season}
      initialSeasonYear={seasonInfo.year}
    />
  )
}
