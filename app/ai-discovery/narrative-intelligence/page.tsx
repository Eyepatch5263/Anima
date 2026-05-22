'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { BrainIcon, ChevronLeftIcon, SearchIcon, SparklesIcon } from '../../constants/icons'

interface NarrativeProfile {
  anime_id: number
  title: string
  emotional_tones: string[]
  pacing_style: string[]
  narrative_themes: string[]
  patroganist_traits: string[]
  psychological_elements: string[]
  emotional_intensity: string[]
  story_structure: string[]
  atmosphere: string[]
  cover_image?: string
  banner_image?: string
  synopsis?: string
  genres?: string[]
  tags?: string[]
}

const keyShowcases = [
  { id: 154587, name: 'Frieren' },
  { id: 16498, name: 'Attack on Titan' },
  { id: 30, name: 'Neon Genesis Evangelion' }
]

export default function NarrativeIntelligencePage() {
  const [selectedId, setSelectedId] = useState<number>(154587)
  const [selectedProfile, setSelectedProfile] = useState<NarrativeProfile | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NarrativeProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the selected showcase profile
  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/narrative-profile?id=${selectedId}`)
        if (!res.ok) {
          throw new Error('Failed to load narrative profile')
        }
        const data = await res.json()
        setSelectedProfile(data.profile)
      } catch (err: any) {
        setError(err.message || 'Error loading profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [selectedId])

  // Handle Narrative Query Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    setIsSearching(true)
    setError(null)

    try {
      const res = await fetch('/api/narrative-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          limit: 6,
          filterAdult: true
        })
      })
      if (!res.ok) {
        throw new Error('Failed to query narrative index')
      }
      const data = await res.json()
      setSearchResults(data.results || [])

      if (data.results && data.results.length > 0) {
        setSelectedProfile(data.results[0])
      }
    } catch (err: any) {
      setError(err.message || 'Error querying vectors')
    } finally {
      setSearchLoading(false)
    }
  }

  const getSignatureMetrics = (profile: NarrativeProfile) => {
    // Determine depth markers based on length of descriptor arrays
    const philoScore = Math.min(98, 65 + (profile.narrative_themes?.length || 0) * 6)
    const pacingScore = Math.min(95, 55 + (profile.pacing_style?.length || 0) * 8)
    const psychoScore = Math.min(98, 60 + (profile.psychological_elements?.length || 0) * 7)
    const structureScore = Math.min(96, 50 + (profile.story_structure?.length || 0) * 9)
    const emotionalScore = Math.min(97, 55 + (profile.emotional_tones?.length || 0) * 8)

    return [
      { name: "Philosophical Depth", value: philoScore, description: "Existential and metaphysical questioning metric." },
      { name: "Pacing Rigor", value: pacingScore, description: "Flow transition dynamics and build tempo." },
      { name: "Psychological Intensity", value: psychoScore, description: "Mental conflict complexity and internal character trauma." },
      { name: "Structural Complexity", value: structureScore, description: "Timeline layout and timeline design layers." },
      { name: "Emotional Resonance", value: emotionalScore, description: "Catharsis coefficient and ambient tone weight." }
    ]
  }

  return (
    <div className="relative min-h-screen bg-[#060606] text-white overflow-x-hidden flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16 flex-grow w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/ai-discovery"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeftIcon size={14} />
            Back to AI Discovery
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <BrainIcon size={13} />
            Narrative Intelligence Index
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
            Narrative Signature Index
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Search and query narrative traits. Our engine extracts emotional atmospheres, paces, protagonist internal struggles, and thematic patterns to build semantic maps.
          </p>
        </div>

        {/* Search Engine Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative flex items-center bg-[#0d0d0d]/80 border border-white/10 rounded-2xl p-1.5 focus-within:border-blue-500/50 shadow-[0_15px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="pl-3.5 text-gray-400">
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              placeholder="Search narrative traits (e.g., 'existential isolation slow burn')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm px-3 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {searchLoading ? 'Analyzing...' : 'Analyze'}
              <SparklesIcon size={12} />
            </button>
          </form>
        </div>

        {/* Anime Selector Tabs */}
        {!isSearching && (
          <div className="flex justify-center gap-2 mb-10 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl max-w-md mx-auto glass-heavy shadow-inner">
            {keyShowcases.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedId(tab.id)
                  setIsSearching(false)
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${selectedId === tab.id && !isSearching
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Results Ribbon */}
        {isSearching && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Vector Results ({searchResults.length})
              </span>
              <button
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery('')
                  setSelectedId(154587)
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear Search
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {searchResults.map((item) => (
                <button
                  key={item.anime_id}
                  onClick={() => setSelectedProfile(item)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${selectedProfile?.anime_id === item.anime_id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Panel Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-gray-400"
            >
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Fetching narrative signatures...</p>
            </motion.div>
          ) : selectedProfile ? (
            <motion.div
              key={selectedProfile.anime_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
            >
              {/* Summary and Art panel */}
              <div className="lg:col-span-2 flex flex-col glass-heavy border border-white/5 bg-[#0a0a0a]/50 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-md">

                {/* Banner overlay backing */}
                {selectedProfile.banner_image && (
                  <div className="absolute top-0 left-0 right-0 h-32 opacity-15 pointer-events-none z-0">
                    <img
                      src={selectedProfile.banner_image}
                      alt=""
                      className="w-full h-full object-cover filter blur"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  </div>
                )}

                <div className="relative z-10 flex gap-4 mb-6">
                  {selectedProfile.cover_image && (
                    <img
                      src={selectedProfile.cover_image}
                      alt={selectedProfile.title}
                      className="w-20 h-28 object-cover rounded-xl border border-white/10 shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex flex-col justify-end">
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest block mb-1">
                      Narrative Profile
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-2">
                      {selectedProfile.title}
                    </h2>
                    {selectedProfile.genres && selectedProfile.genres.length > 0 && (
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                        {selectedProfile.genres.slice(0, 3).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">
                    Synopsis
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-6 mb-4">
                    {selectedProfile.synopsis || "No description available."}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/5 mt-auto">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">
                    Genres & Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.genres?.slice(0, 2).map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-400">
                        {g}
                      </span>
                    ))}
                    {selectedProfile.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/10 text-[9px] text-blue-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Narrative Attributes display */}
              <div className="lg:col-span-3 space-y-6">

                {/* 100-point signature metrics index */}
                <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/50 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-md space-y-5">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">
                    Signature Indexes
                  </span>
                  <div className="space-y-4">
                    {getSignatureMetrics(selectedProfile).map((metric, idx) => (
                      <div key={metric.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>{metric.name}</span>
                          <span className="text-blue-400">{metric.value}/100</span>
                        </div>
                        {/* Progress slider bar */}
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.08 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          />
                        </div>
                        <p className="text-[9px] text-gray-500">
                          {metric.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative Fields details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emotional Tones */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">
                      Emotional Tones
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.emotional_tones?.map((tone) => (
                        <span key={tone} className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Atmosphere */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block mb-2">
                      Atmosphere
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.atmosphere?.map((atm) => (
                        <span key={atm} className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-medium text-cyan-300">
                          {atm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pacing Style */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block mb-2">
                      Pacing Style
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.pacing_style?.map((pac) => (
                        <span key={pac} className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-medium text-blue-300">
                          {pac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Emotional Intensity */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider block mb-2">
                      Emotional Intensity
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.emotional_intensity?.map((int) => (
                        <span key={int} className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-medium text-rose-300">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Protagonist Traits */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block mb-2">
                      Protagonist Traits
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.patroganist_traits?.map((trt) => (
                        <span key={trt} className="px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[10px] font-medium text-teal-300">
                          {trt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Psychological Elements */}
                  <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block mb-2">
                      Psychological Elements
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProfile.psychological_elements?.map((psy) => (
                        <span key={psy} className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-300">
                          {psy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Narrative Themes */}
                <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block mb-2">
                    Narrative Themes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.narrative_themes?.map((thm) => (
                      <span key={thm} className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-300">
                        {thm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Story Structure */}
                <div className="glass-heavy border border-white/5 bg-[#0a0a0a]/30 p-5 rounded-2xl shadow-lg backdrop-blur-md hover:border-white/10 transition-colors">
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block mb-2">
                    Story Structure
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.story_structure?.map((str) => (
                      <span key={str} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-300">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No narrative profile active. Check search query or select tabs.
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
