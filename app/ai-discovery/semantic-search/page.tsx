'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { SearchIcon, SparklesIcon, ChevronLeftIcon, StarIcon } from '../../constants/icons'

interface AnimeResult {
  id: number
  score: number
  title_romaji: string
  title_english: string | null
  format: string | null
  start_year: number | null
  genres: string[]
  tags: string[]
  description: string
  cover_image: string | null
  episodes: number | null
}

const sampleSuggestions = [
  "emotional and philosophical slice of life with space travel",
  "dark psychological thriller with detective mystery and mind games",
  "relaxing and peaceful camping trip in nature",
  "intense action battle shounen with superpowers and tournament arc"
]

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('')
  const [filterAdult, setFilterAdult] = useState(true)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnimeResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError(null)
    setQuery(searchQuery)
    setSearched(true)

    try {
      const response = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, filterAdult }),
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve semantic search results.')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during search.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16 flex-grow w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/ai-discovery"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeftIcon size={16} />
            Back to AI Suite
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <SparklesIcon size={14} className="animate-spin" />
            AI-Driven Retrieval
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Semantic Anime Search
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Find anime by describing complex feelings, narrative themes, or settings. Our AI maps the semantic meaning of your query directly to the database records.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          {/* Safe Search Switch */}
          <div className="flex justify-start mb-2 ml-1 items-center shrink-0">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filterAdult}
                onChange={(e) => setFilterAdult(!filterAdult)}
                className="sr-only peer"
              />
              <div className="relative w-8 h-4.5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:inset-s-[3px] after:bg-gray-400 peer-checked:after:bg-red-500 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500/20 border border-white/5 peer-checked:border-red-500/50"></div>
              <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-300 transition-colors select-none">
                Safe Search (Filter Adult Content)
              </span>
            </label>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-4  text-gray-400">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe feelings, themes, or moments... (e.g. piano duet romance)"
              className="w-full bg-[#161616]/80 border border-white/5 focus:border-red-500/50 rounded-2xl py-4 pl-12 pr-28 text-sm focus:outline-none transition-all placeholder:text-gray-500 shadow-2xl glass-heavy"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-[#e50914] hover:bg-[#f6121d] transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Analyze'}
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {sampleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-white/5 mb-4" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error loading results</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && !error && (
            <div className="text-center py-16 text-gray-400">
              No matching anime found. Try refining your description.
            </div>
          )}

          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {results.map((anime, idx) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 shadow-xl"
                >
                  <div>
                    {/* Image Container with Match Badge */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-white/5">
                      {anime.cover_image ? (
                        <img
                          src={anime.cover_image}
                          alt={anime.title_romaji}
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          No Image
                        </div>
                      )}
                      {/* Similarity Badge */}
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 border border-red-500/30 text-red-500 font-bold text-[10px] sm:text-xs shadow-lg">
                        {Math.round(anime.score * 10) / 10}% Match
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm sm:text-base group-hover:text-red-500 transition-colors line-clamp-1">
                      {anime.title_romaji}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                      {anime.title_english || anime.title_romaji}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] text-gray-500">
                      <span>{anime.format || 'TV'}</span>
                      {anime.start_year && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span>{anime.start_year}</span>
                        </>
                      )}
                      {anime.episodes && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span>{anime.episodes} eps</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                      {anime.description}
                    </p>
                  </div>

                  <Link
                    href={`/anime/${anime.id}`}
                    className="w-full py-2.5 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-center text-xs font-semibold tracking-wide transition-all"
                  >
                    View Details
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
