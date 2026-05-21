'use client'

import React, { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GetAnimeByIdQuery, GetCharactersAndVAsQuery, GetStaffQuery, GetTrendsAndRankingsQuery } from '@/src/anime/GenereQuery'
import { Chart as ReactChart, AxisOptions } from 'react-charts'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { StarIcon, HeartIcon, ChevronRightIcon } from '../../components/icons'

// React 19 compatibility wrapper for react-charts which ignores defaultProps on function components.
function Chart(props: any) {
  const defaults = {
    getDatums: (d: any) => (Array.isArray(d) ? d : d.datums || d.data),
    getLabel: (d: any, i: number) => d.label || `Series ${i + 1}`,
    getSeriesID: (d: any, i: number) => i,
    getR: (d: any) => (Array.isArray(d) ? d[2] : d.radius || d.r),
    getPrimaryAxisID: (s: any) => s.primaryAxisID,
    getSecondaryAxisID: (s: any) => s.secondaryAxisID,
    getSeriesStyle: (series: any) => ({
      color: series.originalSeries.color || '#e50914',
    }),
    getDatumStyle: () => ({}),
    getSeriesOrder: (d: any) => d,
    onHover: () => {},
    grouping: 'primary',
    focus: 'auto',
    showVoronoi: false,
  }

  return <ReactChart {...defaults} {...props} />
}

// Format helper
function formatStatus(status: string | null): string {
  if (!status) return 'Unknown'
  return status.toLowerCase().replace(/_/g, ' ')
}

// Date helper
function formatDate(date: { year?: number | null; month?: number | null; day?: number | null } | null): string {
  if (!date || !date.year) return '—'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const m = date.month ? months[date.month - 1] : ''
  const d = date.day ? `${date.day}, ` : ''
  return `${m} ${d}${date.year}`
}

// Airing countdown helper
function formatAiringCountdown(timeUntilAiring: number): string {
  const days = Math.floor(timeUntilAiring / (3600 * 24))
  const hours = Math.floor((timeUntilAiring % (3600 * 24)) / 3600)
  const minutes = Math.floor((timeUntilAiring % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`)

  return parts.join(' ')
}

interface StatusDatum {
  status: string
  amount: number
}

function StatusChart({ data }: { data: StatusDatum[] }) {
  const chartData = React.useMemo(() => [
    {
      label: 'Users',
      data: data
    }
  ], [data])

  const axes = React.useMemo<AxisOptions<StatusDatum>[]>(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const series = React.useMemo(() => ({ type: 'line' as const }), [])

  const getPrimary = React.useCallback((datum: StatusDatum) => datum.status, [])
  const getSecondary = React.useCallback((datum: StatusDatum) => datum.amount, [])

  return (
    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
      <h4 className="text-xs font-bold text-[#b3b3b3] mb-4 uppercase tracking-wider">
        Status Distribution
      </h4>
      <div className="flex-1 min-h-0 relative">
        <Chart
          data={chartData}
          axes={axes}
          series={series}
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          dark
        />
      </div>
    </div>
  )
}

interface ScoreDatum {
  score: string
  amount: number
}

function ScoreChart({ data }: { data: ScoreDatum[] }) {
  const chartData = React.useMemo(() => [
    {
      label: 'Votes',
      data: data
    }
  ], [data])

  const axes = React.useMemo<AxisOptions<ScoreDatum>[]>(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const series = React.useMemo(() => ({ type: 'line' as const }), [])

  const getPrimary = React.useCallback((datum: ScoreDatum) => datum.score, [])
  const getSecondary = React.useCallback((datum: ScoreDatum) => datum.amount, [])

  return (
    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
      <h4 className="text-xs font-bold text-[#b3b3b3] mb-4 uppercase tracking-wider">
        Score Distribution
      </h4>
      <div className="flex-1 min-h-0 relative">
        <Chart
          data={chartData}
          axes={axes}
          series={series}
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          dark
        />
      </div>
    </div>
  )
}

function formatDaySuffix(day: number): string {
  if (day > 3 && day < 21) return day + 'th';
  switch (day % 10) {
    case 1:  return day + "st";
    case 2:  return day + "nd";
    case 3:  return day + "rd";
    default: return day + "th";
  }
}

function formatTrendDate(timestamp: number | null | undefined): string {
  if (!timestamp) return ''
  const dateObj = new Date(timestamp * 1000)
  const day = dateObj.getDate()
  return formatDaySuffix(day)
}

interface ActivityDatum {
  date: string
  trending: number
}

function RecentActivityChart({ data }: { data: ActivityDatum[] }) {
  const chartData = React.useMemo(() => [
    {
      label: 'Activity',
      data: data
    }
  ], [data])

  const axes = React.useMemo<AxisOptions<ActivityDatum>[]>(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const series = React.useMemo(() => ({ type: 'line' as const }), [])

  const getPrimary = React.useCallback((datum: ActivityDatum) => datum.date, [])
  const getSecondary = React.useCallback((datum: ActivityDatum) => datum.trending, [])

  return (
    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
      <h4 className="text-xs font-bold text-[#b3b3b3] mb-4 uppercase tracking-wider">
        Recent Activity Per Day
      </h4>
      <div className="flex-1 min-h-0 relative">
        <Chart
          data={chartData}
          axes={axes}
          series={series}
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          dark
        />
      </div>
    </div>
  )
}

interface AiringScoreDatum {
  episode: string
  score: number
}

function AiringScoreChart({ data }: { data: AiringScoreDatum[] }) {
  const chartData = React.useMemo(() => [
    {
      label: 'Average Score',
      data: data
    }
  ], [data])

  const axes = React.useMemo<AxisOptions<AiringScoreDatum>[]>(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const series = React.useMemo(() => ({ type: 'line' as const }), [])

  const getPrimary = React.useCallback((datum: AiringScoreDatum) => datum.episode, [])
  const getSecondary = React.useCallback((datum: AiringScoreDatum) => datum.score, [])

  return (
    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
      <h4 className="text-xs font-bold text-[#b3b3b3] mb-4 uppercase tracking-wider">
        Airing Score Progression
      </h4>
      <div className="flex-1 min-h-0 relative">
        <Chart
          data={chartData}
          axes={axes}
          series={series}
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          dark
        />
      </div>
    </div>
  )
}

interface AiringWatchersDatum {
  episode: string
  watchers: number
}

function AiringWatchersChart({ data }: { data: AiringWatchersDatum[] }) {
  const chartData = React.useMemo(() => [
    {
      label: 'Watchers',
      data: data
    }
  ], [data])

  const axes = React.useMemo<AxisOptions<AiringWatchersDatum>[]>(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const series = React.useMemo(() => ({ type: 'line' as const }), [])

  const getPrimary = React.useCallback((datum: AiringWatchersDatum) => datum.episode, [])
  const getSecondary = React.useCallback((datum: AiringWatchersDatum) => datum.watchers, [])

  return (
    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
      <h4 className="text-xs font-bold text-[#b3b3b3] mb-4 uppercase tracking-wider">
        Airing Watchers Progression
      </h4>
      <div className="flex-1 min-h-0 relative">
        <Chart
          data={chartData}
          axes={axes}
          series={series}
          getPrimary={getPrimary}
          getSecondary={getSecondary}
          dark
        />
      </div>
    </div>
  )
}


export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = parseInt(resolvedParams.id, 10)
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'stats' | 'characters'>('overview')
  const [hasMounted, setHasMounted] = React.useState(false)
  const [charPage, setCharPage] = useState(1)
  const [allCharacters, setAllCharacters] = useState<any[]>([])
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  const [staffPage, setStaffPage] = useState(1)
  const [allStaff, setAllStaff] = useState<any[]>([])
  const staffLoaderRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  React.useEffect(() => {
    setCharPage(1)
    setAllCharacters([])
    setStaffPage(1)
    setAllStaff([])
  }, [id])

  // Fetch using the pre-existing graphql hook
  const overviewData = GetAnimeByIdQuery({
    id,
    type: 'ANIME',
    isAdult: false,
  })

  console.log("overview data:",overviewData)

  const staffData = GetStaffQuery({
    id,
    page: staffPage,
  })

  const statsData = GetTrendsAndRankingsQuery({
    id
  })

  const charactersData = GetCharactersAndVAsQuery({
    id,
    page: charPage,
  })

  React.useEffect(() => {
    if (charactersData?.Media?.characters?.edges) {
      setAllCharacters(prev => {
        const existingIds = new Set(prev.map(e => e?.id))
        const newEdges = (charactersData?.Media?.characters?.edges || []).filter(e => e && !existingIds.has(e.id))
        return [...prev, ...newEdges]
      })
    }
  }, [charactersData])

  React.useEffect(() => {
    if (staffData?.Media?.staff?.edges) {
      setAllStaff(prev => {
        const existingIds = new Set(prev.map(e => e?.id))
        const newEdges = (staffData?.Media?.staff?.edges || []).filter(e => e && !existingIds.has(e.id))
        return [...prev, ...newEdges]
      })
    }
  }, [staffData])

  const hasNextPage = charactersData?.Media?.characters?.pageInfo?.hasNextPage
  const hasNextStaffPage = staffData?.Media?.staff?.pageInfo?.hasNextPage

  React.useEffect(() => {
    if (!hasNextPage || activeTab !== 'characters') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCharPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, activeTab])

  React.useEffect(() => {
    if (!hasNextStaffPage || activeTab !== 'staff') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStaffPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (staffLoaderRef.current) {
      observer.observe(staffLoaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextStaffPage, activeTab])

  const anime = overviewData?.Media
  const isLoading = !overviewData

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#141414] text-white">
        <BackgroundParticles />
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 animate-pulse">
          {/* Skeleton Banner */}
          <div className="h-64 sm:h-96 rounded-3xl bg-white/[0.02] border border-white/5 w-full mb-8" />
          {/* Skeleton columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="aspect-[2/3] rounded-2xl bg-white/[0.02] border border-white/5 w-full" />
              <div className="h-20 rounded-xl bg-white/[0.02] border border-white/5 w-full" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="h-8 bg-white/[0.02] w-1/3 rounded-lg" />
              <div className="h-4 bg-white/[0.02] w-full rounded" />
              <div className="h-4 bg-white/[0.02] w-5/6 rounded" />
              <div className="h-32 bg-white/[0.02] rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="relative min-h-screen bg-[#141414] text-white flex flex-col">
        <BackgroundParticles />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-32">
          <p className="text-[#808080] text-lg mb-4">Anime not found</p>
          <Link href="/explore" className="px-5 py-2.5 rounded bg-[#e50914] text-white font-bold hover:bg-[#f6121d] transition-colors">
            Go Back
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const title = anime.title?.userPreferred || anime.title?.english || anime.title?.romaji || 'Unknown Title'
  const genres = (anime.genres || []).filter(Boolean) as string[]
  const tags = anime?.tags
  const description = anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'

  return (
    <div className="relative min-h-screen bg-[#141414] text-[#e5e5e5] overflow-x-hidden">
      {/* Background Constellation Particles */}
      <BackgroundParticles />

      <Navbar />

      {/* Cinematic Banner */}
      <div className="relative w-full h-[35vh] sm:h-[55vh] overflow-hidden z-0 border-b border-white/5">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-65 blur-[1px]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#141414]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-[#141414]/80" />
      </div>

      {/* Detail Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 -mt-24 sm:-mt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Left Column: Poster & Meta Cards */}
          <div className="flex flex-col gap-6">
            {/* Poster Card */}
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1a1a1a]">
              {anime.coverImage?.extraLarge || anime.coverImage?.large ? (
                <Image
                  src={anime.coverImage.extraLarge || anime.coverImage.large || ''}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
            </div>

            {/* Score & Popularity Panel */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 space-y-4">
              {anime.averageScore && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#808080] block mb-1">Average Score</span>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-[#46d369]/10 text-[#46d369] border border-[#46d369]/20 font-bold text-sm">
                      {anime.averageScore}%
                    </div>
                    <span className="text-xs text-[#b3b3b3]">by community vote</span>
                  </div>
                </div>
              )}

              {anime.popularity && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#808080] block mb-1">Popularity</span>
                  <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                    <StarIcon size={14} className="text-[#e87c03]" />
                    {anime.popularity.toLocaleString()}
                  </div>
                </div>
              )}

              {anime.favourites && (
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#808080] block mb-1">Favorites</span>
                  <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                    <HeartIcon size={14} className="text-[#e50914]" />
                    {anime.favourites.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar quick info */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 space-y-3.5 text-xs">
              <h4 className="font-bold text-white uppercase font-mono tracking-widest border-b border-white/5 pb-2 text-[10px]">
                Information
              </h4>
              <div className="flex justify-end gap-2">
                <span className="text-[#808080]">Original Title: </span>
                <span className="font-semibold text-white text-xs">{anime.title?.romaji || '—'}</span>
              </div>
              <div className="flex justify-end gap-2">
                <span className="text-[#808080]">English Title: </span>
                <span className="font-semibold text-white text-xs">{anime.title?.english || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Format:</span>
                <span className="font-semibold text-white">{anime.format || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Episodes:</span>
                <span className="font-semibold text-white">
                  {anime.episodes ? `${anime.episodes} (${anime.duration || '—'}m)` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Status:</span>
                <span className="font-semibold text-white capitalize">{formatStatus(anime.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Season:</span>
                <span className="font-semibold text-white capitalize">
                  {anime.season ? `${anime.season.toLowerCase()} ${anime.seasonYear || ''}` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Studio:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {anime.studios?.edges?.find(e => e?.isMain)?.node?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Source:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {anime.source?.split('_').map(s => s.toLowerCase()).join(' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Start Date:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {formatDate(anime.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">End Date:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {formatDate(anime.endDate)}
                </span>
              </div>
              {anime.nextAiringEpisode && (
                <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3.5 mt-1">
                  <span className="text-[#808080] text-[10px] uppercase font-mono tracking-wider">Next Episode</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#e50914] bg-[#e50914]/10 border border-[#e50914]/20 px-1.5 py-0.5 rounded">
                      Episode {anime.nextAiringEpisode.episode}
                    </span>
                    <span className="font-semibold text-white">
                      in {formatAiringCountdown(anime.nextAiringEpisode.timeUntilAiring)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Synopsis, Cast, etc. */}
          <div className="lg:col-span-3 space-y-8 text-left">
            {/* Title & Aliases */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>
              {anime.title?.english && anime.title.english !== title && (
                <h2 className="text-lg font-medium text-[#b3b3b3] mt-2">
                  {anime.title.english}
                </h2>
              )}
              {anime.title?.romaji && anime.title.romaji !== title && anime.title.romaji !== anime.title?.english && (
                <span className="text-xs text-[#808080] block mt-1">
                  Native: {anime.title.romaji}
                </span>
              )}
            </div>

            {/* Genre tags row */}
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/5 text-white/90 hover:bg-white/[0.08] transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags?.map(tag => (
                <span
                  key={tag?.name}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/5 text-white/90 hover:bg-white/[0.08] transition-colors"
                >
                  {tag?.name}
                </span>
              ))}
            </div>

            {/* Synopsis Panel */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#e50914]/10 text-[#e50914] text-[9px] font-bold tracking-wider uppercase mb-3.5 w-fit border border-[#e50914]/20">
                NARRATIVE SYNOPSIS
              </span>
              <p className="text-sm md:text-base text-[#b3b3b3] leading-relaxed">
                {description}
              </p>
            </div>

            {/* Tabs Selector */}
            <div className="border-b border-white/5 pb-1 mb-6">
              <div className="flex justify-between gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${activeTab === 'overview'
                      ? 'border-[#e50914] text-white'
                      : 'border-transparent text-[#808080] hover:text-white'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${activeTab === 'characters'
                      ? 'border-[#e50914] text-white'
                      : 'border-transparent text-[#808080] hover:text-white'
                    }`}
                >
                  Characters
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${activeTab === 'staff'
                      ? 'border-[#e50914] text-white'
                      : 'border-transparent text-[#808080] hover:text-white'
                    }`}
                >
                  Staff
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${activeTab === 'stats'
                      ? 'border-[#e50914] text-white'
                      : 'border-transparent text-[#808080] hover:text-white'
                    }`}
                >
                  Stats
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Characters & Voice Actors Preview list */}
                {anime.characterPreview?.edges && anime.characterPreview.edges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Key Cast & Seiyuu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {anime.characterPreview.edges.filter(Boolean).map(edge => {
                        const charNode = edge?.node
                        const vaNode = edge?.voiceActors?.[0]
                        if (!charNode) return null

                        return (
                          <div
                            key={edge.id || charNode.id}
                            className="rounded-xl bg-white/[0.01] border border-white/5 p-3 flex justify-between items-center gap-3"
                          >
                            {/* Character Details */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/5">
                                {charNode.image?.large && (
                                  <Image
                                    src={charNode.image.large}
                                    alt={charNode.name?.userPreferred || ''}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {charNode.name?.userPreferred}
                                </h4>
                                <span className="text-[9px] text-[#808080] capitalize">
                                  {edge.role?.toLowerCase() || 'Cast'}
                                </span>
                              </div>
                            </div>

                            {/* Japanese Voice Actor Details */}
                            {vaNode && (
                              <div className="flex items-center gap-2.5 text-right justify-end min-w-0">
                                <div className="min-w-0">
                                  <h5 className="text-[10px] font-bold text-[#b3b3b3] truncate">
                                    {vaNode.name?.userPreferred}
                                  </h5>
                                  <span className="text-[8px] text-[#555] block">JP Actor</span>
                                </div>
                                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/5">
                                  {vaNode.image?.large && (
                                    <Image
                                      src={vaNode.image.large}
                                      alt={vaNode.name?.userPreferred || ''}
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Key Production Staff Preview (Slice to 4) */}
                {anime.staffPreview?.edges && anime.staffPreview.edges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Key Production Staff
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {anime.staffPreview.edges
                        .filter(Boolean)
                        .slice(0, 4)
                        .map(edge => {
                          const staffNode = edge?.node
                          if (!staffNode) return null

                          return (
                            <div
                              key={edge.id || staffNode.id}
                              className="rounded-xl bg-white/[0.01] border border-white/5 p-3 flex items-center gap-3"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/5">
                                {staffNode.image?.large && (
                                  <Image
                                    src={staffNode.image.large}
                                    alt={staffNode.name?.userPreferred || ''}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {staffNode.name?.userPreferred}
                                </h4>
                                <span className="text-[9px] text-[#808080] capitalize block truncate">
                                  {edge.role || 'Staff'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* Relations list */}
                {anime.relations?.edges && anime.relations.edges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Franchise Relations
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {anime.relations.edges.filter(Boolean).map(edge => {
                        const node = edge?.node
                        if (!node) return null
                        const rTitle = node.title?.userPreferred || 'Related'
                        const rCover = node.coverImage?.large || ''
                        const relationType = edge.relationType?.replace(/_/g, ' ') || 'Relation'

                        return (
                          <Link
                            key={edge.id || node.id}
                            href={`/anime/${node.id}`}
                            className="group flex flex-col text-left cursor-pointer"
                          >
                            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 mb-2">
                              {rCover && (
                                <Image
                                  src={rCover}
                                  alt={rTitle}
                                  fill
                                  sizes="(max-width: 640px) 50vw, 20vw"
                                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-black/80 border border-white/10 text-white z-10">
                                {relationType}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-bold text-[#b3b3b3] group-hover:text-white line-clamp-1 truncate transition-colors">
                              {rTitle}
                            </h4>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {anime.externalLinks && anime.externalLinks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Streaming & External Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {anime.externalLinks.filter(Boolean).map(link => {
                        if (!link || !link.url) return null
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white transition-all flex items-center gap-1.5"
                          >
                            {link.site}
                            <ChevronRightIcon size={12} className="text-[#808080]" />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}

                {anime.trailer?.id && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Trailer
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <iframe
                        width="800"                                                                                               
                        height="450"
                        src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {anime.recommendations?.nodes && anime.recommendations.nodes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      You Might Also Like
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {anime.recommendations.nodes
                        .filter(node => node && node.mediaRecommendation)
                        .slice(0, 5)
                        .map((node, i) => {
                          const recMedia = node?.mediaRecommendation
                          if (!recMedia) return null
                          const recTitle = recMedia.title?.userPreferred || 'Recommendation'
                          const recCover = recMedia.coverImage?.large || ''

                          return (
                            <Link
                              key={recMedia.id || i}
                              href={`/anime/${recMedia.id}`}
                              className="group flex flex-col text-left cursor-pointer"
                            >
                              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 mb-2">
                                {recCover && (
                                  <Image
                                    src={recCover}
                                    alt={recTitle}
                                    fill
                                    sizes="(max-width: 640px) 50vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <h4 className="text-[11px] font-bold text-[#b3b3b3] group-hover:text-white line-clamp-1 truncate transition-colors">
                                {recTitle}
                              </h4>
                            </Link>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="space-y-8">
                {allCharacters && allCharacters.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Characters & Voice Actors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allCharacters
                        .filter(Boolean)
                        .map((edge, index) => {
                          const charNode = edge?.node
                          if (!charNode) return null

                          const vaRole = edge?.voiceActorRoles?.find((v: any) => v?.voiceActor?.language === 'Japanese') || edge?.voiceActorRoles?.[0]
                          const voiceActor = vaRole?.voiceActor

                          return (
                            <div
                              key={`${edge.id || charNode.id}-${index}`}
                              className="flex justify-between rounded-xl bg-white/[0.01] border border-white/5 overflow-hidden h-20 transition-all hover:border-white/10 hover:bg-white/[0.03]"
                            >
                              {/* Character Info */}
                              <div className="flex gap-3">
                                <div className="relative w-14 h-full bg-white/5 shrink-0">
                                  {charNode.image?.large && (
                                    <Image
                                      src={charNode.image.large}
                                      alt={charNode.name?.userPreferred || ''}
                                      fill
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col justify-center min-w-0 py-2">
                                  <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                                    {charNode.name?.userPreferred}
                                  </h4>
                                  <span className="text-[10px] text-[#808080] capitalize mt-0.5">
                                    {edge.role?.toLowerCase() || 'Supporting'}
                                  </span>
                                </div>
                              </div>

                              {/* Voice Actor Info */}
                              {voiceActor && (
                                <div className="flex gap-3">
                                  <div className="flex flex-col justify-center items-end min-w-0 py-2 text-right">
                                    <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                                      {voiceActor.name?.userPreferred}
                                    </h4>
                                    <span className="text-[10px] text-[#808080] mt-0.5">
                                      {voiceActor.language || 'Japanese'}
                                    </span>
                                  </div>
                                  <div className="relative w-14 h-full bg-white/5 shrink-0">
                                    {voiceActor.image?.large && (
                                      <Image
                                        src={voiceActor.image.large}
                                        alt={voiceActor.name?.userPreferred || ''}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                    {hasNextPage && (
                      <div ref={loaderRef} className="py-8 flex justify-center items-center">
                        <div className="w-6 h-6 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#808080]">No character information available.</p>
                )}
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="space-y-8">
                {/* Full Production Staff List */}
                {allStaff && allStaff.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                      Production Staff
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {allStaff
                        .filter(Boolean)
                        .map((edge, index) => {
                          const staffNode = edge?.node
                          if (!staffNode) return null

                          return (
                            <div
                              key={`${edge.id || staffNode.id}-${index}`}
                              className="rounded-xl bg-white/[0.01] border border-white/5 p-3 flex items-center gap-3"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/5">
                                {staffNode.image?.large && (
                                  <Image
                                    src={staffNode.image.large}
                                    alt={staffNode.name?.userPreferred || ''}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {staffNode.name?.userPreferred}
                                </h4>
                                <span className="text-[9px] text-[#808080] capitalize block truncate">
                                  {edge.role || 'Staff'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    {hasNextStaffPage && (
                      <div ref={staffLoaderRef} className="py-8 flex justify-center items-center">
                        <div className="w-6 h-6 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#808080]">No production staff information available.</p>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 uppercase font-mono tracking-widest text-xs">
                    Platform Statistics
                  </h3>
                  {hasMounted ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Recent Activity Per Day (Full Width) */}
                      {statsData?.Media?.trends?.nodes && statsData.Media.trends.nodes.length > 0 ? (
                        <div className="lg:col-span-2">
                          <RecentActivityChart
                            data={statsData.Media.trends.nodes
                              .filter(Boolean)
                              .map(n => ({
                                date: formatTrendDate(n?.date),
                                trending: n?.trending || 0
                              }))
                              .reverse()
                            }
                          />
                        </div>
                      ) : null}

                      {/* Airing Score Progression (Full Width) */}
                      {statsData?.Media?.airingTrends?.nodes && statsData.Media.airingTrends.nodes.length > 0 ? (
                        <div className="lg:col-span-2">
                          <AiringScoreChart
                            data={statsData.Media.airingTrends.nodes
                              .filter(Boolean)
                              .map(n => ({
                                episode: `${n?.episode || 0}`,
                                score: n?.averageScore || 0
                              }))
                              .reverse()
                            }
                          />
                        </div>
                      ) : null}

                      {/* Airing Watchers Progression (Full Width) */}
                      {statsData?.Media?.airingTrends?.nodes && statsData.Media.airingTrends.nodes.length > 0 ? (
                        <div className="lg:col-span-2">
                          <AiringWatchersChart
                            data={statsData.Media.airingTrends.nodes
                              .filter(Boolean)
                              .map(n => ({
                                episode: `${n?.episode || 0}`,
                                watchers: n?.inProgress || 0
                              }))
                              .reverse()
                            }
                          />
                        </div>
                      ) : null}

                      {/* Status distribution chart */}
                      {statsData?.Media?.distribution?.status && statsData.Media.distribution.status.length > 0 ? (
                        <StatusChart
                          data={statsData.Media.distribution.status
                            .map(d => {
                              if (!d) return { status: '', amount: 0 }
                              return {
                                status: d.status?.toLowerCase().replace(/_/g, ' ') || '',
                                amount: d.amount || 0
                              }
                            })
                          }
                        />
                      ) : (
                        <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-center">
                          <p className="text-xs text-[#808080]">No status distribution data available.</p>
                        </div>
                      )}

                      {/* Score distribution chart */}
                      {statsData?.Media?.distribution?.score && statsData.Media.distribution.score.length > 0 ? (
                        <ScoreChart
                          data={statsData.Media.distribution.score
                            .map(d => {
                              if (!d) return { score: '', amount: 0 }
                              return {
                                score: `${d.score || 0}`,
                                amount: d.amount || 0
                              }
                            })
                          }
                        />
                      ) : (
                        <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-center">
                          <p className="text-xs text-[#808080]">No score distribution data available.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-center animate-pulse">
                      <p className="text-xs text-[#808080]">Loading charts...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
