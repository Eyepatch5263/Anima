'use client'

import AnimeGridPage from '../../components/AnimeGridPage'

export default function Top100Page() {
  return (
    <AnimeGridPage
      title=""
      sort="SCORE_DESC"
      showRank={true}
    />
  )
}
